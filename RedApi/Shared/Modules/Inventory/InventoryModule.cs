using Microsoft.Extensions.DependencyInjection;
using RedApi.Modules.Inventory.Application;

namespace RedApi.Modules.Inventory;

public static class InventoryModule
{
    public static IServiceCollection AddInventoryModule(this IServiceCollection services)
    {
        services.AddScoped<IInventoryPostingService, InventoryPostingService>();
        services.AddScoped<IStockQueryService, StockQueryService>();
        services.AddScoped<IZebraLabelService, ZebraLabelService>();

        return services;
    }
}
