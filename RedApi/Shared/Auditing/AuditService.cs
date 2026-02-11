using RedApi.Shared.Data;
using RedApi.Shared.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RedApi.Shared.Auditing;

public class AuditService : IAuditService
{
    private readonly AppDbContext _db;
    public AuditService(AppDbContext db) => _db = db;

    private static readonly JsonSerializerOptions _opts = new()
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = false
    };

    public async Task LogAsync(
        HttpContext ctx,
        string action,
        string entityType,
        string? entityId,
        object? oldValues,
        object? newValues,
        Guid? orgUnitId,
        bool success = true,
        string? error = null)
    {
        var userId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;
        var userName = ctx.User?.Identity?.Name;

        var cid = ctx.Items["CorrelationId"]?.ToString() ?? Guid.NewGuid().ToString("N");

        string? oldJson = null;
        string? newJson = null;

        // ✅ مهم: نستخدم _opts + ما نسمحش إن الـ audit يكسر العملية الأساسية
        try { oldJson = oldValues == null ? null : JsonSerializer.Serialize(oldValues, _opts); }
        catch (Exception ex) { oldJson = JsonSerializer.Serialize(new { serializationError = ex.Message }, _opts); }

        try { newJson = newValues == null ? null : JsonSerializer.Serialize(newValues, _opts); }
        catch (Exception ex) { newJson = JsonSerializer.Serialize(new { serializationError = ex.Message }, _opts); }

        var log = new AuditLog
        {
            CorrelationId = cid,
            ActorUserId = userId,
            ActorUserName = userName,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValuesJson = oldJson,
            NewValuesJson = newJson,
            OrgUnitId = orgUnitId,
            IpAddress = ctx.Connection.RemoteIpAddress?.ToString(),
            UserAgent = ctx.Request.Headers.UserAgent.ToString(),
            Success = success,
            ErrorMessage = error,
            TimestampUtc = DateTimeOffset.UtcNow
        };

        _db.AuditLogs.Add(log);
        await _db.SaveChangesAsync();
    }
}
