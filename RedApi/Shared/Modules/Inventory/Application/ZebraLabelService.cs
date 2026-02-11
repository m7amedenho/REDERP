using System.Text;

namespace RedApi.Modules.Inventory.Application;

public interface IZebraLabelService
{
    string BuildRepPackageLabel(RepPackageLabelModel m);
}

public record RepPackageLabelModel(
    string Token,
    string ProductName,
    string ProductCode,
    string RepCode,
    string FromWarehouse,
    string ToWarehouse,
    string? LotCode,
    DateTime? ExpiryDate,
    string? ImageUrl // optional: you can ignore or later download/convert
);

public class ZebraLabelService : IZebraLabelService
{
    // This template prints:
    // - Product + code
    // - Rep code + warehouses
    // - Lot + Expiry
    // - QR (token) or Code128
    public string BuildRepPackageLabel(RepPackageLabelModel m)
    {
        // 50x30mm example. Tune for your Zebra model/dpi.
        var exp = m.ExpiryDate?.ToString("yyyy-MM-dd") ?? "-";
        var lot = string.IsNullOrWhiteSpace(m.LotCode) ? "-" : m.LotCode;

        // Use ^BQN for QR, or ^BC for Code128
        var sb = new StringBuilder();
        sb.AppendLine("^XA");
        sb.AppendLine("^CI28"); // UTF-8 (Arabic not always supported on all zebra fonts - keep Arabic in UI, but label text prefer English/code)
        sb.AppendLine("^PW600");
        sb.AppendLine("^LL400");

        sb.AppendLine($"^FO20,20^A0N,30,30^FD{Escape(m.ProductName)}^FS");
        sb.AppendLine($"^FO20,60^A0N,25,25^FDCode: {Escape(m.ProductCode)}^FS");

        sb.AppendLine($"^FO20,95^A0N,25,25^FDRep: {Escape(m.RepCode)}^FS");
        sb.AppendLine($"^FO20,125^A0N,22,22^FDFrom: {Escape(m.FromWarehouse)}^FS");
        sb.AppendLine($"^FO20,150^A0N,22,22^FDTo: {Escape(m.ToWarehouse)}^FS");

        sb.AppendLine($"^FO20,180^A0N,22,22^FDLot: {Escape(lot)}^FS");
        sb.AppendLine($"^FO20,205^A0N,22,22^FDExp: {Escape(exp)}^FS");

        // QR token
        sb.AppendLine("^FO360,90^BQN,2,6^FS");
        sb.AppendLine($"^FDLA,{Escape(m.Token)}^FS");

        // Human readable token
        sb.AppendLine($"^FO20,250^A0N,22,22^FDToken: {Escape(m.Token)}^FS");

        sb.AppendLine("^XZ");
        return sb.ToString();
    }

    private static string Escape(string s) => (s ?? "").Replace("^", "").Replace("~", "").Trim();
}
