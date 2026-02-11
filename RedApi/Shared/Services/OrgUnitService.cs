using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Services;

public class OrgUnitService : IOrgUnitService
{
    private readonly AppDbContext _db;
    public OrgUnitService(AppDbContext db) => _db = db;

    public async Task<Guid> EnsureRootAlexAsync()
    {
        // Root = ALEX (Branch root or Region root — هنا هنعمله Region عشان تحته فروع)
        var root = await _db.OrgUnits.FirstOrDefaultAsync(x => x.ParentId == null && x.Name == "ALEX");
        if (root != null)
        {
            // تأكد closure موجود
            var hasSelf = await _db.OrgUnitClosures.AnyAsync(c => c.AncestorId == root.Id && c.DescendantId == root.Id && c.Depth == 0);
            if (!hasSelf)
            {
                _db.OrgUnitClosures.Add(new OrgUnitClosure { AncestorId = root.Id, DescendantId = root.Id, Depth = 0 });
                await _db.SaveChangesAsync();
            }
            return root.Id;
        }

        root = new OrgUnit
        {
            Name = "ALEX",
            Type = OrgUnitType.Region,
            ParentId = null,
            IsActive = true
        };

        await CreateOrgUnitAsync(root);
        return root.Id;
    }

    public async Task CreateOrgUnitAsync(OrgUnit unit)
    {
        // validations
        if (string.IsNullOrWhiteSpace(unit.Name))
            throw new InvalidOperationException("Org unit name is required.");

        // Parent rules
        if (unit.ParentId.HasValue)
        {
            var parent = await _db.OrgUnits.FirstOrDefaultAsync(x => x.Id == unit.ParentId.Value);
            if (parent == null) throw new InvalidOperationException("Parent org unit not found.");
            if (!parent.IsActive) throw new InvalidOperationException("Parent org unit is inactive.");

            if (!IsAllowedChild(parent.Type, unit.Type))
                throw new InvalidOperationException($"Cannot create {unit.Type} under {parent.Type}.");
        }
        else
        {
            // root allowed only for Region
            if (unit.Type != OrgUnitType.Region)
                throw new InvalidOperationException("Root must be Region.");
        }

        _db.OrgUnits.Add(unit);
        await _db.SaveChangesAsync();

        // closure: self
        _db.OrgUnitClosures.Add(new OrgUnitClosure
        {
            AncestorId = unit.Id,
            DescendantId = unit.Id,
            Depth = 0
        });

        // closure: inherit ancestors from parent
        if (unit.ParentId.HasValue)
        {
            var parentAncestors = await _db.OrgUnitClosures
                .Where(x => x.DescendantId == unit.ParentId.Value)
                .ToListAsync();

            foreach (var a in parentAncestors)
            {
                _db.OrgUnitClosures.Add(new OrgUnitClosure
                {
                    AncestorId = a.AncestorId,
                    DescendantId = unit.Id,
                    Depth = a.Depth + 1
                });
            }
        }

        await _db.SaveChangesAsync();
    }

    public async Task UpdateOrgUnitAsync(Guid id, string name, bool isActive)
    {
        var unit = await _db.OrgUnits.FirstOrDefaultAsync(x => x.Id == id);
        if (unit == null) throw new InvalidOperationException("Org unit not found.");

        unit.Name = name?.Trim() ?? unit.Name;
        unit.IsActive = isActive;

        await _db.SaveChangesAsync();
    }

    public async Task DeactivateOrgUnitAsync(Guid id)
    {
        var unit = await _db.OrgUnits.FirstOrDefaultAsync(x => x.Id == id);
        if (unit == null) throw new InvalidOperationException("Org unit not found.");

        // Deactivate subtree
        var descIds = await _db.OrgUnitClosures
            .Where(c => c.AncestorId == id)
            .Select(c => c.DescendantId)
            .Distinct()
            .ToListAsync();

        var nodes = await _db.OrgUnits.Where(x => descIds.Contains(x.Id)).ToListAsync();
        foreach (var n in nodes) n.IsActive = false;

        await _db.SaveChangesAsync();
    }

