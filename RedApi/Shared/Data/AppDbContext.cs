using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RedApi.Modules.Catalog.Domain;
using RedApi.Modules.Inventory.Domain;
using RedApi.Shared.Models;

namespace RedApi.Shared.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<OrgUnit> OrgUnits => Set<OrgUnit>();
    public DbSet<OrgUnitClosure> OrgUnitClosures => Set<OrgUnitClosure>();
    public DbSet<UserOrgUnit> UserOrgUnits => Set<UserOrgUnit>();
    public DbSet<UserRoleScope> UserRoleScopes => Set<UserRoleScope>();

    public DbSet<AppModule> Modules => Set<AppModule>();
    public DbSet<AppPermission> Permissions => Set<AppPermission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // Inventory
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<InventoryLot> InventoryLots => Set<InventoryLot>();
    public DbSet<InventoryDocument> InventoryDocuments => Set<InventoryDocument>();
    public DbSet<InventoryDocumentLine> InventoryDocumentLines => Set<InventoryDocumentLine>();
    public DbSet<StockTransaction> StockTransactions => Set<StockTransaction>();
    public DbSet<StockLayer> StockLayers => Set<StockLayer>();
    public DbSet<StockConsumption> StockConsumptions => Set<StockConsumption>();
    public DbSet<InventoryCommitLock> InventoryCommitLocks => Set<InventoryCommitLock>();
    public DbSet<BarcodeToken> BarcodeTokens => Set<BarcodeToken>();
    public DbSet<StockCountSession> StockCountSessions => Set<StockCountSession>();
    public DbSet<StockCountLine> StockCountLines => Set<StockCountLine>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<ProductUnitConversion> ProductUnitConversions => Set<ProductUnitConversion>();
    public DbSet<ProductPrice> ProductPrices => Set<ProductPrice>();
    public DbSet<AccountingOutboxMessage> AccountingOutbox => Set<AccountingOutboxMessage>();
  

protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<AccountingOutboxMessage>().HasIndex(x => new {
            x.SourceDocType,
            x.SourceDocId
        }).IsUnique();

        b.Entity<RefreshToken>().HasIndex(x => x.UserId);
        b.Entity<RefreshToken>().HasIndex(x => x.TokenHash).IsUnique();

        // OrgUnit tree (adjacency)
        b.Entity<OrgUnit>()
            .HasOne(o => o.Parent)
            .WithMany(o => o.Children)
            .HasForeignKey(o => o.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        b.Entity<OrgUnit>()
            .HasIndex(o => new { o.ParentId, o.Name, o.Type })
            .IsUnique(false);

        b.Entity<RefreshToken>()
  .HasOne(rt => rt.User)
  .WithMany()
  .HasForeignKey(rt => rt.UserId)
  .OnDelete(DeleteBehavior.Cascade);

        // Closure table
        b.Entity<OrgUnitClosure>()
            .HasKey(x => new { x.AncestorId, x.DescendantId });

        b.Entity<OrgUnitClosure>()
            .HasOne(x => x.Ancestor)
            .WithMany(o => o.Descendants)
            .HasForeignKey(x => x.AncestorId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<OrgUnitClosure>()
            .HasOne(x => x.Descendant)
            .WithMany(o => o.Ancestors)
            .HasForeignKey(x => x.DescendantId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<OrgUnitClosure>()
            .HasIndex(x => new { x.DescendantId, x.AncestorId, x.Depth });

        // UserOrgUnit
        b.Entity<UserOrgUnit>()
            .HasKey(x => new { x.UserId, x.OrgUnitId });

        b.Entity<UserOrgUnit>()
            .HasOne(x => x.User).WithMany(u => u.OrgUnits)
            .HasForeignKey(x => x.UserId);

        b.Entity<UserOrgUnit>()
            .HasOne(x => x.OrgUnit).WithMany(o => o.Users)
            .HasForeignKey(x => x.OrgUnitId);

        // Modules & Permissions
        b.Entity<AppModule>()
            .HasIndex(m => m.Key).IsUnique();

        b.Entity<AppPermission>()
            .HasIndex(p => p.Key).IsUnique();

        // RolePermission many-to-many
        b.Entity<RolePermission>()
            .HasKey(x => new { x.RoleId, x.PermissionId });

        b.Entity<RolePermission>()
            .HasOne(x => x.Role)
            .WithMany()
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<RolePermission>()
            .HasOne(x => x.Permission)
            .WithMany()
            .HasForeignKey(x => x.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // UserRoleScope
        b.Entity<UserRoleScope>()
            .HasIndex(x => new { x.UserId, x.RoleId, x.OrgUnitId })
            .IsUnique();

        b.Entity<UserRoleScope>()
            .HasOne(x => x.User).WithMany(u => u.RoleScopes)
            .HasForeignKey(x => x.UserId);

        b.Entity<UserRoleScope>()
            .HasOne(x => x.Role).WithMany()
            .HasForeignKey(x => x.RoleId);

        b.Entity<UserRoleScope>()
            .HasOne(x => x.OrgUnit).WithMany()
            .HasForeignKey(x => x.OrgUnitId);

        // Audits
        b.Entity<AuditLog>()
            .HasIndex(x => x.TimestampUtc);
        b.Entity<AuditLog>()
            .HasIndex(x => x.CorrelationId);
        b.Entity<AuditLog>()
            .HasIndex(x => new { x.EntityType, x.EntityId });

        // InventoryDocument → Lines
        b.Entity<InventoryDocument>()
            .HasMany(d => d.Lines)
            .WithOne(l => l.Document)
            .HasForeignKey(l => l.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<Warehouse>()
            .HasIndex(x => new { x.OrgUnitId, x.Code })
            .IsUnique();

        b.Entity<InventoryLot>()
            .HasIndex(x => new { x.ProductId, x.LotCode })
            .IsUnique();

        b.Entity<StockTransaction>()
            .HasIndex(x => new { x.OrgUnitId, x.WarehouseId, x.ProductId, x.TxnDateUtc });

        b.Entity<StockLayer>()
            .HasIndex(x => new { x.OrgUnitId, x.WarehouseId, x.ProductId, x.ReceivedAtUtc });

        b.Entity<InventoryCommitLock>()
            .HasIndex(x => new { x.ExternalRef, x.DocType })
            .IsUnique();

        b.Entity<BarcodeToken>()
            .HasIndex(x => x.Token)
            .IsUnique();

        b.Entity<StockCountSession>()
            .HasMany(s => s.Lines)
            .WithOne(l => l.Session)
            .HasForeignKey(l => l.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // decimals
        b.Entity<StockLayer>().Property(x => x.QtyIn).HasColumnType("numeric(18,4)");
        b.Entity<StockLayer>().Property(x => x.QtyRemaining).HasColumnType("numeric(18,4)");
        b.Entity<StockLayer>().Property(x => x.UnitCost).HasColumnType("numeric(18,6)");

        b.Entity<StockTransaction>().Property(x => x.QtyBase).HasColumnType("numeric(18,4)");
        b.Entity<StockTransaction>().Property(x => x.UnitCost).HasColumnType("numeric(18,6)");
        b.Entity<StockTransaction>().Property(x => x.TotalCost).HasColumnType("numeric(18,6)");

        b.Entity<InventoryDocumentLine>().Property(x => x.QtyBase).HasColumnType("numeric(18,4)");
        b.Entity<InventoryDocumentLine>().Property(x => x.UnitCost).HasColumnType("numeric(18,6)");

        b.Entity<StockConsumption>().Property(x => x.Qty).HasColumnType("numeric(18,4)");
        b.Entity<StockConsumption>().Property(x => x.UnitCost).HasColumnType("numeric(18,6)");

        b.Entity<StockCountLine>().Property(x => x.CountedQtyBase).HasColumnType("numeric(18,4)");

        b.Entity<Product>().HasIndex(x => x.Code).IsUnique();
        b.Entity<Unit>().HasIndex(x => x.Symbol).IsUnique();

        b.Entity<Product>()
          .HasMany(p => p.Prices)
          .WithOne(x => x.Product)
          .HasForeignKey(x => x.ProductId)
          .OnDelete(DeleteBehavior.Cascade);

        b.Entity<Product>()
          .HasMany(p => p.Conversions)
          .WithOne(x => x.Product)
          .HasForeignKey(x => x.ProductId)
          .OnDelete(DeleteBehavior.Cascade);

        b.Entity<ProductUnitConversion>()
          .HasIndex(x => new { x.ProductId, x.FromUnitId, x.ToUnitId })
          .IsUnique();

        b.Entity<ProductPrice>().Property(x => x.Amount).HasColumnType("numeric(18,6)");
        b.Entity<ProductUnitConversion>().Property(x => x.Factor).HasColumnType("numeric(18,6)");
        b.Entity<Product>().Property(x => x.MaxDiscountPercent).HasColumnType("numeric(5,2)");

    }
}
