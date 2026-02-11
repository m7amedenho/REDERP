"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/inventory/PageHeader";
import { orgApi } from "@/lib/api/org";
import { inventoryApi } from "@/lib/api/inventory";
import { apiErrorMessage } from "@/lib/api/http";
import { toast } from "sonner";
import { DataTable } from "@/components/blocks/DataTable";
import { makeDynamicColumns } from "@/components/inventory/dynamic-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductPicker } from "@/components/inventory/ProductPicker";

export default function LedgerReportPage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [orgUnitId, setOrgUnitId] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");

  const [fromUtc, setFromUtc] = useState("");
  const [toUtc, setToUtc] = useState("");

  const [rows, setRows] = useState<any[]>([]);
  const columns = useMemo(() => makeDynamicColumns(rows), [rows]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const tree = await orgApi.tree();
      const active = tree.filter((x) => x.isActive);
      setOrgUnits(active.map((x) => ({ id: x.id, name: x.name })));
      if (active.length) setOrgUnitId(active[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!orgUnitId) return;
    (async () => {
      const ws = await inventoryApi.warehouses(orgUnitId);
      setWarehouses(ws);
    })();
  }, [orgUnitId]);

  async function run() {
    if (!orgUnitId) return;
    setLoading(true);
    try {
      const data = await inventoryApi.reportLedger({
        orgUnitId,
        warehouseId: warehouseId || undefined,
        productId: productId || undefined,
        fromUtc: fromUtc ? new Date(fromUtc).toISOString() : undefined,
        toUtc: toUtc ? new Date(toUtc).toISOString() : undefined,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="دفتر حركة المخزون (Ledger)" subtitle="فلتر بالمخزن/الصنف/الفترة" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3">
          <Select value={orgUnitId} onValueChange={setOrgUnitId}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="OrgUnit" />
            </SelectTrigger>
            <SelectContent>
              {orgUnits.map((o) => (
                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={warehouseId} onValueChange={setWarehouseId}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Warehouse (اختياري)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">كل المخازن</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.code} — {w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-3 md:grid-cols-2">
            <Input className="rounded-xl" type="datetime-local" value={fromUtc} onChange={(e) => setFromUtc(e.target.value)} placeholder="From" />
            <Input className="rounded-xl" type="datetime-local" value={toUtc} onChange={(e) => setToUtc(e.target.value)} placeholder="To" />
          </div>

          <Button className="rounded-xl" onClick={run}>عرض</Button>
        </div>

        <div className="lg:col-span-2">
          <ProductPicker
            value={productId}
            onChange={(id) => setProductId(id)}
            placeholder="ابحث واختر الصنف لتقرير Ledger (اختياري)"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        title="Ledger"
        rtl
        showExport
        showSelection={false}
        showSearch
        showFilters
        searchPlaceholder="بحث..."
      />

      {loading ? <div className="text-sm text-muted-foreground">تحميل...</div> : null}
    </div>
  );
}