    public async Task MoveOrgUnitAsync(Guid unitId, Guid? newParentId)
    {
        var node = await _db.OrgUnits.FirstOrDefaultAsync(x => x.Id == unitId);
        if (node == null) throw new InvalidOperationException("Org unit not found.");

        if (newParentId == null)
        {
            // only allow moving to root if node is Region (and you want multiple roots)
            // In your ERP: root is only ALEX, فهنمنع null إلا لو هو ALEX نفسه
            if (node.Name != "ALEX")
                throw new InvalidOperationException("Only ALEX can be root. Cannot move to root.");
        }
        else
        {
            var newParent = await _db.OrgUnits.FirstOrDefaultAsync(x => x.Id == newParentId.Value);
            if (newParent == null) throw new InvalidOperationException("New parent not found.");
            if (!newParent.IsActive) throw new InvalidOperationException("New parent is inactive.");

            // prevent cycle: newParent cannot be inside subtree of node
            var isDesc = await _db.OrgUnitClosures.AnyAsync(c => c.AncestorId == unitId && c.DescendantId == newParentId.Value);
            if (isDesc) throw new InvalidOperationException("Invalid move (cycle).");

            if (!IsAllowedChild(newParent.Type, node.Type))
                throw new InvalidOperationException($"Cannot move {node.Type} under {newParent.Type}.");
        }

        // Update adjacency
        node.ParentId = newParentId;
        await _db.SaveChangesAsync();

        // Rebuild closure for subtree (safe + strong for core)
        await RebuildClosureForSubtree(unitId);
    }

    private async Task RebuildClosureForSubtree(Guid rootId)
    {
        // get subtree descendants
        var subtreeDescendants = await _db.OrgUnitClosures
            .Where(x => x.AncestorId == rootId)
            .Select(x => x.DescendantId)
            .Distinct()
            .ToListAsync();

        // delete closures for subtree nodes (as descendants)
        var toDelete = await _db.OrgUnitClosures
            .Where(x => subtreeDescendants.Contains(x.DescendantId))
            .ToListAsync();

        _db.OrgUnitClosures.RemoveRange(toDelete);
        await _db.SaveChangesAsync();

        // rebuild using adjacency list
        var nodes = await _db.OrgUnits.ToListAsync();
        var childrenMap = nodes
            .GroupBy(n => n.ParentId)
            .ToDictionary(g => g.Key, g => g.ToList());

        List<OrgUnit> subtree = new();
        void Dfs(Guid id)
        {
            var curr = nodes.First(n => n.Id == id);
            subtree.Add(curr);
            if (childrenMap.TryGetValue(id, out var kids))
                foreach (var k in kids) Dfs(k.Id);
        }
        Dfs(rootId);

        // ensure parent's closure exists (if parent outside subtree)
        foreach (var u in subtree)
        {
            _db.OrgUnitClosures.Add(new OrgUnitClosure { AncestorId = u.Id, DescendantId = u.Id, Depth = 0 });

            if (u.ParentId.HasValue)
            {
                var parentAncestors = await _db.OrgUnitClosures
                    .Where(x => x.DescendantId == u.ParentId.Value)
                    .ToListAsync();

                foreach (var a in parentAncestors)
                {
                    _db.OrgUnitClosures.Add(new OrgUnitClosure
                    {
                        AncestorId = a.AncestorId,
                        DescendantId = u.Id,
                        Depth = a.Depth + 1
                    });
                }
            }
        }

        await _db.SaveChangesAsync();
    }

    private static bool IsAllowedChild(OrgUnitType parent, OrgUnitType child)
    {
        // ALEX (Region) -> Branch / Team / Department (لو عايز)
        // Branch -> Department / Team
        // Department -> Team
        // Team -> (none)
        return parent switch
        {
            OrgUnitType.Region => child is OrgUnitType.Branch or OrgUnitType.Department or OrgUnitType.Team,
            OrgUnitType.Branch => child is OrgUnitType.Department or OrgUnitType.Team,
            OrgUnitType.Department => child is OrgUnitType.Team,
            OrgUnitType.Team => false,
            _ => false
        };
    }
}
