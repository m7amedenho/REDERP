"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/inventory/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZplPreview } from "@/components/inventory/ZplPreview";
import { orgApi } from "@/lib/api/org";
import { inventoryApi } from "@/lib/api/inventory";
import { catalogApi } from "@/lib/api/catalog";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api/http";
import Link from "next/link";

export default function RepPackageBarcodePage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [orgUnitId, setOrgUnitId] = useState("");

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [sourceWarehouseId, setSourceWarehouseId] = useState("");
  const [targetWarehouseId, setTargetWarehouseId] = useState("");

  const [productQ, setProductQ] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState("");

  const [repCode, setRepCode] = useState("");
  const [salesRepUserId, setSalesRepUserId] = useState<string>("");

  const [lotCode, setLotCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [result, setResult] = useState<any>(null);

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
      if (ws.length) {
        setSourceWarehouseId(ws[0].id);
        setTargetWarehouseId(ws[0].id);
      }
    })();
  }, [orgUnitId]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const list = await catalogApi.products(productQ);
      setProducts(list);
    }, 250);
    return () => clearTimeout(t);
  }, [productQ]);

  async function generate() {
    try {
      const p = products.find((x) => x.id === productId) || (productId ? await catalogApi.product(productId) : null);
      if (!p) return toast.error("اختر الصنف");

      const res = await inventoryApi.createRepPackageBarcode({
        orgUnitId,
        productId: p.id,
        productName: p.name,
        productCode: p.code,
        repCode,
        sourceWarehouseId,
        targetWarehouseId,
        lotCode: lotCode || null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        salesRepUserId: salesRepUserId || null,
      });

      setResult(res);
      toast.success("تم إنشاء الباركود");
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="باركود Zebra - صرف للمندوب" subtitle="ينشئ Token + ZPL جاهز للطباعة" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardContent className="p-5 space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <select className="w-full rounded-xl border bg-background p-2" value={orgUnitId} onChange={(e) => setOrgUnitId(e.target.value)}>
                {orgUnits.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>

              <Input value={repCode} onChange={(e) => setRepCode(e.target.value)} placeholder="Rep Code (مثال: REP-001)" />

              <select className="w-full rounded-xl border bg-background p-2" value={sourceWarehouseId} onChange={(e) => setSourceWarehouseId(e.target.value)}>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
              </select>

              <select className="w-full rounded-xl border bg-background p-2" value={targetWarehouseId} onChange={(e) => setTargetWarehouseId(e.target.value)}>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
              </select>

              <Input value={salesRepUserId} onChange={(e) => setSalesRepUserId(e.target.value)} placeholder="SalesRepUserId (اختياري)" />
              <div />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Input value={productQ} onChange={(e) => setProductQ(e.target.value)} placeholder="بحث صنف..." />
              <select className="w-full rounded-xl border bg-background p-2" value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">اختر الصنف</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
              </select>

              <Input value={lotCode} onChange={(e) => setLotCode(e.target.value)} placeholder="LotCode (مهم للبذور)" />
              <Input type="datetime-local" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="ExpiryDate" />
            </div>

            <Button className="rounded-xl" onClick={generate} disabled={!orgUnitId || !productId || !repCode}>
              إنشاء باركود
            </Button>

            {result?.token ? (
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="text-sm">
                  Token: <span className="font-mono">{result.token}</span>
                </div>
                <Link href={`/dashboard/inventory/barcodes/${result.token}`}>
                  <Button variant="secondary" className="rounded-xl">فتح</Button>
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {result?.zpl ? <ZplPreview zpl={result.zpl} /> : null}
      </div>
    </div>
  );
}
