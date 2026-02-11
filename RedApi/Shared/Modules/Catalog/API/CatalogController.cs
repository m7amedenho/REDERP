using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Catalog.Domain;
using RedApi.Shared.Data;
using System.Text.Json;

namespace RedApi.Modules.Catalog.API;

[ApiController]
[Route("api/catalog")]
public class CatalogController : ControllerBase
{
    private readonly AppDbContext _db;
    public CatalogController(AppDbContext db) => _db = db;

    [HttpGet("products")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> ListProducts([FromQuery] string? q)
    {
        var query = _db.Products.AsNoTracking().Include(p => p.BaseUnit).AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            q = q.Trim();
            query = query.Where(p => p.Name.Contains(q) || p.Code.Contains(q));
        }

        var rows = await query
            .OrderBy(p => p.Name)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.ImageUrl,
                p.IsLotTracked,
                p.IsExpiryTracked,
                BaseUnit = new { p.BaseUnitId, p.BaseUnit.Name, p.BaseUnit.Symbol },
                p.MaxDiscountPercent
            })
            .ToListAsync();

        return Ok(rows);
    }

    [HttpGet("products/{id:guid}")]
    [Authorize(Policy = "Inventory.View")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var p = await _db.Products.AsNoTracking()
            .Include(x => x.BaseUnit)
            .Include(x => x.Prices)
            .Include(x => x.Conversions)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p == null) return NotFound();
        return Ok(p);
    }

    // ✅ DTO مرن: baseUnitId ممكن يكون Guid-string أو اسم Unit
    public record CreateProductDtoFlexible(
        string Code,
        string Name,
        string? ImageUrl,
        bool IsLotTracked,
        bool IsExpiryTracked,
        JsonElement BaseUnitId, // Guid OR string name
        decimal MaxDiscountPercent
    );

    [HttpPost("products/create")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> CreateProduct([FromBody] JsonElement body)
    {
        CreateProductDtoFlexible? dto = null;

        try
        {
            // ✅ Accept either { dto: {...} } OR direct {...}
            if (body.ValueKind == JsonValueKind.Object && body.TryGetProperty("dto", out var dtoProp))
                dto = dtoProp.Deserialize<CreateProductDtoFlexible>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            else
                dto = body.Deserialize<CreateProductDtoFlexible>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException ex)
        {
            return BadRequest(new
            {
                message = "Invalid JSON body. Could not parse CreateProductDto.",
                error = ex.Message,
                raw = body.GetRawText()
            });
        }

        if (dto is null) return BadRequest(new { message = "Invalid body: dto is null or missing." });
        if (string.IsNullOrWhiteSpace(dto.Code)) return BadRequest(new { message = "Code is required." });
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest(new { message = "Name is required." });

        // ✅ Resolve BaseUnitId:
        // - لو Guid => استخدمه
        // - لو نص => اعتبره اسم Unit واعمل Find/Create
        var resolvedBaseUnitId = await ResolveBaseUnitIdAsync(dto.BaseUnitId);

        if (resolvedBaseUnitId == Guid.Empty)
            return BadRequest(new { message = "baseUnitId must be a valid Guid OR a non-empty Unit name string." });

        var p = new Product
        {
            Code = dto.Code.Trim().ToUpperInvariant(),
            Name = dto.Name.Trim(),
            ImageUrl = dto.ImageUrl,
            IsLotTracked = dto.IsLotTracked,
            IsExpiryTracked = dto.IsExpiryTracked,
            BaseUnitId = resolvedBaseUnitId,
            MaxDiscountPercent = Clamp(dto.MaxDiscountPercent, 0, 100)
        };

        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return Ok(new { p.Id });
    }

    private async Task<Guid> ResolveBaseUnitIdAsync(JsonElement baseUnitIdElement)
    {
        // null/undefined
        if (baseUnitIdElement.ValueKind == JsonValueKind.Null || baseUnitIdElement.ValueKind == JsonValueKind.Undefined)
            return Guid.Empty;

        // string
        if (baseUnitIdElement.ValueKind == JsonValueKind.String)
        {
            var s = baseUnitIdElement.GetString()?.Trim();
            if (string.IsNullOrWhiteSpace(s)) return Guid.Empty;

            // 1) لو Guid
            if (Guid.TryParse(s, out var gid))
            {
                var exists = await _db.Units.AsNoTracking().AnyAsync(x => x.Id == gid);
                return exists ? gid : Guid.Empty;
            }

            // 2) لو اسم Unit (كتابة عادي)
            // ابحث بالاسم (case-insensitive)
            var existing = await _db.Units.FirstOrDefaultAsync(x => x.Name.ToLower() == s.ToLower());
            if (existing != null) return existing.Id;

            // Create Unit تلقائيًا
            var u = new Unit
            {
                Name = s,
                Symbol = MakeSymbol(s) // لو عربي هتكون نفس الاسم غالبًا
            };

            _db.Units.Add(u);
            await _db.SaveChangesAsync();
            return u.Id;
        }

        // أي نوع تاني مش مقبول
        return Guid.Empty;
    }

    private static string MakeSymbol(string name)
    {
        // رمز بسيط: لو الاسم عربي خلّيه نفس الاسم، لو إنجليزي خد أول 5 حروف Upper
        name = name.Trim();
        var hasArabic = name.Any(ch => ch >= 0x0600 && ch <= 0x06FF);
        if (hasArabic) return name;

        var letters = new string(name.Where(char.IsLetterOrDigit).ToArray());
        if (string.IsNullOrWhiteSpace(letters)) return name.ToUpperInvariant();
        return letters.Length <= 5 ? letters.ToUpperInvariant() : letters[..5].ToUpperInvariant();
    }

    private static decimal Clamp(decimal x, decimal min, decimal max) => x < min ? min : (x > max ? max : x);

    // باقي endpoints زي ما هي عندك
    public record UpsertPriceDto(Guid ProductId, PriceType Type, decimal Amount, Guid? UnitId);

    [HttpPost("prices/upsert")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> UpsertPrice([FromBody] UpsertPriceDto dto)
    {
        var row = await _db.ProductPrices.FirstOrDefaultAsync(x => x.ProductId == dto.ProductId && x.Type == dto.Type && x.UnitId == dto.UnitId);
        if (row == null)
        {
            row = new ProductPrice { ProductId = dto.ProductId, Type = dto.Type, UnitId = dto.UnitId };
            _db.ProductPrices.Add(row);
        }
        row.Amount = dto.Amount;
        await _db.SaveChangesAsync();
        return Ok();
    }

    public record UpsertUnitDto(string Name, string Symbol);

    [HttpPost("units/create")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> CreateUnit([FromBody] UpsertUnitDto dto)
    {
        var u = new Unit { Name = dto.Name.Trim(), Symbol = dto.Symbol.Trim().ToUpperInvariant() };
        _db.Units.Add(u);
        await _db.SaveChangesAsync();
        return Ok(new { u.Id });
    }

    public record AddConversionDto(Guid ProductId, Guid FromUnitId, Guid ToUnitId, decimal Factor);

    [HttpPost("units/conversion")]
    [Authorize(Policy = "Inventory.Post")]
    public async Task<IActionResult> AddConversion([FromBody] AddConversionDto dto)
    {
        var c = new ProductUnitConversion { ProductId = dto.ProductId, FromUnitId = dto.FromUnitId, ToUnitId = dto.ToUnitId, Factor = dto.Factor };
        _db.ProductUnitConversions.Add(c);
        await _db.SaveChangesAsync();
        return Ok(new { c.Id });
    }
}
