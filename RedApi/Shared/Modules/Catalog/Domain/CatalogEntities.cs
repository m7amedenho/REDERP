using System.ComponentModel.DataAnnotations;

namespace RedApi.Modules.Catalog.Domain;

public enum PriceType
{
    Purchase = 1,
    Wholesale = 2,
    SemiWholesale = 3,
    Retail = 4,
    USD = 5
}

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(40)] public string Code { get; set; } = "";     // SKU
    [MaxLength(200)] public string Name { get; set; } = "";
    public string? ImageUrl { get; set; }

    // flags for tracking
    public bool IsLotTracked { get; set; } = false;
    public bool IsExpiryTracked { get; set; } = false;

    // flexible units
    public Guid BaseUnitId { get; set; }
    public Unit BaseUnit { get; set; } = default!;

    public List<ProductUnitConversion> Conversions { get; set; } = new();
    public List<ProductPrice> Prices { get; set; } = new();

    // max discount auto (you can update automatically based on prices)
    public decimal MaxDiscountPercent { get; set; } = 0m; // 0..100
}

public class Unit
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(60)] public string Name { get; set; } = "";     // كجم / عبوة / كرتونة
    [MaxLength(20)] public string Symbol { get; set; } = "";   // KG / PCS / BOX
}

public class ProductUnitConversion
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = default!;

    public Guid FromUnitId { get; set; }
    public Unit FromUnit { get; set; } = default!;

    public Guid ToUnitId { get; set; }
    public Unit ToUnit { get; set; } = default!;

    // Qty(ToUnit) = Qty(FromUnit) * Factor
    public decimal Factor { get; set; } // example: 1 BOX = 24 PCS => From=BOX, To=PCS, Factor=24
}

public class ProductPrice
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = default!;

    public PriceType Type { get; set; }
    public decimal Amount { get; set; }

    // If you want price per unit:
    public Guid? UnitId { get; set; }
    public Unit? Unit { get; set; }
}
