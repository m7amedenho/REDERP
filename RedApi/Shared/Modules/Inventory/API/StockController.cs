using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedApi.Modules.Inventory.Application;

namespace RedApi.Modules.Inventory.API;

[ApiController]
[Route("api/inventory/stock")]
public class StockController : ControllerBase
{
    private readonly IStockQueryService _q;
    public StockController(IStockQueryService q) => _q = q;

    [HttpGet("balance")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> Balance([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId, [FromQuery] Guid productId)
    {
        var onHand = await _q.GetOnHandAsync(orgUnitId, warehouseId, productId);
        return Ok(new { onHand });
    }

    [HttpGet("layers")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> Layers([FromQuery] Guid orgUnitId, [FromQuery] Guid warehouseId, [FromQuery] Guid productId)
    {
        return Ok(await _q.GetLayersAsync(orgUnitId, warehouseId, productId));
    }

    [HttpGet("item-card")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> ItemCard(
        [FromQuery] Guid orgUnitId,
        [FromQuery] Guid warehouseId,
        [FromQuery] Guid productId,
        [FromQuery] DateTimeOffset? fromUtc,
        [FromQuery] DateTimeOffset? toUtc)
    {
        return Ok(await _q.GetItemCardAsync(orgUnitId, warehouseId, productId, fromUtc, toUtc));
    }
}
