namespace RedApi.Modules.Inventory.Application;

public record AccountingEntry(
    string AccountCode,
    decimal Debit,
    decimal Credit,
    string Description
);

public record AccountingVoucher(
    string VoucherNo,
    string SourceDocType,
    string SourceDocId,
    DateTimeOffset DateUtc,
    List<AccountingEntry> Entries
);
