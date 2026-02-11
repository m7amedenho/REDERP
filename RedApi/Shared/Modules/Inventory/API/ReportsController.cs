using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Data;

namespace RedApi.Modules.Inventory.API;

[ApiController]
[Route("api/inventory/reports")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    // 1) OnHand by warehouse (optionally product)
    [HttpGet("onhand")]
    [Authorize(Policy = "Inventory.Reports")]
    public async Task<IActionResult> OnHand([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId, [FromQuery] Guid? productId)
    {
        var q = _db.StockTransactions.AsNoTracking()
            .Where(t => t.OrgUnitId == orgUnitId && t.WarehouseId == warehouseId);

        if (productId.HasValue) q = q.Where(t => t.ProductId == productId);

        var rows = await q
            .GroupBy(t => new { t.ProductId, t.LotCode, t.ExpiryDate })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.LotCode,
                g.Key.ExpiryDate,
                Qty = g.Sum(x => x.Direction == StockTxnDirection.In ? x.QtyBase : -x.QtyBase)
            })
            .Where(x => x.Qty != 0)
            .ToListAsync();

        return Ok(rows);
    }

    // 2) Valuation using layers (FIFO remaining)
    [HttpGet("valuation")]
    [Authorize(Policy = "Inventory.Reports")]
    public async Task<IActionResult> Valuation([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId)
    {
        var rows = await _db.StockLayers.AsNoTracking()
            .Where(l => l.OrgUnitId == orgUnitId && l.WarehouseId == warehouseId && l.QtyRemaining > 0)
            .GroupBy(l => l.ProductId)
            .Select(g => new
            {
                ProductId = g.Key,
                Qty = g.Sum(x => x.QtyRemaining),
                Value = g.Sum(x => x.QtyRemaining * x.UnitCost)
            })
            .ToListAsync();

        return Ok(rows);
    }

    // 3) Expiry report
    [HttpGet("expiry")]
    [Authorize(Policy = "Inventory.Reports")]
    public async Task<IActionResult> Expiry([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId, [FromQuery] int days = 30)
    {
        var until = DateTime.UtcNow.Date.AddDays(days);

        var rows = await _db.StockLayers.AsNoTracking()
            .Where(l => l.OrgUnitId == orgUnitId && l.WarehouseId == warehouseId && l.QtyRemaining > 0 && l.ExpiryDate != null && l.ExpiryDate <= until)
            .OrderBy(l => l.ExpiryDate)
            .Select(l => new { l.ProductId, l.LotCode, l.ExpiryDate, l.QtyRemaining })
            .ToListAsync();

        return Ok(rows);
    }

    // 4) Ledger report (filter)
    [HttpGet("ledger")]
    [Authorize(Policy = "Inventory.Reports")]
    public async Task<IActionResult> Ledger([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId, [FromQuery] Guid? productId, [FromQuery] DateTimeOffset? fromUtc, [FromQuery] DateTimeOffset? toUtc)
    {
        var q = _db.StockTransactions.AsNoTracking()
            .Where(t => t.OrgUnitId == orgUnitId && t.WarehouseId == warehouseId);

        if (productId.HasValue) q = q.Where(t => t.ProductId == productId);
        if (fromUtc.HasValue) q = q.Where(t => t.TxnDateUtc >= fromUtc);
        if (toUtc.HasValue) q = q.Where(t => t.TxnDateUtc <= toUtc);

        var rows = await (from t in q
                          join d in _db.InventoryDocuments.AsNoTracking() on t.DocId equals d.Id
                          orderby t.TxnDateUtc
                          select new
                          {
                              t.TxnDateUtc,
                              t.ProductId,
                              DocType = d.DocType.ToString(),
                              DocNo = d.Number,
                              t.Direction,
                              t.QtyBase,
                              t.UnitCost,
                              t.TotalCost,
                              t.LotCode,
                              t.ExpiryDate
                          })
            .ToListAsync();

        return Ok(rows);
    }

    // 5) Rep stock (mobile warehouse)
    [HttpGet("rep-stock")]
    [Authorize(Policy = "Inventory.Reports")]
    public async Task<IActionResult> RepStock([FromQuery] Guid orgUnitId, [FromQuery] string repUserId)
    {
        var wh = await _db.Warehouses.AsNoTracking()
            .FirstOrDefaultAsync(w => w.OrgUnitId == orgUnitId && w.Type == WarehouseType.Mobile && w.OwnerUserId == repUserId && w.IsActive);

        if (wh == null) return NotFound("Rep warehouse not found.");

        var rows = await _db.StockTransactions.AsNoTracking()
            .Where(t => t.OrgUnitId == orgUnitId && t.WarehouseId == wh.Id)
            .GroupBy(t => new { t.ProductId, t.LotCode, t.ExpiryDate })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.LotCode,
                g.Key.ExpiryDate,
                Qty = g.Sum(x => x.Direction == StockTxnDirection.In ? x.QtyBase : -x.QtyBase)
            })
            .Where(x => x.Qty != 0)
            .ToListAsync();

        return Ok(new { warehouse = new { wh.Id, wh.Code, wh.OwnerRepCode }, items = rows });
    }
}
