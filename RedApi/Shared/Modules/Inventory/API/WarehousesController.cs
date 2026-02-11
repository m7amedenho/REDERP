using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Auditing;
using RedApi.Shared.Data;
using RedApi.Modules.Inventory.Domain;

namespace RedApi.Modules.Inventory.API;

[ApiController]
[Route("api/inventory/warehouses")]
public class WarehousesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IAuditService _audit;

    public WarehousesController(AppDbContext db, IAuditService audit) { _db = db; _audit = audit; }

    [HttpGet]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> List([FromQuery] Guid orgUnitId)
    {
        var rows = await _db.Warehouses.AsNoTracking()
            .Where(w => w.OrgUnitId == orgUnitId && w.IsActive)
            .OrderBy(w => w.Type).ThenBy(w => w.Code)
            .Select(w => new { w.Id, w.Code, w.Name, w.Type, w.OwnerUserId, w.OwnerRepCode })
            .ToListAsync();

        return Ok(rows);
    }

    public record CreateWarehouseDto(Guid OrgUnitId, string Code, string Name, WarehouseType Type);

    [HttpPost("create")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> Create([FromBody] CreateWarehouseDto dto)
    {
        var wh = new Warehouse
        {
            OrgUnitId = dto.OrgUnitId,
            Code = dto.Code.Trim().ToUpperInvariant(),
            Name = dto.Name.Trim(),
            Type = dto.Type,
            IsActive = true
        };

        _db.Warehouses.Add(wh);
        await _db.SaveChangesAsync();

        await _audit.LogAsync(HttpContext, "CreateWarehouse", "Warehouse", wh.Id.ToString(),
            null, new { wh.Code, wh.Name, wh.Type }, dto.OrgUnitId);

        return Ok(new { wh.Id });
    }

    public record EnsureMobileDto(Guid OrgUnitId, string RepUserId, string RepCode);

    [HttpPost("mobile/ensure")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> EnsureMobile([FromBody] EnsureMobileDto dto)
    {
        var repCode = dto.RepCode.Trim().ToUpperInvariant();
        var existing = await _db.Warehouses.FirstOrDefaultAsync(w =>
            w.OrgUnitId == dto.OrgUnitId && w.Type == WarehouseType.Mobile && w.OwnerUserId == dto.RepUserId && w.IsActive);

        if (existing != null) return Ok(new { existing.Id });

        var wh = new Warehouse
        {
            OrgUnitId = dto.OrgUnitId,
            Type = WarehouseType.Mobile,
            OwnerUserId = dto.RepUserId,
            OwnerRepCode = repCode,
            Code = $"REP-{repCode}",
            Name = $"مخزن مندوب {repCode}",
            IsActive = true
        };

        _db.Warehouses.Add(wh);
        await _db.SaveChangesAsync();

        await _audit.LogAsync(HttpContext, "EnsureRepMobileWarehouse", "Warehouse", wh.Id.ToString(),
            null, new { wh.Code, wh.OwnerUserId, wh.OwnerRepCode }, dto.OrgUnitId);

        return Ok(new { wh.Id });
    }
}
