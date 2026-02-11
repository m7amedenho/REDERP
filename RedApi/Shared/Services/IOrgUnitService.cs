using RedApi.Shared.Models;

namespace RedApi.Services;

public interface IOrgUnitService
{
    Task<Guid> EnsureRootAlexAsync();
    Task CreateOrgUnitAsync(OrgUnit unit);
    Task UpdateOrgUnitAsync(Guid id, string name, bool isActive);
    Task DeactivateOrgUnitAsync(Guid id);
    Task MoveOrgUnitAsync(Guid unitId, Guid? newParentId);
}
