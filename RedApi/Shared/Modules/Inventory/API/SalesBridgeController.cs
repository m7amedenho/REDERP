using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedApi.Modules.Inventory.Application;

namespace RedApi.Modules.Inventory.API;

[ApiController]
[Route("api/inventory/sales")]
public class SalesBridgeController : ControllerBase
{
    private readonly IInventoryPostingService _posting;
    public SalesBridgeController(IInventoryPostingService posting) => _posting = posting;

    [HttpPost("commit")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> Commit([FromBody] SaleCommitRequest req)
    {
        var id = await _posting.CommitSaleAsync(HttpContext, req);
        return Ok(new { id });
    }

    [HttpPost("return")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> Return([FromBody] SaleReturnRequest req)
    {
        var id = await _posting.CommitSaleReturnAsync(HttpContext, req);
        return Ok(new { id });
    }
}
