namespace RedApi.Shared.Constants;

public static class Modules
{
    public const string Core = "Core";
    public const string Users = "Users";
    public const string Org = "Org";
    public const string Sales = "Sales";
    public const string Inventory = "Inventory";
    public const string Accounting = "Accounting";
    public const string Audit = "Audit";

}

public static class Permissions
{
    // Org
    public const string Org_View = "Org.View";
    public const string Org_Create = "Org.Create";
    public const string Org_Update = "Org.Update";
    public const string Org_AssignUsers = "Org.AssignUsers";
    public const string Org_AssignRoles = "Org.AssignRoles";

    // Users
    public const string Users_View = "Users.View";
    public const string Users_Create = "Users.Create";
    public const string Users_Update = "Users.Update";
    public const string Users_Deactivate = "Users.Deactivate";

    // Audit
    public const string Audit_View = "Audit.View";

    // Inventory
    public const string Inventory_View = "Inventory.View";
    public const string Inventory_Post = "Inventory.Post";
    public const string Inventory_Transfer = "Inventory.Transfer";
    public const string Inventory_StockCount = "Inventory.StockCount";
    public const string Inventory_Reports = "Inventory.Reports";
    public const string Inventory_BarcodePrint = "Inventory.Barcode.Print";
}