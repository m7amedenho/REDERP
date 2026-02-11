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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductPicker } from "@/components/inventory/ProductPicker";

export default function StockLayersPage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [orgUnitId, setOrgUnitId] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");

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
      if (ws.length && !warehouseId) setWarehouseId(ws[0].id);
    })();
  }, [orgUnitId]);

  async function run() {
    if (!orgUnitId || !warehouseId || !productId) {
      return toast.error("اختار OrgUnit + Warehouse + Product");
    }
    setLoading(true);
    try {
      const data = await inventoryApi.stockLayers({ orgUnitId, warehouseId, productId });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="طبقات المخزون (Stock Layers)" subtitle="Lot/Expiry/Cost Layers حسب المخزن والصنف" />

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
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.code} — {w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="rounded-xl" onClick={run}>عرض</Button>
        </div>

        <div className="lg:col-span-2">
          <ProductPicker value={productId} onChange={(id) => setProductId(id)} placeholder="اختر الصنف (مطلوب)" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        title="Layers"
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
