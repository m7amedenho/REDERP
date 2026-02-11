using System.ComponentModel.DataAnnotations;

namespace RedApi.Modules.Inventory.Domain;

public enum WarehouseType { Fixed = 1, Mobile = 2 }

public class Warehouse
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(30)] public string Code { get; set; } = "";      // WH-ALEX-01 / REP-001
    [MaxLength(150)] public string Name { get; set; } = "";

    public WarehouseType Type { get; set; } = WarehouseType.Fixed;

    // Org scope (Branch/Department)
    public Guid OrgUnitId { get; set; }

    // For Mobile warehouse
    [MaxLength(100)] public string? OwnerUserId { get; set; }   // AppUser.Id
    [MaxLength(30)] public string? OwnerRepCode { get; set; }

    public bool IsActive { get; set; } = true;
}

public class InventoryLot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }

    [MaxLength(60)] public string LotCode { get; set; } = "";
    public DateTime? ExpiryDate { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public static string NormalizeLot(string lot) => lot.Trim().ToUpperInvariant();
}

public enum InventoryDocStatus { Draft = 1, Posted = 2, Cancelled = 3 }
public enum InventoryDocType
{
    Receiving = 1,
    Transfer = 2,
    IssueToRep = 3,
    Sale = 4,
    CustomerReturn = 5,
    RepReturn = 6,
    Adjustment = 7,
    StockCount = 8
}

public class InventoryDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public InventoryDocType DocType { get; set; }
    public InventoryDocStatus Status { get; set; } = InventoryDocStatus.Draft;

    [MaxLength(40)] public string Number { get; set; } = ""; // INV-0001
    public DateTimeOffset DocDateUtc { get; set; } = DateTimeOffset.UtcNow;

    public Guid OrgUnitId { get; set; } // scope

    public Guid? FromWarehouseId { get; set; }
    public Guid? ToWarehouseId { get; set; }

    [MaxLength(100)] public string? VendorId { get; set; }

    // Rep / Sales
    [MaxLength(100)] public string? SalesRepUserId { get; set; }
    [MaxLength(30)] public string? SalesRepCode { get; set; }

    // Bridge idempotency
    [MaxLength(80)] public string? ExternalRef { get; set; } // invoiceId/transferRef

    [MaxLength(400)] public string? Notes { get; set; }

    public DateTimeOffset? PostedAtUtc { get; set; }
    [MaxLength(100)] public string? PostedByUserId { get; set; }

    public List<InventoryDocumentLine> Lines { get; set; } = new();
}

public class InventoryDocumentLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid DocumentId { get; set; }
    public InventoryDocument Document { get; set; } = default!;

    public Guid ProductId { get; set; }

    // Units (we store base qty; unit conversion handled in Catalog module later)
    public decimal QtyBase { get; set; }   // always in base unit for valuation & FIFO
    [MaxLength(30)] public string? UnitLabel { get; set; } // "كرتونة" "عبوة" for UI
    public decimal? QtyInUnit { get; set; }

    // tracking
    public Guid? LotId { get; set; }
    [MaxLength(60)] public string? LotCode { get; set; }
    public DateTime? ExpiryDate { get; set; }

    // costs (Receiving)
    public decimal? UnitCost { get; set; } // required for Receiving/Adjustment IN
}

public enum StockTxnDirection { In = 1, Out = 2 }

public class StockTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OrgUnitId { get; set; } // scope
    public Guid WarehouseId { get; set; }

    public InventoryDocType DocType { get; set; }
    public Guid DocId { get; set; }
    public Guid DocLineId { get; set; }

    public DateTimeOffset TxnDateUtc { get; set; } = DateTimeOffset.UtcNow;
    public StockTxnDirection Direction { get; set; }

    public Guid ProductId { get; set; }
    public decimal QtyBase { get; set; }

    public Guid? LotId { get; set; }
    [MaxLength(60)] public string? LotCode { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public decimal UnitCost { get; set; }     // valuation cost used
    public decimal TotalCost { get; set; }

    // linking transfers
    public Guid? CounterpartyWarehouseId { get; set; }
    [MaxLength(100)] public string? SalesRepUserId { get; set; }
    [MaxLength(30)] public string? SalesRepCode { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public class StockLayer
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OrgUnitId { get; set; }
    public Guid WarehouseId { get; set; }
    public Guid ProductId { get; set; }

    public Guid? LotId { get; set; }
    [MaxLength(60)] public string? LotCode { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public decimal QtyIn { get; set; }
    public decimal QtyRemaining { get; set; }

    public decimal UnitCost { get; set; }
    public DateTimeOffset ReceivedAtUtc { get; set; }

    public InventoryDocType SourceDocType { get; set; }
    public Guid SourceDocId { get; set; }
    public Guid SourceDocLineId { get; set; }
}

public class StockConsumption
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid IssueTxnId { get; set; }
    public Guid LayerId { get; set; }

    public decimal Qty { get; set; }
    public decimal UnitCost { get; set; }
}

public class InventoryCommitLock
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(80)] public string ExternalRef { get; set; } = ""; // invoiceId
    public InventoryDocType DocType { get; set; } // Sale / etc
    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public enum BarcodeTokenType { RepPackage = 1, ProductLot = 2 }

public class BarcodeToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(32)] public string Token { get; set; } = Guid.NewGuid().ToString("N")[..16].ToUpperInvariant();

    public BarcodeTokenType Type { get; set; } = BarcodeTokenType.RepPackage;

    public Guid ProductId { get; set; }
    public Guid? LotId { get; set; }
    [MaxLength(60)] public string? LotCode { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public Guid SourceWarehouseId { get; set; }
    public Guid TargetWarehouseId { get; set; }

    [MaxLength(100)] public string? SalesRepUserId { get; set; }
    [MaxLength(30)] public string? SalesRepCode { get; set; }

    public Guid? DocId { get; set; }
    public Guid? DocLineId { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    public bool IsActive { get; set; } = true;
}

public enum StockCountStatus { Draft = 1, Posted = 2, Cancelled = 3 }

public class StockCountSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrgUnitId { get; set; }
    public Guid WarehouseId { get; set; }
    public StockCountStatus Status { get; set; } = StockCountStatus.Draft;

    public DateTimeOffset SnapshotAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public List<StockCountLine> Lines { get; set; } = new();

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    [MaxLength(100)] public string? CreatedByUserId { get; set; }

    public DateTimeOffset? PostedAtUtc { get; set; }
    [MaxLength(100)] public string? PostedByUserId { get; set; }
}

public class StockCountLine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SessionId { get; set; }
    public StockCountSession Session { get; set; } = default!;

    public Guid ProductId { get; set; }

    public Guid? LotId { get; set; }
    [MaxLength(60)] public string? LotCode { get; set; }
    public DateTime? ExpiryDate { get; set; }

    public decimal CountedQtyBase { get; set; }
}
