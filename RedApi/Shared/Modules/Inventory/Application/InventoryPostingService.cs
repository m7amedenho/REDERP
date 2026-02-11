using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Auditing;
using RedApi.Shared.Data;
using RedApi.Shared.Models;
using System.Text.Json;

namespace RedApi.Modules.Inventory.Application;

public interface IInventoryPostingService
{
    Task<Guid> PostDocumentAsync(HttpContext ctx, Guid docId);
    Task<Guid> CommitSaleAsync(HttpContext ctx, SaleCommitRequest req);
    Task<Guid> CommitSaleReturnAsync(HttpContext ctx, SaleReturnRequest req);
    Task<Guid> PostStockCountAsync(HttpContext ctx, Guid sessionId);
}

public record SaleCommitRequest(
    Guid OrgUnitId,
    Guid FromWarehouseId,
    string InvoiceId,
    string InvoiceType, // Cash|Credit
    DateTimeOffset InvoiceDateUtc,
    string? SalesRepUserId,
    string? SalesRepCode,
    List<SaleCommitLine> Lines,
    string IdempotencyKey
);

public record SaleCommitLine(
    Guid ProductId,
    decimal QtyBase,
    string? LotCode,
    DateTime? ExpiryDate
);

public record SaleReturnRequest(
    Guid OrgUnitId,
    Guid ToWarehouseId,
    string ReturnRef,
    DateTimeOffset ReturnDateUtc,
    string? SalesRepUserId,
    string? SalesRepCode,
    List<SaleCommitLine> Lines,
    string IdempotencyKey
);

public class InventoryPostingService : IInventoryPostingService
{
    private readonly AppDbContext _db;
    private readonly IAuditService _audit;

    public InventoryPostingService(AppDbContext db, IAuditService audit)
    {
        _db = db;
        _audit = audit;
    }

    // -----------------------------
    // Posting documents (Receiving/Transfer/IssueToRep/Adjustment)
    // -----------------------------

    public async Task<Guid> PostDocumentAsync(HttpContext ctx, Guid docId)
    {
        var doc = await _db.InventoryDocuments
            .Include(d => d.Lines)
            .FirstOrDefaultAsync(d => d.Id == docId);

        if (doc == null) throw new InvalidOperationException("Document not found.");
        if (doc.Status != InventoryDocStatus.Draft) return doc.Id;

        // Required warehouses by doc type
        ValidateDoc(doc);

        // atomic
        using var tx = await _db.Database.BeginTransactionAsync();

        try
        {
            // Execute
            switch (doc.DocType)
            {
                case InventoryDocType.Receiving:
                    await PostReceivingAsync(doc);
                    break;

                case InventoryDocType.Transfer:
                case InventoryDocType.IssueToRep:
                    await PostTransferAsync(doc);
                    break;

                case InventoryDocType.Adjustment:
                    await PostAdjustmentAsync(doc);
                    break;

                default:
                    throw new InvalidOperationException($"Unsupported posting for {doc.DocType}");
            }

            doc.Status = InventoryDocStatus.Posted;
            doc.PostedAtUtc = DateTimeOffset.UtcNow;
            doc.PostedByUserId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            await _audit.LogAsync(ctx, "PostInventoryDocument", "InventoryDocument", doc.Id.ToString(),
                oldValues: new { status = "Draft" },
                newValues: new { status = "Posted", doc.DocType, doc.Number },
                orgUnitId: doc.OrgUnitId,
                success: true);

            return doc.Id;
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            await _audit.LogAsync(ctx, "PostInventoryDocumentFailed", "InventoryDocument", doc.Id.ToString(),
                oldValues: null,
                newValues: new { doc.DocType, doc.Number },
                orgUnitId: doc.OrgUnitId,
                success: false,
                error: ex.Message);
            throw;
        }
    }

