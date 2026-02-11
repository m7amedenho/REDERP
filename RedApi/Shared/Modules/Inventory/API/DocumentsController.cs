using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Application;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Data;

namespace RedApi.Modules.Inventory.API;

[ApiController]
[Route("api/inventory/docs")]
public class InventoryDocsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IInventoryPostingService _posting;

    public InventoryDocsController(AppDbContext db, IInventoryPostingService posting)
    {
        _db = db;
        _posting = posting;
    }

    public record CreateDocDto(
        Guid OrgUnitId,
        InventoryDocType DocType,
        Guid? FromWarehouseId,
        Guid? ToWarehouseId,
        string? SalesRepUserId,
        string? SalesRepCode,
        string? ExternalRef,
        string? Notes
    );

    [HttpPost("create")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> Create([FromBody] CreateDocDto dto)
    {
        var doc = new InventoryDocument
        {
            OrgUnitId = dto.OrgUnitId,
            DocType = dto.DocType,
            FromWarehouseId = dto.FromWarehouseId,
            ToWarehouseId = dto.ToWarehouseId,
            SalesRepUserId = dto.SalesRepUserId,
            SalesRepCode = dto.SalesRepCode,
            ExternalRef = dto.ExternalRef,
            Notes = dto.Notes,
            Number = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}",
            Status = InventoryDocStatus.Draft
        };

        _db.InventoryDocuments.Add(doc);
        await _db.SaveChangesAsync();
        return Ok(new { doc.Id, doc.Number });
    }

    public record AddLineDto(
        Guid ProductId,
        decimal QtyBase,
        string? UnitLabel,
        decimal? QtyInUnit,
        string? LotCode,
        DateTime? ExpiryDate,
        decimal? UnitCost
    );

    [HttpPost("{docId:guid}/lines")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> AddLine(Guid docId, [FromBody] AddLineDto dto)
    {
        var doc = await _db.InventoryDocuments.FirstAsync(d => d.Id == docId);

        var line = new InventoryDocumentLine
        {
            DocumentId = docId,
            ProductId = dto.ProductId,
            QtyBase = dto.QtyBase,
            UnitLabel = dto.UnitLabel,
            QtyInUnit = dto.QtyInUnit,
            LotCode = dto.LotCode,
            ExpiryDate = dto.ExpiryDate,
            UnitCost = dto.UnitCost
        };

        _db.InventoryDocumentLines.Add(line);
        await _db.SaveChangesAsync();
        return Ok(new { line.Id });
    }

    [HttpGet("{docId:guid}")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> Get(Guid docId)
    {
        var doc = await _db.InventoryDocuments.AsNoTracking()
            .Include(d => d.Lines)
            .FirstAsync(d => d.Id == docId);

        return Ok(doc);
    }

    [HttpPost("{docId:guid}/post")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> Post(Guid docId)
    {
        var id = await _posting.PostDocumentAsync(HttpContext, docId);
        return Ok(new { id });
    }
}
