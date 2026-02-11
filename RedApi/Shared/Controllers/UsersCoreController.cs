using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Auditing;
using RedApi.Shared.Constants;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userMgr;
    private readonly RoleManager<IdentityRole> _roleMgr;
    private readonly IAuditService _audit;

    public UsersController(AppDbContext db, UserManager<AppUser> userMgr, RoleManager<IdentityRole> roleMgr, IAuditService audit)
    {
        _db = db;
        _userMgr = userMgr;
        _roleMgr = roleMgr;
        _audit = audit;
    }

    public record CreateUserDto(string UserName, string Email, string FullName, string JobTitle, string Password);

    [HttpPost("create")]
    [Authorize(Policy = "Users.Create")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (await _userMgr.FindByNameAsync(dto.UserName) != null) return BadRequest("Username exists");
        if (await _userMgr.FindByEmailAsync(dto.Email) != null) return BadRequest("Email exists");

        var u = new AppUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
            FullName = dto.FullName,
            JobTitle = dto.JobTitle,
            Department = "General",
            RegionLabel = "ALEX",
            IsActive = true
        };

        var res = await _userMgr.CreateAsync(u, dto.Password);
        if (!res.Succeeded) return BadRequest(res.Errors);

        await _audit.LogAsync(HttpContext, "CreateUser", "AppUser", u.Id, null, new { u.Id, u.UserName, u.Email, u.FullName }, null);
        return Ok(new { userId = u.Id });
    }

    public record AssignUserDto(string UserId, Guid OrgUnitId, OrgAssignmentType AssignmentType);

    [HttpPost("{orgUnitId:guid}/assign-user")]
    [Authorize(Policy = "Org.AssignUsers")]
    public async Task<IActionResult> AssignUser(Guid orgUnitId, [FromBody] AssignUserDto dto)
    {
        if (orgUnitId != dto.OrgUnitId) return BadRequest("orgUnitId mismatch");

        var exists = await _db.UserOrgUnits.AnyAsync(x => x.UserId == dto.UserId && x.OrgUnitId == dto.OrgUnitId);
        if (exists) return Ok();

        _db.UserOrgUnits.Add(new UserOrgUnit
        {
            UserId = dto.UserId,
            OrgUnitId = dto.OrgUnitId,
            AssignmentType = dto.AssignmentType
        });

        await _db.SaveChangesAsync();
        await _audit.LogAsync(HttpContext, "AssignUserOrg", "UserOrgUnit", $"{dto.UserId}:{dto.OrgUnitId}", null, dto, dto.OrgUnitId);
        return Ok();
    }

    [HttpGet("{orgUnitId:guid}/assigned-users")]
    [Authorize(Policy = "Users.View")]
    public async Task<IActionResult> AssignedUsers(Guid orgUnitId)
    {
        var list = await (
            from uo in _db.UserOrgUnits.AsNoTracking()
            join u in _db.Users.AsNoTracking() on uo.UserId equals u.Id
            where uo.OrgUnitId == orgUnitId
            select new
            {
                u.Id,
                u.FullName,
                u.UserName,
                u.Email,
                u.JobTitle,
                u.IsActive,
                uo.AssignmentType
            }
        ).OrderBy(x => x.FullName).ToListAsync();

        return Ok(list);
    }

    public record AssignRoleScopeDto(string UserId, string RoleName, Guid OrgUnitId, bool AppliesToChildren);

    [HttpPost("{orgUnitId:guid}/assign-role-scope")]
    [Authorize(Policy = "Org.AssignRoles")]
    public async Task<IActionResult> AssignRoleScope(Guid orgUnitId, [FromBody] AssignRoleScopeDto dto)
    {
        if (orgUnitId != dto.OrgUnitId) return BadRequest("orgUnitId mismatch");

        var role = await _roleMgr.FindByNameAsync(dto.RoleName);
        if (role == null) return BadRequest("Role not found");

        var exists = await _db.UserRoleScopes
            .AnyAsync(x => x.UserId == dto.UserId && x.RoleId == role.Id && x.OrgUnitId == dto.OrgUnitId);

        if (!exists)
        {
            _db.UserRoleScopes.Add(new UserRoleScope
            {
                UserId = dto.UserId,
                RoleId = role.Id,
                OrgUnitId = dto.OrgUnitId,
                AppliesToChildren = dto.AppliesToChildren
            });
            await _db.SaveChangesAsync();
        }

        await _audit.LogAsync(HttpContext, "AssignRoleScope", "UserRoleScope", $"{dto.UserId}:{dto.OrgUnitId}:{dto.RoleName}", null, dto, dto.OrgUnitId);
        return Ok();
    }

    [HttpGet("list")]
    [Authorize(Policy = "Users.View")]
    public async Task<IActionResult> ListUsers()
    {
        var users = await _db.Users.AsNoTracking()
            .Select(u => new { u.Id, u.FullName, u.UserName, u.Email, u.JobTitle, u.IsActive })
            .OrderBy(x => x.FullName)
            .ToListAsync();
        return Ok(users);
    }
}
