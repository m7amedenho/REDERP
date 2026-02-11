using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Inventory.Api.Dtos;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Data;

namespace RedApi.Modules.Inventory.Api;

[ApiController]
[Route("api/inventory/counts")]
public class StockCountController : ControllerBase
{
    private readonly AppDbContext _db;

    public StockCountController(AppDbContext db)
    {
        _db = db;
    }

    public record CreateSessionRequest(Guid OrgUnitId, Guid WarehouseId, DateTimeOffset? SnapshotAtUtc);

    [HttpPost("create")]
    [ProducesResponseType(typeof(IdResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IdResponse>> Create([FromBody] CreateSessionRequest req)
    {
        var s = new StockCountSession
        {
            OrgUnitId = req.OrgUnitId,
            WarehouseId = req.WarehouseId,
            SnapshotAtUtc = req.SnapshotAtUtc ?? DateTimeOffset.UtcNow,
            CreatedByUserId = User?.FindFirst("Id")?.Value ?? User?.FindFirst("sub")?.Value
        };

        _db.StockCountSessions.Add(s);
        await _db.SaveChangesAsync();

        return Ok(new IdResponse(s.Id));
    }

    public record AddLineRequest(Guid ProductId, decimal CountedQtyBase, string? LotCode, DateTime? ExpiryDate);

    [HttpPost("{sessionId:guid}/lines")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddLine(Guid sessionId, [FromBody] AddLineRequest req)
    {
        var s = await _db.StockCountSessions.Include(x => x.Lines).FirstOrDefaultAsync(x => x.Id == sessionId);
        if (s == null) return NotFound("Session not found.");
        if (s.Status != StockCountStatus.Draft) return BadRequest("Session is not Draft.");

        s.Lines.Add(new StockCountLine
        {
            SessionId = s.Id,
            ProductId = req.ProductId,
            CountedQtyBase = req.CountedQtyBase,
            LotCode = string.IsNullOrWhiteSpace(req.LotCode) ? null : InventoryLot.NormalizeLot(req.LotCode),
            ExpiryDate = req.ExpiryDate
        });

        await _db.SaveChangesAsync();
        return Ok();
    }

    // ✅ المطلوب عشان الفرونت يشتغل 100%
    [HttpGet("{sessionId:guid}")]
    [ProducesResponseType(typeof(StockCountSessionDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<StockCountSessionDto>> Get(Guid sessionId)
    {
        var s = await _db.StockCountSessions
            .Include(x => x.Lines)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == sessionId);

        if (s == null) return NotFound("Session not found.");

        return Ok(new StockCountSessionDto(
            Id: s.Id,
            OrgUnitId: s.OrgUnitId,
            WarehouseId: s.WarehouseId,
            Status: (int)s.Status,
            SnapshotAtUtc: s.SnapshotAtUtc,
            CreatedAtUtc: s.CreatedAtUtc,
            CreatedByUserId: s.CreatedByUserId,
            PostedAtUtc: s.PostedAtUtc,
            PostedByUserId: s.PostedByUserId,
            Lines: s.Lines.Select(l => new StockCountLineDto(
                Id: l.Id,
                ProductId: l.ProductId,
                CountedQtyBase: l.CountedQtyBase,
                LotCode: l.LotCode,
                ExpiryDate: l.ExpiryDate
            )).ToList()
        ));
    }

    [HttpPost("{sessionId:guid}/post")]
    [ProducesResponseType(typeof(IdResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IdResponse>> Post(Guid sessionId, [FromServices] RedApi.Modules.Inventory.Application.IInventoryPostingService postingService)
    {
        // ده بيستدعي service بتاعتك PostStockCountAsync
        var id = await postingService.PostStockCountAsync(HttpContext, sessionId);
        return Ok(new IdResponse(id));
    }
}
