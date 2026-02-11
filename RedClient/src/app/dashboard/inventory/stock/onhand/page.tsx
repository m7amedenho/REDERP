"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/inventory/PageHeader";
import { orgApi } from "@/lib/api/org";
import { inventoryApi } from "@/lib/api/inventory";
import { apiErrorMessage } from "@/lib/api/http";
import { toast } from "sonner";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = any;

export default function OnHandPage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [orgUnitId, setOrgUnitId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Row>[] = useMemo(
    () => [
      {
        accessorKey: "productCode",
        header: "كود الصنف",
        enableGlobalFilter: true,
      },
      {
        accessorKey: "productName",
        header: "اسم الصنف",
        enableGlobalFilter: true,
      },
      { accessorKey: "warehouseCode", header: "المخزن" },
      { accessorKey: "qtyOnHand", header: "الرصيد" },
      { accessorKey: "lotCode", header: "Lot" },
      { accessorKey: "expiryDate", header: "Expiry" },
    ],
    [],
  );

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

    const warehouseIdParam =
      warehouseId === "all" ? undefined : warehouseId || undefined;
    const productIdParam = productId || undefined;

    try {
      const rows = await inventoryApi.reportOnHand({
        orgUnitId,
        warehouseId: warehouseIdParam,
        productId: productIdParam,
      });
      setData(rows);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const warehouseIdParam = warehouseId === "all" ? undefined : warehouseId;

  return (
    <div className="space-y-6">
      <PageHeader
        title="أرصدة المخزون (OnHand)"
        subtitle="فلترة بالفرع/المخزن/الصنف"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Select value={orgUnitId} onValueChange={setOrgUnitId}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="OrgUnit" />
          </SelectTrigger>
          <SelectContent>
            {orgUnits.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={warehouseId} onValueChange={setWarehouseId}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Warehouse (اختياري)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المخازن</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.code} — {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="rounded-xl"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="ProductId (اختياري)"
        />
        <Button className="rounded-xl" onClick={run}>
          عرض
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        title="نتائج OnHand"
        rtl
        showExport={true}
        showSelection={false}
        showSearch={true}
        showFilters={true}
        searchPlaceholder="بحث..."
      />

      {loading ? (
        <div className="text-sm text-muted-foreground">تحميل...</div>
      ) : null}
    </div>
  );
}
