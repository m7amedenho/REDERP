"use client";

import { useEffect, useMemo, useState } from "react";
import { inventoryApi, StockCountSession } from "@/lib/api/inventory";
import { catalogApi } from "@/lib/api/catalog";
import { apiErrorMessage } from "@/lib/api/http";
import { PageHeader } from "@/components/inventory/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type Row = {
  id: string;
  productId: string;
  productName?: string;
  countedQtyBase: number;
  lotCode?: string | null;
  expiryDate?: string | null;
};

export default function SessionClient({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<StockCountSession | null>(null);
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const [productQ, setProductQ] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [draft, setDraft] = useState<{ productId: string; countedQtyBase: number; lotCode?: string; expiryDate?: string }>({
    productId: "",
    countedQtyBase: 1,
  });

  const columns: ColumnDef<Row>[] = useMemo(
    () => [
      { accessorKey: "productId", header: "ProductId", enableGlobalFilter: true },
      { accessorKey: "productName", header: "اسم الصنف" },
      { accessorKey: "countedQtyBase", header: "الكمية" },
      { accessorKey: "lotCode", header: "Lot" },
      { accessorKey: "expiryDate", header: "Expiry" },
    ],
    []
  );

  async function load() {
    setLoading(true);
    try {
      const s = await inventoryApi.getCount(sessionId);
      setSession(s);

      // enrich product names quickly (best effort)
      const p = await catalogApi.products("");
      const map = new Map(p.map((x) => [x.id, x]));
      const rows: Row[] = s.lines.map((l) => ({
        ...l,
        productName: map.get(l.productId)?.name,
      }));
      setData(rows);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [sessionId]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const list = await catalogApi.products(productQ);
      setProducts(list);
    }, 250);
    return () => clearTimeout(t);
  }, [productQ]);

  async function addLine() {
    if (!session) return;
    try {
      await inventoryApi.addCountLine(sessionId, {
        productId: draft.productId,
        countedQtyBase: draft.countedQtyBase,
        lotCode: draft.lotCode ?? null,
        expiryDate: draft.expiryDate ?? null,
      });
      toast.success("تم إضافة السطر");
      setDraft({ productId: "", countedQtyBase: 1 });
      await load();
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  async function post() {
    if (!session) return;
    try {
      await inventoryApi.postCount(sessionId);
      toast.success("تم ترحيل الجرد");
      await load();
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`جلسة جرد: ${sessionId}`}
        subtitle={`Status: ${session?.status ?? "—"} • Warehouse: ${session?.warehouseId ?? "—"}`}
        actions={
          <Button className="rounded-xl" onClick={post} disabled={!session || session.status !== 1}>
            Post
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardContent className="p-5">
            <DataTable
              columns={columns}
              data={data}
              title="Lines"
              rtl
              showExport={false}
              showSelection={false}
              showSearch={true}
              showFilters={false}
              searchPlaceholder="بحث..."
            />
            {loading ? <div className="text-sm text-muted-foreground mt-2">تحميل...</div> : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="font-medium">إضافة سطر</div>
            <Input value={productQ} onChange={(e) => setProductQ(e.target.value)} placeholder="بحث صنف..." />
            <select
              className="w-full rounded-xl border bg-background p-2"
              value={draft.productId}
              onChange={(e) => setDraft((s) => ({ ...s, productId: e.target.value }))}
            >
              <option value="">اختر الصنف</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>

            <Input
              type="number"
              value={draft.countedQtyBase}
              onChange={(e) => setDraft((s) => ({ ...s, countedQtyBase: Number(e.target.value) }))}
              placeholder="CountedQtyBase"
            />

            <Input value={draft.lotCode ?? ""} onChange={(e) => setDraft((s) => ({ ...s, lotCode: e.target.value }))} placeholder="LotCode (لو لازم)" />
            <Input type="datetime-local" value={draft.expiryDate ?? ""} onChange={(e) => setDraft((s) => ({ ...s, expiryDate: e.target.value }))} placeholder="ExpiryDate (لو لازم)" />

            <Button className="rounded-xl w-full" onClick={addLine} disabled={!draft.productId}>
              إضافة
            </Button>

            <div className="text-xs text-muted-foreground">
              * للبذور: Lot + Expiry لازم يتسجلوا حسب flags في Catalog.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
