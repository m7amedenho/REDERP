using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Data;

namespace RedApi.Controllers;

[ApiController]
[Route("api/access")]
public class AccessController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly RoleManager<IdentityRole> _roleMgr;

    public AccessController(AppDbContext db, RoleManager<IdentityRole> roleMgr)
    {
        _db = db;
        _roleMgr = roleMgr;
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> My([FromQuery] Guid orgUnitId)
    {
        var userId = User.FindFirst("Id")?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        // Admin/CEO global
        var isAdmin = User.IsInRole("Admin");
        var isCeo = User.IsInRole("CEO");

        if (isAdmin || isCeo)
        {
            var allPerms = await _db.Permissions.Where(p => p.IsActive).Select(p => p.Key).ToListAsync();
            return Ok(new
            {
                orgUnitId,
                roleNames = new[] { isAdmin ? "Admin" : "CEO" },
                permissionKeys = allPerms
            });
        }

        var roleIds = await (
            from urs in _db.UserRoleScopes
            join c in _db.OrgUnitClosures on urs.OrgUnitId equals c.AncestorId
            where urs.UserId == userId
            && (urs.AppliesToChildren ? c.DescendantId == orgUnitId : urs.OrgUnitId == orgUnitId)
            select urs.RoleId
        ).Distinct().ToListAsync();

        var roleNames = new List<string>();
        foreach (var rid in roleIds)
        {
            var r = await _roleMgr.FindByIdAsync(rid);
            if (r != null) roleNames.Add(r.Name!);
        }

        var permKeys = await (
            from rp in _db.RolePermissions
            join p in _db.Permissions on rp.PermissionId equals p.Id
            where roleIds.Contains(rp.RoleId) && p.IsActive
            select p.Key
        ).Distinct().ToListAsync();

        return Ok(new { orgUnitId, roleNames, permissionKeys = permKeys });
    }
}
