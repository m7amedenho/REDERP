using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Services;

public record EffectiveAccessDto(
    Guid OrgUnitId,
    List<string> RoleNames,
    List<string> PermissionKeys
);

public interface IAccessResolver
{
    Task<EffectiveAccessDto> GetEffectiveAccessAsync(string userId, Guid orgUnitId);
}

public class AccessResolver : IAccessResolver
{
    private readonly AppDbContext _db;
    private readonly RoleManager<IdentityRole> _roleMgr;

    public AccessResolver(AppDbContext db, RoleManager<IdentityRole> roleMgr)
    {
        _db = db;
        _roleMgr = roleMgr;
    }

    public async Task<EffectiveAccessDto> GetEffectiveAccessAsync(string userId, Guid orgUnitId)
    {
        // ancestors including self
        var ancestorIds = await _db.OrgUnitClosures
            .Where(x => x.DescendantId == orgUnitId)
            .Select(x => x.AncestorId)
            .ToListAsync();

        // effective scopes => roleIds
        var roleIds = await _db.UserRoleScopes
            .Where(s => s.UserId == userId)
            .Where(s =>
                s.OrgUnitId == orgUnitId
                || (s.AppliesToChildren && ancestorIds.Contains(s.OrgUnitId))
            )
            .Select(s => s.RoleId)
            .Distinct()
            .ToListAsync();

        // role names
        var roleNames = await _db.Roles
            .Where(r => roleIds.Contains(r.Id))
            .Select(r => r.Name!)
            .ToListAsync();

        // permissions
        var permissionKeys = await _db.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Select(rp => rp.Permission.Key)
            .Distinct()
            .ToListAsync();

        permissionKeys.Sort(StringComparer.Ordinal);
        roleNames.Sort(StringComparer.Ordinal);

        return new EffectiveAccessDto(orgUnitId, roleNames, permissionKeys);
    }
}