    // -----------------------------
    // Sales bridge commit (called when invoice is posted)
    // -----------------------------
    public async Task<Guid> CommitSaleAsync(HttpContext ctx, SaleCommitRequest req)
    {
        using var tx = await _db.Database.BeginTransactionAsync();

        // Idempotency lock
        await EnsureIdempotencyAsync(req.IdempotencyKey, InventoryDocType.Sale);

        var doc = new InventoryDocument
        {
            DocType = InventoryDocType.Sale,
            Status = InventoryDocStatus.Draft,
            OrgUnitId = req.OrgUnitId,
            FromWarehouseId = req.FromWarehouseId,
            DocDateUtc = req.InvoiceDateUtc,
            ExternalRef = req.InvoiceId,
            SalesRepUserId = req.SalesRepUserId,
            SalesRepCode = req.SalesRepCode,
            Number = $"SALE-{DateTime.UtcNow:yyyyMMddHHmmss}"
        };

        foreach (var l in req.Lines)
        {
            // Lot optional unless tracked; validation handled at controller or product flags later
            doc.Lines.Add(new InventoryDocumentLine
            {
                ProductId = l.ProductId,
                QtyBase = l.QtyBase,
                LotCode = l.LotCode,
                ExpiryDate = l.ExpiryDate
            });
        }

        _db.InventoryDocuments.Add(doc);
        await _db.SaveChangesAsync();

        // post = OUT from rep warehouse using FIFO
        await PostIssueOutAsync(
            orgUnitId: req.OrgUnitId,
            warehouseId: req.FromWarehouseId,
            doc,
            salesRepUserId: req.SalesRepUserId,
            salesRepCode: req.SalesRepCode);

        doc.Status = InventoryDocStatus.Posted;
        doc.PostedAtUtc = DateTimeOffset.UtcNow;
        doc.PostedByUserId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;

        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        await _audit.LogAsync(ctx, "CommitSale", "InventorySale", doc.Id.ToString(),
            oldValues: null,
            newValues: new { req.InvoiceId, req.InvoiceType, totalLines = req.Lines.Count },
            orgUnitId: req.OrgUnitId);

        return doc.Id;
    }

    public async Task<Guid> CommitSaleReturnAsync(HttpContext ctx, SaleReturnRequest req)
    {
        using var tx = await _db.Database.BeginTransactionAsync();

        await EnsureIdempotencyAsync(req.IdempotencyKey, InventoryDocType.CustomerReturn);

        var doc = new InventoryDocument
        {
            DocType = InventoryDocType.CustomerReturn,
            Status = InventoryDocStatus.Draft,
            OrgUnitId = req.OrgUnitId,
            ToWarehouseId = req.ToWarehouseId,
            DocDateUtc = req.ReturnDateUtc,
            ExternalRef = req.ReturnRef,
            SalesRepUserId = req.SalesRepUserId,
            SalesRepCode = req.SalesRepCode,
            Number = $"RET-{DateTime.UtcNow:yyyyMMddHHmmss}"
        };

        foreach (var l in req.Lines)
        {
            doc.Lines.Add(new InventoryDocumentLine
            {
                ProductId = l.ProductId,
                QtyBase = l.QtyBase,
                LotCode = l.LotCode,
                ExpiryDate = l.ExpiryDate
            });
        }

        _db.InventoryDocuments.Add(doc);
        await _db.SaveChangesAsync();

        // Return = IN to warehouse (creates layers)
        await PostInAsync(req.OrgUnitId, req.ToWarehouseId, doc, doc.Lines);

        doc.Status = InventoryDocStatus.Posted;
        doc.PostedAtUtc = DateTimeOffset.UtcNow;
        doc.PostedByUserId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;

        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        await _audit.LogAsync(ctx, "CommitSaleReturn", "InventoryReturn", doc.Id.ToString(),
            oldValues: null,
            newValues: new { req.ReturnRef, totalLines = req.Lines.Count },
            orgUnitId: req.OrgUnitId);

        return doc.Id;
    }

