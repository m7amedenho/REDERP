namespace RedApi.Modules.Inventory.Api.Dtos;

public record IdResponse(Guid Id);

public record BarcodeTokenResponse(
    string Token,
    string Zpl,
    Guid ProductId,
    string ProductCode,
    string ProductName,
    string RepCode,
    string? LotCode,
    DateTime? ExpiryDate,
    Guid SourceWarehouseId,
    Guid TargetWarehouseId,
    string? SalesRepUserId,
    DateTimeOffset CreatedAtUtc
);

public record StockCountSessionDto(
    Guid Id,
    Guid OrgUnitId,
    Guid WarehouseId,
    int Status,
    DateTimeOffset SnapshotAtUtc,
    DateTimeOffset CreatedAtUtc,
    string? CreatedByUserId,
    DateTimeOffset? PostedAtUtc,
    string? PostedByUserId,
    List<StockCountLineDto> Lines
);

public record StockCountLineDto(
    Guid Id,
    Guid ProductId,
    decimal CountedQtyBase,
    string? LotCode,
    DateTime? ExpiryDate
);
