using RedApi.Shared.Models;

namespace RedApi.Shared.Auditing;

public static class AuditSnapshots
{
    public static object OrgUnit(OrgUnit x) => new
    {
        x.Id,
        x.Name,
        x.Type,
        x.ParentId,
        x.IsActive
    };
}
