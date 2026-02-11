using System.ComponentModel.DataAnnotations;

namespace RedApi.Shared.Models;

public class AccountingOutboxMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(80)] public string EventType { get; set; } = "";       // InventoryPosted, SaleCommitted...
    [MaxLength(80)] public string SourceModule { get; set; } = "Inventory";

    [MaxLength(80)] public string SourceDocType { get; set; } = "";   // Receiving/Transfer/Sale...
    [MaxLength(120)] public string SourceDocId { get; set; } = "";

    public Guid OrgUnitId { get; set; }
    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    // payload = accounting entries json
    public string PayloadJson { get; set; } = "";

    public bool Processed { get; set; } = false;
    public DateTimeOffset? ProcessedAtUtc { get; set; }
}
