using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RedApi.Modules.Inventory;
using RedApi.Services;
using RedApi.Shared.Auditing;
using RedApi.Shared.Constants;
using RedApi.Shared.Data;
using RedApi.Shared.Models;
using RedApi.Shared.Security;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>(opt =>
{
    opt.Password.RequireDigit = false;
    opt.Password.RequiredLength = 6;
    opt.Password.RequireNonAlphanumeric = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "DEV_ONLY_CHANGE_ME_very_long_key";
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IOrgUnitService, OrgUnitService>();
builder.Services.AddInventoryModule();

builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Users.View", p => p.Requirements.Add(new PermissionRequirement(Permissions.Users_View)));
    options.AddPolicy("Users.Create", p => p.Requirements.Add(new PermissionRequirement(Permissions.Users_Create)));

    options.AddPolicy("Org.View", p => p.Requirements.Add(new PermissionRequirement(Permissions.Org_View)));
    options.AddPolicy("Org.Create", p => p.Requirements.Add(new PermissionRequirement(Permissions.Org_Create)));
    options.AddPolicy("Org.Update", p => p.Requirements.Add(new PermissionRequirement(Permissions.Org_Update)));
    options.AddPolicy("Org.AssignUsers", p => p.Requirements.Add(new PermissionRequirement(Permissions.Org_AssignUsers)));
    options.AddPolicy("Org.AssignRoles", p => p.Requirements.Add(new PermissionRequirement(Permissions.Org_AssignRoles)));

    options.AddPolicy("Audit.View", p => p.Requirements.Add(new PermissionRequirement(Permissions.Audit_View)));

    options.AddPolicy("Inventory.View", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_View)));
    options.AddPolicy("Inventory.Post", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_Post)));
    options.AddPolicy("Inventory.Transfer", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_Transfer)));
    options.AddPolicy("Inventory.StockCount", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_StockCount)));
    options.AddPolicy("Inventory.Reports", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_Reports)));
    options.AddPolicy("Inventory.Barcode.Print", p => p.Requirements.Add(new PermissionRequirement(Permissions.Inventory_BarcodePrint)));

});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddInventoryModule();

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
));

var app = builder.Build();

app.UseCors();

app.UseMiddleware<CorrelationMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapOpenApi();
app.MapScalarApiReference();
await SeedCoreAsync(app);

app.Run();

static async Task SeedCoreAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var orgSvc = scope.ServiceProvider.GetRequiredService<IOrgUnitService>();

    await db.Database.MigrateAsync();

    // Roles
    string[] roles = { "Admin", "CEO", "AreaManager", "BranchManager", "AccountManager", "SalesDelegate", "Accountant" };
    foreach (var r in roles)
        if (!await roleMgr.RoleExistsAsync(r))
            await roleMgr.CreateAsync(new IdentityRole(r));

    // Modules
    var modules = new[]
    {
        (Modules.Core, "Core"),
        (Modules.Org, "Organization"),
        (Modules.Users, "Users"),
        (Modules.Audit, "Audit"),
        (Modules.Inventory, "Inventory Management"), // ✅

    };

    foreach (var (k, n) in modules)
        if (!await db.Modules.AnyAsync(m => m.Key == k))
            db.Modules.Add(new AppModule { Key = k, Name = n, IsActive = true });

    await db.SaveChangesAsync();

    int ModuleId(string key) => db.Modules.Single(m => m.Key == key).Id;

    // Permissions
    var perms = new List<(string moduleKey, string key, string name)>
    {
        (Modules.Org, Permissions.Org_View, "View org tree"),
        (Modules.Org, Permissions.Org_Create, "Create org unit"),
        (Modules.Org, Permissions.Org_Update, "Update org unit"),
        (Modules.Org, Permissions.Org_AssignUsers, "Assign users"),
        (Modules.Org, Permissions.Org_AssignRoles, "Assign roles scopes"),

        (Modules.Users, Permissions.Users_View, "View users"),
        (Modules.Users, Permissions.Users_Create, "Create users"),
        (Modules.Users, Permissions.Users_Update, "Update users"),
        (Modules.Users, Permissions.Users_Deactivate, "Deactivate users"),

        (Modules.Audit, Permissions.Audit_View, "View audit logs"),

         (Modules.Inventory, Permissions.Inventory_View, "View inventory"),
    (Modules.Inventory, Permissions.Inventory_Post, "Post inventory documents"),
    (Modules.Inventory, Permissions.Inventory_Transfer, "Transfer between warehouses"),
    (Modules.Inventory, Permissions.Inventory_StockCount, "Stock counts"),
    (Modules.Inventory, Permissions.Inventory_Reports, "Inventory reports"),
    (Modules.Inventory, Permissions.Inventory_BarcodePrint, "Print barcode labels"),
    };

    foreach (var p in perms)
    {
        if (!await db.Permissions.AnyAsync(x => x.Key == p.key))
            db.Permissions.Add(new AppPermission { ModuleId = ModuleId(p.moduleKey), Key = p.key, Name = p.name, IsActive = true });
    }

    await db.SaveChangesAsync();

    // Root ALEX
    await orgSvc.EnsureRootAlexAsync();

    // Admin user
    var adminEmail = "admin@erp.local";
    var admin = await userMgr.FindByEmailAsync(adminEmail);
    if (admin == null)
    {
        admin = new AppUser
        {
            UserName = "admin",
            Email = adminEmail,
            FullName = "System Admin",
            JobTitle = "IT",
            Department = "IT",
            RegionLabel = "ALEX",
            IsActive = true
        };
        await userMgr.CreateAsync(admin, "123456");
        await userMgr.AddToRoleAsync(admin, "Admin");
    }

    // Give Admin role all permissions via RolePermission
    var adminRole = await roleMgr.FindByNameAsync("Admin");
    if (adminRole != null)
    {
        var allPermIds = await db.Permissions.Select(p => p.Id).ToListAsync();
        var existing = await db.RolePermissions.Where(rp => rp.RoleId == adminRole.Id).Select(rp => rp.PermissionId).ToListAsync();
        var missing = allPermIds.Except(existing).ToList();

        if (missing.Count > 0)
        {
            db.RolePermissions.AddRange(missing.Select(pid => new RolePermission { RoleId = adminRole.Id, PermissionId = pid }));
            await db.SaveChangesAsync();
        }
    }

    // CEO user optional (لو عايز)
    var ceoEmail = "ceo@erp.local";
    var ceo = await userMgr.FindByEmailAsync(ceoEmail);
    if (ceo == null)
    {
        ceo = new AppUser
        {
            UserName = "ceo",
            Email = ceoEmail,
            FullName = "CEO",
            JobTitle = "CEO",
            Department = "Management",
            RegionLabel = "ALEX",
            IsActive = true
        };
        await userMgr.CreateAsync(ceo, "123456");
        await userMgr.AddToRoleAsync(ceo, "CEO");
    }
}
