using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Api.Dtos;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Data;

namespace RedApi.Modules.Inventory.Api;

[ApiController]
[Route("api/inventory/barcodes")]
public class BarcodeController : ControllerBase
{
    private readonly AppDbContext _db;

    public BarcodeController(AppDbContext db)
    {
        _db = db;
    }

    public record RepPackageRequest(
        Guid OrgUnitId,
        Guid ProductId,
        string ProductName,
        string ProductCode,
        string RepCode,
        Guid SourceWarehouseId,
        Guid TargetWarehouseId,
        string? LotCode,
        DateTime? ExpiryDate,
        string? SalesRepUserId
    );

    [HttpPost("rep-package")]
    [ProducesResponseType(typeof(BarcodeTokenResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<BarcodeTokenResponse>> CreateRepPackage([FromBody] RepPackageRequest req)
    {
        // (اختياري) validate orgUnit/warehouses موجودين
        // validate seeds حسب الـ catalog flags (انت بالفعل عامل ValidateTrackingRequiredAsync داخل posting)
        // هنا نقدر نعمل minimum validation:
        if (req.ProductId == Guid.Empty) return BadRequest("ProductId is required.");
        if (req.OrgUnitId == Guid.Empty) return BadRequest("OrgUnitId is required.");
        if (string.IsNullOrWhiteSpace(req.RepCode)) return BadRequest("RepCode is required.");

        var token = new BarcodeToken
        {
            Type = BarcodeTokenType.RepPackage,
            ProductId = req.ProductId,
            LotCode = string.IsNullOrWhiteSpace(req.LotCode) ? null : InventoryLot.NormalizeLot(req.LotCode),
            ExpiryDate = req.ExpiryDate,
            SourceWarehouseId = req.SourceWarehouseId,
            TargetWarehouseId = req.TargetWarehouseId,
            SalesRepUserId = req.SalesRepUserId,
            SalesRepCode = req.RepCode
        };

        _db.BarcodeTokens.Add(token);
        await _db.SaveChangesAsync();

        // Generate ZPL (مثال بسيط) — عدله حسب تصميمك
        var zpl = BuildZpl(
            token: token.Token,
            productName: req.ProductName,
            productCode: req.ProductCode,
            repCode: req.RepCode,
            lot: token.LotCode,
            expiry: token.ExpiryDate
        );

        var res = new BarcodeTokenResponse(
            Token: token.Token,
            Zpl: zpl,
            ProductId: req.ProductId,
            ProductCode: req.ProductCode,
            ProductName: req.ProductName,
            RepCode: req.RepCode,
            LotCode: token.LotCode,
            ExpiryDate: token.ExpiryDate,
            SourceWarehouseId: req.SourceWarehouseId,
            TargetWarehouseId: req.TargetWarehouseId,
            SalesRepUserId: req.SalesRepUserId,
            CreatedAtUtc: token.CreatedAtUtc
        );

        return Ok(res);
    }

    [HttpGet("{token}")]
    [ProducesResponseType(typeof(BarcodeTokenResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<BarcodeTokenResponse>> GetByToken([FromRoute] string token)
    {
        if (string.IsNullOrWhiteSpace(token)) return BadRequest("Token is required.");

        var t = await _db.BarcodeTokens.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Token == token.Trim().ToUpperInvariant() && x.IsActive);

        if (t == null) return NotFound("Token not found.");

        // لو عايز ترجع productName/productCode من catalog:
        var p = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == t.ProductId);

        var zpl = BuildZpl(
            token: t.Token,
            productName: p?.Name ?? "N/A",
            productCode: p?.Code ?? "N/A",
            repCode: t.SalesRepCode ?? "N/A",
            lot: t.LotCode,
            expiry: t.ExpiryDate
        );

        return Ok(new BarcodeTokenResponse(
            Token: t.Token,
            Zpl: zpl,
            ProductId: t.ProductId,
            ProductCode: p?.Code ?? "",
            ProductName: p?.Name ?? "",
            RepCode: t.SalesRepCode ?? "",
            LotCode: t.LotCode,
            ExpiryDate: t.ExpiryDate,
            SourceWarehouseId: t.SourceWarehouseId,
            TargetWarehouseId: t.TargetWarehouseId,
            SalesRepUserId: t.SalesRepUserId,
            CreatedAtUtc: t.CreatedAtUtc
        ));
    }

    private static string BuildZpl(string token, string productName, string productCode, string repCode, string? lot, DateTime? expiry)
    {
        var exp = expiry.HasValue ? expiry.Value.ToString("yyyy-MM-dd") : "-";
        lot ??= "-";

        // ZPL بسيط جداً
        return $@"
^XA
^CF0,30
^FO30,20^FD{EscapeZpl(productName)}^FS
^FO30,60^FDCode: {EscapeZpl(productCode)}^FS
^FO30,100^FDRep: {EscapeZpl(repCode)}^FS
^FO30,140^FDLot: {EscapeZpl(lot)}^FS
^FO30,180^FDExp: {EscapeZpl(exp)}^FS
^FO30,230^BY2
^BCN,80,Y,N,N
^FD{EscapeZpl(token)}^FS
^XZ";
    }

    private static string EscapeZpl(string s)
        => (s ?? "").Replace("^", "").Replace("~", "");
}
