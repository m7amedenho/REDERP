namespace RedApi.Shared.Auditing;

public interface IAuditService
{
    Task LogAsync(HttpContext ctx, string action, string entityType, string? entityId,
        object? oldValues, object? newValues, Guid? orgUnitId, bool success = true, string? error = null);
}
