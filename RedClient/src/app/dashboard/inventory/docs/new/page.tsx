"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/inventory/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api/http";
import { inventoryApi, InventoryDocType, Warehouse } from "@/lib/api/inventory";
import { orgApi } from "@/lib/api/org";
import { catalogApi, CatalogProduct } from "@/lib/api/catalog";
import Link from "next/link";

type LineDraft = {
  productId: string;
  qtyBase: number;
  unitCost?: number | null;
  lotCode?: string | null;
  expiryDate?: string | null;
  unitLabel?: string | null;
  qtyInUnit?: number | null;
};

export default function NewDocPage() {
  const [orgUnitId, setOrgUnitId] = useState("");
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);

  const [docType, setDocType] = useState<number>(InventoryDocType.Receiving);
  const [fromWarehouseId, setFromWarehouseId] = useState<string>("");
  const [toWarehouseId, setToWarehouseId] = useState<string>("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [externalRef, setExternalRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [productQ, setProductQ] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [line, setLine] = useState<LineDraft>({ productId: "", qtyBase: 1 });

  const [createdDocId, setCreatedDocId] = useState<string>("");

  const requiresFrom = docType === InventoryDocType.Transfer || docType === InventoryDocType.IssueToRep || docType === InventoryDocType.Adjustment;
  const requiresTo = docType === InventoryDocType.Receiving || docType === InventoryDocType.Transfer || docType === InventoryDocType.IssueToRep || docType === InventoryDocType.Adjustment;

  async function loadOrg() {
    const tree = await orgApi.tree();
    const active = tree.filter((x) => x.isActive);
    setOrgUnits(active.map((x) => ({ id: x.id, name: x.name })));
    if (!orgUnitId && active.length) setOrgUnitId(active[0].id);
  }

  async function loadWarehouses(ou: string) {
    const list = await inventoryApi.warehouses(ou);
    setWarehouses(list);
    if (!fromWarehouseId && list.length) setFromWarehouseId(list[0].id);
    if (!toWarehouseId && list.length) setToWarehouseId(list[0].id);
  }

  async function searchProducts(q: string) {
    const list = await catalogApi.products(q);
    setProducts(list);
  }

  useEffect(() => { loadOrg(); }, []);
  useEffect(() => { if (orgUnitId) loadWarehouses(orgUnitId); }, [orgUnitId]);

  useEffect(() => {
    const t = setTimeout(() => searchProducts(productQ), 250);
    return () => clearTimeout(t);
  }, [productQ]);

  async function createDoc() {
    try {
      const res = await inventoryApi.createDoc({
        orgUnitId,
        docType,
        fromWarehouseId: requiresFrom ? fromWarehouseId || null : null,
        toWarehouseId: requiresTo ? toWarehouseId || null : null,
        externalRef: externalRef || null,
        notes: notes || null,
        salesRepUserId: null,
        salesRepCode: null,
      });
      setCreatedDocId(res.id);
      toast.success("تم إنشاء المستند");
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  async function addLine() {
    if (!createdDocId) return toast.error("أنشئ المستند أولًا");
    if (!line.productId || !line.qtyBase || line.qtyBase <= 0) return toast.error("بيانات السطر غير صحيحة");

    // Receiving لازم unitCost
    if (docType === InventoryDocType.Receiving && (!line.unitCost || line.unitCost <= 0)) {
      return toast.error("الاستلام يحتاج UnitCost");
    }

    try {
      await inventoryApi.addDocLine(createdDocId, {
        productId: line.productId,
        qtyBase: line.qtyBase,
        unitCost: line.unitCost ?? null,
        lotCode: line.lotCode ?? null,
        expiryDate: line.expiryDate ?? null,
        unitLabel: line.unitLabel ?? null,
        qtyInUnit: line.qtyInUnit ?? null,
      });
      toast.success("تم إضافة السطر");
      setLine({ productId: "", qtyBase: 1 });
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  async function postDoc() {
    if (!createdDocId) return;
    try {
      await inventoryApi.postDoc(createdDocId);
      toast.success("تم ترحيل المستند (Posted)");
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="مستند مخزون جديد"
        subtitle="Receiving / Transfer / IssueToRep / Adjustment"
        actions={
          createdDocId ? (
            <Link href={`/dashboard/inventory/docs/${createdDocId}`}>
              <Button variant="secondary" className="rounded-xl">فتح المستند</Button>
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
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

              <Select value={String(docType)} onValueChange={(v) => setDocType(Number(v))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="DocType" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(InventoryDocType.Receiving)}>Receiving (استلام)</SelectItem>
                  <SelectItem value={String(InventoryDocType.Transfer)}>Transfer (تحويل)</SelectItem>
                  <SelectItem value={String(InventoryDocType.IssueToRep)}>IssueToRep (صرف لمندوب)</SelectItem>
                  <SelectItem value={String(InventoryDocType.Adjustment)}>Adjustment (تسوية)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={fromWarehouseId} onValueChange={setFromWarehouseId} disabled={!requiresFrom}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="From Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.code} — {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toWarehouseId} onValueChange={setToWarehouseId} disabled={!requiresTo}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="To Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.code} — {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input value={externalRef} onChange={(e) => setExternalRef(e.target.value)} placeholder="ExternalRef (اختياري)" />
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات" />
            </div>

            <div className="flex gap-2">
              <Button className="rounded-xl" onClick={createDoc} disabled={!orgUnitId}>
                إنشاء المستند
              </Button>
              <Button className="rounded-xl" variant="secondary" onClick={postDoc} disabled={!createdDocId}>
                ترحيل (Post)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="font-medium">إضافة سطر</div>

            <Input value={productQ} onChange={(e) => setProductQ(e.target.value)} placeholder="بحث بالصنف (اسم/كود)..." />

            <Select value={line.productId} onValueChange={(v) => setLine((s) => ({ ...s, productId: v }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="اختر الصنف" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={line.qtyBase}
              onChange={(e) => setLine((s) => ({ ...s, qtyBase: Number(e.target.value) }))}
              placeholder="QtyBase"
            />

            {docType === InventoryDocType.Receiving ? (
              <Input
                type="number"
                value={line.unitCost ?? ""}
                onChange={(e) => setLine((s) => ({ ...s, unitCost: Number(e.target.value) }))}
                placeholder="UnitCost (مطلوب للاستلام)"
              />
            ) : null}

            <Input
              value={line.lotCode ?? ""}
              onChange={(e) => setLine((s) => ({ ...s, lotCode: e.target.value || null }))}
              placeholder="LotCode (مطلوب للبذور)"
            />
            <Input
              type="datetime-local"
              value={line.expiryDate ?? ""}
              onChange={(e) => setLine((s) => ({ ...s, expiryDate: e.target.value || null }))}
              placeholder="ExpiryDate (مطلوب للبذور)"
            />

            <Button className="rounded-xl w-full" onClick={addLine}>
              إضافة السطر
            </Button>

            {createdDocId ? (
              <div className="text-xs text-muted-foreground">
                DocId: <span className="font-mono">{createdDocId}</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
