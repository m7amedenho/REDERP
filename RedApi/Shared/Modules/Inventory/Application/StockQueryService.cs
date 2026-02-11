using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Data;

namespace RedApi.Modules.Inventory.Application;

public interface IStockQueryService
{
    Task<decimal> GetOnHandAsync(Guid orgUnitId, Guid warehouseId, Guid productId);
    Task<List<LayerDto>> GetLayersAsync(Guid orgUnitId, Guid warehouseId, Guid productId);
    Task<ItemCardDto> GetItemCardAsync(Guid orgUnitId, Guid warehouseId, Guid productId, DateTimeOffset? fromUtc, DateTimeOffset? toUtc);
}

public record LayerDto(Guid LayerId, decimal QtyRemaining, decimal UnitCost, string? LotCode, DateTime? ExpiryDate, DateTimeOffset ReceivedAtUtc);
public record LedgerRowDto(DateTimeOffset DateUtc, string DocType, string DocNo, string Direction, decimal Qty, decimal UnitCost, decimal TotalCost, string? LotCode, DateTime? ExpiryDate);
public record ItemCardDto(
    Guid OrgUnitId,
    Guid WarehouseId,
    Guid ProductId,
    decimal OnHand,
    List<LayerDto> Layers,
    List<LedgerRowDto> Ledger
);

public class StockQueryService : IStockQueryService
{
    private readonly AppDbContext _db;
    public StockQueryService(AppDbContext db) => _db = db;

    public async Task<decimal> GetOnHandAsync(Guid orgUnitId, Guid warehouseId, Guid productId)
    {
        var sum = await _db.StockTransactions
            .Where(t => t.OrgUnitId == orgUnitId && t.WarehouseId == warehouseId && t.ProductId == productId)
            .SumAsync(t => t.Direction == StockTxnDirection.In ? t.QtyBase : -t.QtyBase);

        return sum;
    }

    public async Task<List<LayerDto>> GetLayersAsync(Guid orgUnitId, Guid warehouseId, Guid productId)
    {
        return await _db.StockLayers
            .Where(l => l.OrgUnitId == orgUnitId && l.WarehouseId == warehouseId && l.ProductId == productId && l.QtyRemaining > 0)
            .OrderBy(l => l.ReceivedAtUtc)
            .Select(l => new LayerDto(l.Id, l.QtyRemaining, l.UnitCost, l.LotCode, l.ExpiryDate, l.ReceivedAtUtc))
            .ToListAsync();
    }

    public async Task<ItemCardDto> GetItemCardAsync(Guid orgUnitId, Guid warehouseId, Guid productId, DateTimeOffset? fromUtc, DateTimeOffset? toUtc)
    {
        var onhand = await GetOnHandAsync(orgUnitId, warehouseId, productId);
        var layers = await GetLayersAsync(orgUnitId, warehouseId, productId);

        var q = _db.StockTransactions.Where(t => t.OrgUnitId == orgUnitId && t.WarehouseId == warehouseId && t.ProductId == productId);

        if (fromUtc.HasValue) q = q.Where(t => t.TxnDateUtc >= fromUtc.Value);
        if (toUtc.HasValue) q = q.Where(t => t.TxnDateUtc <= toUtc.Value);

        // join doc number
        var ledger = await (from t in q
                            join d in _db.InventoryDocuments on t.DocId equals d.Id
                            orderby t.TxnDateUtc
                            select new LedgerRowDto(
                                t.TxnDateUtc,
                                d.DocType.ToString(),
                                d.Number,
                                t.Direction.ToString(),
                                t.QtyBase,
                                t.UnitCost,
                                t.TotalCost,
                                t.LotCode,
                                t.ExpiryDate
                            ))
            .ToListAsync();

        return new ItemCardDto(orgUnitId, warehouseId, productId, onhand, layers, ledger);
    }
}
