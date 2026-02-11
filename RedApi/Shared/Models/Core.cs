using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace RedApi.Shared.Models;

public enum OrgUnitType
{
    Region = 1,
    Branch = 2,
    Department = 3,
    Team = 4
}

public class AppUser : IdentityUser
{
    [MaxLength(150)] public string FullName { get; set; } = "";
    [MaxLength(100)] public string JobTitle { get; set; } = "";

    // Labels إدارية (مش OrgUnit)
    [MaxLength(100)] public string Department { get; set; } = "";
    [MaxLength(100)] public string RegionLabel { get; set; } = "";

    public bool IsActive { get; set; } = true;

    public string? ProfilePictureUrl { get; set; }
    public string? SignatureUrl { get; set; }

    // علاقات الشجرة
    public ICollection<UserOrgUnit> OrgUnits { get; set; } = new List<UserOrgUnit>();
    public ICollection<UserRoleScope> RoleScopes { get; set; } = new List<UserRoleScope>();
}

public class OrgUnit
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(150)] public string Name { get; set; } = "";
    public OrgUnitType Type { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid? ParentId { get; set; }
    public OrgUnit? Parent { get; set; }
    public ICollection<OrgUnit> Children { get; set; } = new List<OrgUnit>();

    // Closure navigation
    public ICollection<OrgUnitClosure> Ancestors { get; set; } = new List<OrgUnitClosure>();
    public ICollection<OrgUnitClosure> Descendants { get; set; } = new List<OrgUnitClosure>();

    // Assignments
    public ICollection<UserOrgUnit> Users { get; set; } = new List<UserOrgUnit>();
}

public class OrgUnitClosure
{
    public Guid AncestorId { get; set; }
    public OrgUnit Ancestor { get; set; } = default!;

    public Guid DescendantId { get; set; }
    public OrgUnit Descendant { get; set; } = default!;

    public int Depth { get; set; } // 0 = self, 1 = child, ...
}

public enum OrgAssignmentType
{
    Primary = 1,
    Secondary = 2,
    Temporary = 3
}

public class UserOrgUnit
{
    public string UserId { get; set; } = default!;
    public AppUser User { get; set; } = default!;

    public Guid OrgUnitId { get; set; }
    public OrgUnit OrgUnit { get; set; } = default!;

    public OrgAssignmentType AssignmentType { get; set; } = OrgAssignmentType.Primary;
    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
}

// ---------- Permissions (Module-based) ----------
public class AppModule
{
    public int Id { get; set; }
    [MaxLength(80)] public string Key { get; set; } = "";     // "Inventory"
    [MaxLength(150)] public string Name { get; set; } = "";   // "Inventory Management"
    public bool IsActive { get; set; } = true;

    public ICollection<AppPermission> Permissions { get; set; } = new List<AppPermission>();
}

public class AppPermission
{
    public int Id { get; set; }
    public int ModuleId { get; set; }
    public AppModule Module { get; set; } = default!;

    [MaxLength(120)] public string Key { get; set; } = "";     // "Inventory.Items.View"
    [MaxLength(200)] public string Name { get; set; } = "";    // "View items"
    public bool IsActive { get; set; } = true;
}

public class RolePermission
{
    public string RoleId { get; set; } = default!;
    public IdentityRole Role { get; set; } = default!;

    public int PermissionId { get; set; }
    public AppPermission Permission { get; set; } = default!;
}

// ---------- Scoped Roles (User ↔ Role ↔ OrgUnit) ----------
public class UserRoleScope
{
    public int Id { get; set; }

    public string UserId { get; set; } = default!;
    public AppUser User { get; set; } = default!;

    public string RoleId { get; set; } = default!;
    public IdentityRole Role { get; set; } = default!;

    public Guid OrgUnitId { get; set; }
    public OrgUnit OrgUnit { get; set; } = default!;

    public bool AppliesToChildren { get; set; } = true;

    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
}

// ---------- Auditing ----------
public class AuditLog
{
    public Guid Id { get; set; }

    [MaxLength(64)]
    public string? CorrelationId { get; set; }

    [MaxLength(100)]
    public string? ActorUserId { get; set; }

    [MaxLength(150)]
    public string? ActorUserName { get; set; }

    [MaxLength(120)]
    public string Action { get; set; } = default!;

    [MaxLength(120)]
    public string EntityType { get; set; } = default!;

    [MaxLength(120)]
    public string? EntityId { get; set; }

    public string? OldValuesJson { get; set; }   // خليها text
    public string? NewValuesJson { get; set; }   // خليها text

    public Guid? OrgUnitId { get; set; }

    [MaxLength(64)]
    public string? IpAddress { get; set; }

    [MaxLength(512)]
    public string? UserAgent { get; set; } // ده لازم أكبر من 80

    [MaxLength(2000)]
    public string? ErrorMessage { get; set; }

    public bool Success { get; set; }
    public DateTimeOffset TimestampUtc { get; set; }
}
