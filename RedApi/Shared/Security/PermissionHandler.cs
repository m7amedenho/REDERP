using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RedApi.Shared.Data;

namespace RedApi.Shared.Security;

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _http;

    public PermissionHandler(AppDbContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        // ✅ Admin/CEO bypass
        if (context.User.IsInRole("Admin") || context.User.IsInRole("CEO"))
        {
            context.Succeed(requirement);
            return;
        }

        var userId = context.User.FindFirst("Id")?.Value
                     ?? context.User.FindFirst("sub")?.Value;

        if (string.IsNullOrWhiteSpace(userId)) return;

        var httpCtx = _http.HttpContext;
        if (httpCtx == null) return;

        // orgUnitId من Header أو Query
        Guid orgUnitId = Guid.Empty;

        if (httpCtx.Request.Headers.TryGetValue("X-OrgUnitId", out var headerVal))
            Guid.TryParse(headerVal.ToString(), out orgUnitId);

        if (orgUnitId == Guid.Empty && httpCtx.Request.Query.TryGetValue("orgUnitId", out var qv))
            Guid.TryParse(qv.ToString(), out orgUnitId);

        if (orgUnitId == Guid.Empty)
            return; // بدون orgUnitId => ممنوع (إلا admin/ceo)

        // permissions الفعالة داخل النطاق
        // 1) جيب role scopes اللي تنطبق على orgUnitId (باستخدام closure لو AppliesToChildren)
        var scopedRoles = await (
            from urs in _db.UserRoleScopes
            join c in _db.OrgUnitClosures on urs.OrgUnitId equals c.AncestorId
            where urs.UserId == userId
            && (urs.AppliesToChildren ? c.DescendantId == orgUnitId : urs.OrgUnitId == orgUnitId)
            select urs.RoleId
        ).Distinct().ToListAsync();

        if (scopedRoles.Count == 0) return;

        // 2) rolePermissions => permission keys
        var hasPerm = await (
            from rp in _db.RolePermissions
            join p in _db.Permissions on rp.PermissionId equals p.Id
            where scopedRoles.Contains(rp.RoleId)
            && p.Key == requirement.PermissionKey
            && p.IsActive
            select p.Id
        ).AnyAsync();

        if (hasPerm)
            context.Succeed(requirement);
    }
}