    // -----------------------------
    // Stock count posting
    // -----------------------------
    public async Task<Guid> PostStockCountAsync(HttpContext ctx, Guid sessionId)
    {
        var session = await _db.StockCountSessions.Include(s => s.Lines).FirstOrDefaultAsync(s => s.Id == sessionId);
        if (session == null) throw new InvalidOperationException("Stock count not found.");
        if (session.Status != StockCountStatus.Draft) return session.Id;

        using var tx = await _db.Database.BeginTransactionAsync();

        // calculate on-hand as of snapshot
        var onHand = await _db.StockTransactions
            .Where(t => t.OrgUnitId == session.OrgUnitId && t.WarehouseId == session.WarehouseId && t.TxnDateUtc <= session.SnapshotAtUtc)
            .GroupBy(t => new { t.ProductId, t.LotCode, t.ExpiryDate })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.LotCode,
                g.Key.ExpiryDate,
                Qty = g.Sum(x => x.Direction == StockTxnDirection.In ? x.QtyBase : -x.QtyBase)
            })
            .ToListAsync();

        var counted = session.Lines
            .GroupBy(l => new { l.ProductId, l.LotCode, l.ExpiryDate })
            .Select(g => new { g.Key.ProductId, g.Key.LotCode, g.Key.ExpiryDate, Qty = g.Sum(x => x.CountedQtyBase) })
            .ToList();

        // union keys
        var keys = onHand.Select(x => (x.ProductId, x.LotCode, x.ExpiryDate))
            .Union(counted.Select(x => (x.ProductId, x.LotCode, x.ExpiryDate)))
            .Distinct()
            .ToList();

        var adj = new InventoryDocument
        {
            DocType = InventoryDocType.Adjustment,
            Status = InventoryDocStatus.Draft,
            OrgUnitId = session.OrgUnitId,
            FromWarehouseId = session.WarehouseId, // for OUT
            ToWarehouseId = session.WarehouseId,   // for IN (we use same warehouse)
            DocDateUtc = DateTimeOffset.UtcNow,
            Number = $"SC-ADJ-{DateTime.UtcNow:yyyyMMddHHmmss}",
            Notes = $"StockCount Adjustment for session {session.Id}"
        };

        foreach (var k in keys)
        {
            var oh = onHand.FirstOrDefault(x => x.ProductId == k.ProductId && x.LotCode == k.LotCode && x.ExpiryDate == k.ExpiryDate)?.Qty ?? 0m;
            var ct = counted.FirstOrDefault(x => x.ProductId == k.ProductId && x.LotCode == k.LotCode && x.ExpiryDate == k.ExpiryDate)?.Qty ?? 0m;

            var diff = ct - oh;
            if (diff == 0) continue;

            adj.Lines.Add(new InventoryDocumentLine
            {
                ProductId = k.ProductId,
                QtyBase = Math.Abs(diff),
                LotCode = k.LotCode,
                ExpiryDate = k.ExpiryDate,
                UnitCost = diff > 0 ? await GuessUnitCostAsync(session.OrgUnitId, session.WarehouseId, k.ProductId, k.LotCode, k.ExpiryDate) : null
            });
        }

        _db.InventoryDocuments.Add(adj);
        await _db.SaveChangesAsync();

        // Post adjustment:
        await PostAdjustmentAsync(adj);

        adj.Status = InventoryDocStatus.Posted;
        adj.PostedAtUtc = DateTimeOffset.UtcNow;
        adj.PostedByUserId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;

        session.Status = StockCountStatus.Posted;
        session.PostedAtUtc = DateTimeOffset.UtcNow;
        session.PostedByUserId = ctx.User?.FindFirst("Id")?.Value ?? ctx.User?.FindFirst("sub")?.Value;

        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        await _audit.LogAsync(ctx, "PostStockCount", "StockCountSession", session.Id.ToString(),
            oldValues: new { status = "Draft" },
            newValues: new { status = "Posted", warehouseId = session.WarehouseId },
            orgUnitId: session.OrgUnitId);

        return session.Id;
    }

    // -----------------------------
    // Helpers
    // -----------------------------
    private static void ValidateDoc(InventoryDocument doc)
    {
        if (doc.DocType == InventoryDocType.Receiving && doc.ToWarehouseId == null)
            throw new InvalidOperationException("Receiving requires ToWarehouseId.");

        if ((doc.DocType == InventoryDocType.Transfer || doc.DocType == InventoryDocType.IssueToRep) &&
            (doc.FromWarehouseId == null || doc.ToWarehouseId == null))
            throw new InvalidOperationException("Transfer requires FromWarehouseId and ToWarehouseId.");

        if (doc.Lines.Count == 0)
            throw new InvalidOperationException("Document has no lines.");
    }

    private async Task EnsureIdempotencyAsync(string key, InventoryDocType type)
    {
        if (string.IsNullOrWhiteSpace(key)) throw new InvalidOperationException("IdempotencyKey is required.");

        // external ref lock
        var lockKey = new InventoryCommitLock { ExternalRef = key.Trim(), DocType = type };
        _db.InventoryCommitLocks.Add(lockKey);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // already committed
            throw new InvalidOperationException("This request was already committed (idempotency).");
        }
    }

    private async Task<Guid?> EnsureLotAsync(Guid productId, string? lotCode, DateTime? expiry)
    {
        if (string.IsNullOrWhiteSpace(lotCode)) return null;

        var norm = InventoryLot.NormalizeLot(lotCode);
        var existing = await _db.InventoryLots.FirstOrDefaultAsync(x => x.ProductId == productId && x.LotCode == norm);

        if (existing != null)
        {
            // update expiry if not set
            if (existing.ExpiryDate == null && expiry != null)
            {
                existing.ExpiryDate = expiry;
                await _db.SaveChangesAsync();
            }
            return existing.Id;
        }

        var lot = new InventoryLot { ProductId = productId, LotCode = norm, ExpiryDate = expiry };
        _db.InventoryLots.Add(lot);
        await _db.SaveChangesAsync();
        return lot.Id;
    }

    private async Task PostReceivingAsync(InventoryDocument doc)
    {
        // IN to warehouse (ToWarehouseId) with costs => creates layers
        var wid = doc.ToWarehouseId!.Value;

        foreach (var line in doc.Lines)
        {
            if (line.UnitCost is null || line.UnitCost <= 0)
                throw new InvalidOperationException("Receiving lines require UnitCost.");

            // ✅ Validation: tracked lot/expiry required
            await ValidateTrackingRequiredAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            line.LotId = await EnsureLotAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            var txn = new StockTransaction
            {
                OrgUnitId = doc.OrgUnitId,
                WarehouseId = wid,
                DocType = doc.DocType,
                DocId = doc.Id,
                DocLineId = line.Id,
                TxnDateUtc = doc.DocDateUtc,
                Direction = StockTxnDirection.In,
                ProductId = line.ProductId,
                QtyBase = line.QtyBase,
                LotId = line.LotId,
                LotCode = line.LotCode,
                ExpiryDate = line.ExpiryDate,
                UnitCost = line.UnitCost.Value,
                TotalCost = line.UnitCost.Value * line.QtyBase
            };

            _db.StockTransactions.Add(txn);

            _db.StockLayers.Add(new StockLayer
            {
                OrgUnitId = doc.OrgUnitId,
                WarehouseId = wid,
                ProductId = line.ProductId,
                LotId = line.LotId,
                LotCode = line.LotCode,
                ExpiryDate = line.ExpiryDate,
                QtyIn = line.QtyBase,
                QtyRemaining = line.QtyBase,
                UnitCost = line.UnitCost.Value,
                ReceivedAtUtc = doc.DocDateUtc,
                SourceDocType = doc.DocType,
                SourceDocId = doc.Id,
                SourceDocLineId = line.Id
            });
        }
    }

    private async Task PostTransferAsync(InventoryDocument doc)
    {
        var from = doc.FromWarehouseId!.Value;
        var to = doc.ToWarehouseId!.Value;

        // OUT from source using FIFO
        await PostIssueOutAsync(doc.OrgUnitId, from, doc, doc.SalesRepUserId, doc.SalesRepCode, counterpartyWarehouseId: to);

        // IN to destination with exact costs from OUT (mirror)
        // we build IN from consumed allocations (StockTransactions OUT created above)
        var outTxns = await _db.StockTransactions
            .Where(t => t.DocId == doc.Id && t.WarehouseId == from && t.Direction == StockTxnDirection.Out)
            .ToListAsync();

        foreach (var outTxn in outTxns)
        {
            var inTxn = new StockTransaction
            {
                OrgUnitId = doc.OrgUnitId,
                WarehouseId = to,
                DocType = doc.DocType,
                DocId = doc.Id,
                DocLineId = outTxn.DocLineId,
                TxnDateUtc = doc.DocDateUtc,
                Direction = StockTxnDirection.In,
                ProductId = outTxn.ProductId,
                QtyBase = outTxn.QtyBase,
                LotId = outTxn.LotId,
                LotCode = outTxn.LotCode,
                ExpiryDate = outTxn.ExpiryDate,
                UnitCost = outTxn.UnitCost,
                TotalCost = outTxn.TotalCost,
                CounterpartyWarehouseId = from,
                SalesRepUserId = doc.SalesRepUserId,
                SalesRepCode = doc.SalesRepCode
            };
            _db.StockTransactions.Add(inTxn);

            _db.StockLayers.Add(new StockLayer
            {
                OrgUnitId = doc.OrgUnitId,
                WarehouseId = to,
                ProductId = outTxn.ProductId,
                LotId = outTxn.LotId,
                LotCode = outTxn.LotCode,
                ExpiryDate = outTxn.ExpiryDate,
                QtyIn = outTxn.QtyBase,
                QtyRemaining = outTxn.QtyBase,
                UnitCost = outTxn.UnitCost,
                ReceivedAtUtc = doc.DocDateUtc,
                SourceDocType = doc.DocType,
                SourceDocId = doc.Id,
                SourceDocLineId = outTxn.DocLineId
            });
        }
    }

    private async Task PostAdjustmentAsync(InventoryDocument doc)
    {
        // Here we treat doc.Lines as adjustment entries:
        // If UnitCost provided => IN, else OUT (shrinkage). (You can change policy)
        // For stock count we build UnitCost for IN, and OUT lines have no cost => FIFO.
        var wid = doc.FromWarehouseId ?? doc.ToWarehouseId;
        if (wid == null) throw new InvalidOperationException("Adjustment requires WarehouseId.");

        foreach (var line in doc.Lines)
        {
            // ✅ Validation: tracked lot/expiry required (adjustment IN & tracked OUT too)
            await ValidateTrackingRequiredAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            line.LotId = await EnsureLotAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            if (line.UnitCost.HasValue && line.UnitCost.Value > 0)
            {
                // IN
                var txn = new StockTransaction
                {
                    OrgUnitId = doc.OrgUnitId,
                    WarehouseId = wid.Value,
                    DocType = doc.DocType,
                    DocId = doc.Id,
                    DocLineId = line.Id,
                    TxnDateUtc = doc.DocDateUtc,
                    Direction = StockTxnDirection.In,
                    ProductId = line.ProductId,
                    QtyBase = line.QtyBase,
                    LotId = line.LotId,
                    LotCode = line.LotCode,
                    ExpiryDate = line.ExpiryDate,
                    UnitCost = line.UnitCost.Value,
                    TotalCost = line.UnitCost.Value * line.QtyBase
                };
                _db.StockTransactions.Add(txn);

                _db.StockLayers.Add(new StockLayer
                {
                    OrgUnitId = doc.OrgUnitId,
                    WarehouseId = wid.Value,
                    ProductId = line.ProductId,
                    LotId = line.LotId,
                    LotCode = line.LotCode,
                    ExpiryDate = line.ExpiryDate,
                    QtyIn = line.QtyBase,
                    QtyRemaining = line.QtyBase,
                    UnitCost = line.UnitCost.Value,
                    ReceivedAtUtc = doc.DocDateUtc,
                    SourceDocType = doc.DocType,
                    SourceDocId = doc.Id,
                    SourceDocLineId = line.Id
                });
            }
            else
            {
                // OUT using FIFO
                await ConsumeFifoAsync(
                    orgUnitId: doc.OrgUnitId,
                    warehouseId: wid.Value,
                    docType: doc.DocType,
                    docId: doc.Id,
                    docLineId: line.Id,
                    txnDateUtc: doc.DocDateUtc,
                    productId: line.ProductId,
                    qtyBase: line.QtyBase,
                    lotCode: line.LotCode,
                    expiry: line.ExpiryDate,
                    counterpartyWarehouseId: null,
                    salesRepUserId: doc.SalesRepUserId,
                    salesRepCode: doc.SalesRepCode);
            }
        }
    }

    private async Task ValidateTrackingRequiredAsync(Guid productId, string? lotCode, DateTime? expiryDate)
    {
        var p = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == productId);
        if (p == null) throw new InvalidOperationException("Product not found in Catalog.");

        if (p.IsLotTracked && string.IsNullOrWhiteSpace(lotCode))
            throw new InvalidOperationException($"Product {p.Code} requires LotCode.");

        if (p.IsExpiryTracked && expiryDate == null)
            throw new InvalidOperationException($"Product {p.Code} requires ExpiryDate.");
    }

    private async Task PostInAsync(Guid orgUnitId, Guid warehouseId, InventoryDocument doc, IEnumerable<InventoryDocumentLine> lines)
    {
        foreach (var line in lines)
        {
            // ✅ Validation: tracked lot/expiry required
            await ValidateTrackingRequiredAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            // returns/receiving IN must have cost; for returns we will guess cost from last known.
            var cost = line.UnitCost ?? await GuessUnitCostAsync(orgUnitId, warehouseId, line.ProductId, line.LotCode, line.ExpiryDate);
            if (cost <= 0) cost = 0.000001m;

            line.LotId = await EnsureLotAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            _db.StockTransactions.Add(new StockTransaction
            {
                OrgUnitId = orgUnitId,
                WarehouseId = warehouseId,
                DocType = doc.DocType,
                DocId = doc.Id,
                DocLineId = line.Id,
                TxnDateUtc = doc.DocDateUtc,
                Direction = StockTxnDirection.In,
                ProductId = line.ProductId,
                QtyBase = line.QtyBase,
                LotId = line.LotId,
                LotCode = line.LotCode,
                ExpiryDate = line.ExpiryDate,
                UnitCost = cost,
                TotalCost = cost * line.QtyBase,
                SalesRepUserId = doc.SalesRepUserId,
                SalesRepCode = doc.SalesRepCode
            });

            _db.StockLayers.Add(new StockLayer
            {
                OrgUnitId = orgUnitId,
                WarehouseId = warehouseId,
                ProductId = line.ProductId,
                LotId = line.LotId,
                LotCode = line.LotCode,
                ExpiryDate = line.ExpiryDate,
                QtyIn = line.QtyBase,
                QtyRemaining = line.QtyBase,
                UnitCost = cost,
                ReceivedAtUtc = doc.DocDateUtc,
                SourceDocType = doc.DocType,
                SourceDocId = doc.Id,
                SourceDocLineId = line.Id
            });
        }
    }

    private async Task PostIssueOutAsync(Guid orgUnitId, Guid warehouseId, InventoryDocument doc, string? salesRepUserId, string? salesRepCode, Guid? counterpartyWarehouseId = null)
    {
        foreach (var line in doc.Lines)
        {
            // ✅ Validation: tracked lot/expiry required
            await ValidateTrackingRequiredAsync(line.ProductId, line.LotCode, line.ExpiryDate);

            // For seeds: caller should ensure lot/expiry present when tracked
            await ConsumeFifoAsync(
                orgUnitId: orgUnitId,
                warehouseId: warehouseId,
                docType: doc.DocType,
                docId: doc.Id,
                docLineId: line.Id,
                txnDateUtc: doc.DocDateUtc,
                productId: line.ProductId,
                qtyBase: line.QtyBase,
                lotCode: line.LotCode,
                expiry: line.ExpiryDate,
                counterpartyWarehouseId: counterpartyWarehouseId,
                salesRepUserId: salesRepUserId,
                salesRepCode: salesRepCode);
        }
    }

    // ✅ NEW: load FIFO layers with row-level lock to prevent double-spend under concurrency
    private async Task<List<StockLayer>> LoadFifoLayersForUpdateAsync(
        Guid orgUnitId,
        Guid warehouseId,
        Guid productId,
        string? lotCode,
        DateTime? expiry)
    {
        var normLot = string.IsNullOrWhiteSpace(lotCode) ? null : InventoryLot.NormalizeLot(lotCode);

        // NOTE: adjust table name if EF generated a different one.
        // Default pluralization for StockLayer is usually "StockLayers".
        if (normLot == null && expiry == null)
        {
            return await _db.StockLayers
                .FromSqlInterpolated($@"
                    SELECT * FROM ""StockLayers""
                    WHERE ""OrgUnitId"" = {orgUnitId}
                      AND ""WarehouseId"" = {warehouseId}
                      AND ""ProductId"" = {productId}
                      AND ""QtyRemaining"" > 0
                    ORDER BY ""ReceivedAtUtc""
                    FOR UPDATE
                ")
                .ToListAsync();
        }

        if (normLot != null && expiry == null)
        {
            return await _db.StockLayers
                .FromSqlInterpolated($@"
                    SELECT * FROM ""StockLayers""
                    WHERE ""OrgUnitId"" = {orgUnitId}
                      AND ""WarehouseId"" = {warehouseId}
                      AND ""ProductId"" = {productId}
                      AND ""QtyRemaining"" > 0
                      AND ""LotCode"" = {normLot}
                    ORDER BY ""ReceivedAtUtc""
                    FOR UPDATE
                ")
                .ToListAsync();
        }

        if (normLot == null && expiry != null)
        {
            return await _db.StockLayers
                .FromSqlInterpolated($@"
                    SELECT * FROM ""StockLayers""
                    WHERE ""OrgUnitId"" = {orgUnitId}
                      AND ""WarehouseId"" = {warehouseId}
                      AND ""ProductId"" = {productId}
                      AND ""QtyRemaining"" > 0
                      AND ""ExpiryDate"" = {expiry.Value}
                    ORDER BY ""ReceivedAtUtc""
                    FOR UPDATE
                ")
                .ToListAsync();
        }

        // both lot + expiry
        return await _db.StockLayers
            .FromSqlInterpolated($@"
                SELECT * FROM ""StockLayers""
                WHERE ""OrgUnitId"" = {orgUnitId}
                  AND ""WarehouseId"" = {warehouseId}
                  AND ""ProductId"" = {productId}
                  AND ""QtyRemaining"" > 0
                  AND ""LotCode"" = {normLot}
                  AND ""ExpiryDate"" = {expiry!.Value}
                ORDER BY ""ReceivedAtUtc""
                FOR UPDATE
            ")
            .ToListAsync();
    }

    private async Task ConsumeFifoAsync(
        Guid orgUnitId,
        Guid warehouseId,
        InventoryDocType docType,
        Guid docId,
        Guid docLineId,
        DateTimeOffset txnDateUtc,
        Guid productId,
        decimal qtyBase,
        string? lotCode,
        DateTime? expiry,
        Guid? counterpartyWarehouseId,
        string? salesRepUserId,
        string? salesRepCode)
    {
        if (qtyBase <= 0) throw new InvalidOperationException("Qty must be > 0.");

        // ✅ Validation: tracked lot/expiry required (seeds must have expiry)
        await ValidateTrackingRequiredAsync(productId, lotCode, expiry);

        // ✅ FIFO layers with lock (FOR UPDATE) to prevent double-spend
        var layers = await LoadFifoLayersForUpdateAsync(orgUnitId, warehouseId, productId, lotCode, expiry);

        if (layers.Count == 0) throw new InvalidOperationException("Insufficient stock (no layers).");

        var remaining = qtyBase;

        foreach (var layer in layers)
        {
            if (remaining <= 0) break;

            var take = Math.Min(layer.QtyRemaining, remaining);
            layer.QtyRemaining -= take;
            remaining -= take;

            var txn = new StockTransaction
            {
                OrgUnitId = orgUnitId,
                WarehouseId = warehouseId,
                DocType = docType,
                DocId = docId,
                DocLineId = docLineId,
                TxnDateUtc = txnDateUtc,
                Direction = StockTxnDirection.Out,
                ProductId = productId,
                QtyBase = take,
                LotId = layer.LotId,
                LotCode = layer.LotCode,
                ExpiryDate = layer.ExpiryDate,
                UnitCost = layer.UnitCost,
                TotalCost = layer.UnitCost * take,
                CounterpartyWarehouseId = counterpartyWarehouseId,
                SalesRepUserId = salesRepUserId,
                SalesRepCode = salesRepCode
            };

            _db.StockTransactions.Add(txn);

            _db.StockConsumptions.Add(new StockConsumption
            {
                IssueTxnId = txn.Id,
                LayerId = layer.Id,
                Qty = take,
                UnitCost = layer.UnitCost
            });
        }

        if (remaining > 0)
            throw new InvalidOperationException($"Insufficient stock. Missing: {remaining}");
    }

    private async Task EmitAccountingAsync(Guid orgUnitId, InventoryDocType docType, Guid docId, string voucherNo, List<AccountingEntry> entries)
    {
        var v = new AccountingVoucher(
            VoucherNo: voucherNo,
            SourceDocType: docType.ToString(),
            SourceDocId: docId.ToString(),
            DateUtc: DateTimeOffset.UtcNow,
            Entries: entries
        );

        var msg = new AccountingOutboxMessage
        {
            EventType = "InventoryVoucher",
            SourceModule = "Inventory",
            SourceDocType = docType.ToString(),
            SourceDocId = docId.ToString(),
            OrgUnitId = orgUnitId,
            PayloadJson = JsonSerializer.Serialize(v)
        };

        _db.AccountingOutbox.Add(msg);
        await _db.SaveChangesAsync();
    }

    private async Task<decimal> GuessUnitCostAsync(Guid orgUnitId, Guid warehouseId, Guid productId, string? lotCode, DateTime? expiry)
    {
        // fallback: last IN txn cost or last layer cost
        var q = _db.StockTransactions.Where(t =>
            t.OrgUnitId == orgUnitId &&
            t.WarehouseId == warehouseId &&
            t.ProductId == productId &&
            t.Direction == StockTxnDirection.In);

        if (!string.IsNullOrWhiteSpace(lotCode))
            q = q.Where(t => t.LotCode == InventoryLot.NormalizeLot(lotCode));
        if (expiry.HasValue)
            q = q.Where(t => t.ExpiryDate == expiry);

        var last = await q.OrderByDescending(t => t.TxnDateUtc).FirstOrDefaultAsync();
        return last?.UnitCost ?? 0m;
    }
}
