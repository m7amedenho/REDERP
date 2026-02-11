using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Services;
using RedApi.Shared.Auditing;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Controllers;

[ApiController]
[Route("api/org")]
public class OrgController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IOrgUnitService _orgSvc;
    private readonly IAuditService _audit;

    public OrgController(AppDbContext db, IOrgUnitService orgSvc, IAuditService audit)
    {
        _db = db;
        _orgSvc = orgSvc;
        _audit = audit;
    }

    // ✅ GET root id (ALEX)
    [HttpGet("root")]
    [Authorize(Policy = "Org.View")]
    public async Task<IActionResult> GetRoot()
    {
        var id = await _orgSvc.EnsureRootAlexAsync();
        return Ok(new { id, name = "ALEX" });
    }

    // ✅ GET: flat list (frontend يبني tree)
    [HttpGet("tree")]
    [Authorize(Policy = "Org.View")]
    public async Task<IActionResult> GetTree()
    {
        var units = await _db.OrgUnits
            .AsNoTracking()
            .OrderBy(x => x.ParentId)
            .ThenBy(x => x.Name)
            .Select(x => new { x.Id, x.Name, x.Type, x.ParentId, x.IsActive })
            .ToListAsync();

        return Ok(units);
    }

    public record CreateOrgUnitDto(string Name, OrgUnitType Type, Guid? ParentId);

    [HttpPost("create")]
    [Authorize(Policy = "Org.Create")]
    public async Task<IActionResult> Create([FromBody] CreateOrgUnitDto dto)
    {
        var unit = new OrgUnit
        {
            Name = dto.Name.Trim(),
            Type = dto.Type,
            ParentId = dto.ParentId,
            IsActive = true
        };

        await _orgSvc.CreateOrgUnitAsync(unit);
        await _audit.LogAsync(
            HttpContext,
            "CreateOrgUnit",
            "OrgUnit",
            unit.Id.ToString(),
            null,
            AuditSnapshots.OrgUnit(unit),
            unit.ParentId
        );

        return Ok(new { unit.Id });
    }

    public record UpdateOrgUnitDto(Guid Id, string Name, bool IsActive);

    [HttpPost("update")]
    [Authorize(Policy = "Org.Update")]
    public async Task<IActionResult> Update([FromBody] UpdateOrgUnitDto dto)
    {
        var before = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.Id);

        await _orgSvc.UpdateOrgUnitAsync(dto.Id, dto.Name, dto.IsActive);

        var after = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.Id);
        await _audit.LogAsync(
            HttpContext,
            "UpdateOrgUnit",
            "OrgUnit",
            dto.Id.ToString(),
            AuditSnapshots.OrgUnit(before),
            AuditSnapshots.OrgUnit(after),
            after.ParentId
        );

        return Ok();
    }

    public record DeactivateOrgUnitDto(Guid Id);

    [HttpPost("deactivate")]
    [Authorize(Policy = "Org.Update")]
    public async Task<IActionResult> Deactivate([FromBody] DeactivateOrgUnitDto dto)
    {
        var before = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.Id);

        await _orgSvc.DeactivateOrgUnitAsync(dto.Id);

        var after = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.Id);
        await _audit.LogAsync(
            HttpContext,
            "DeactivateOrgUnit",
            "OrgUnit",
            dto.Id.ToString(),
            AuditSnapshots.OrgUnit(before),
            AuditSnapshots.OrgUnit(after),
            after.ParentId
        );

        return Ok();
    }

    public record MoveOrgUnitDto(Guid OrgUnitId, Guid? NewParentId);

    [HttpPost("move")]
    [Authorize(Policy = "Org.Update")]
    public async Task<IActionResult> Move([FromBody] MoveOrgUnitDto dto)
    {
        var before = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.OrgUnitId);

        await _orgSvc.MoveOrgUnitAsync(dto.OrgUnitId, dto.NewParentId);

        var after = await _db.OrgUnits.AsNoTracking().FirstAsync(x => x.Id == dto.OrgUnitId);
        await _audit.LogAsync(
            HttpContext,
            "MoveOrgUnit",
            "OrgUnit",
            dto.OrgUnitId.ToString(),
            AuditSnapshots.OrgUnit(before),
            AuditSnapshots.OrgUnit(after),
            dto.NewParentId
        );

        return Ok();
    }
}
