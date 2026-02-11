"use client";

import { useEffect, useState } from "react";
import { inventoryApi, InventoryDocType, InventoryDoc } from "@/lib/api/inventory";
import { apiErrorMessage } from "@/lib/api/http";
import { PageHeader } from "@/components/inventory/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function DocDetailsClient({ docId }: { docId: string }) {
  const [doc, setDoc] = useState<InventoryDoc | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const d = await inventoryApi.getDoc(docId);
      setDoc(d);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function post() {
    try {
      await inventoryApi.postDoc(docId);
      toast.success("تم ترحيل المستند");
      await load();
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  useEffect(() => { load(); }, [docId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`مستند: ${doc?.number ?? docId}`}
        subtitle={`DocType: ${doc?.docType ?? "—"} • Status: ${doc?.status ?? "—"}`}
        actions={
          <Button className="rounded-xl" onClick={post} disabled={!doc || doc.status !== 1}>
            Post
          </Button>
        }
      />

      <Card className="rounded-2xl">
        <CardContent className="p-5">
          {loading ? (
            <div className="text-sm text-muted-foreground">تحميل...</div>
          ) : !doc ? (
            <div className="text-sm text-muted-foreground">لا يوجد بيانات</div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div><span className="text-muted-foreground">OrgUnit:</span> {doc.orgUnitId}</div>
                <div><span className="text-muted-foreground">Date:</span> {doc.docDateUtc}</div>
                <div><span className="text-muted-foreground">From:</span> {doc.fromWarehouseId ?? "—"}</div>
                <div><span className="text-muted-foreground">To:</span> {doc.toWarehouseId ?? "—"}</div>
                <div><span className="text-muted-foreground">ExternalRef:</span> {doc.externalRef ?? "—"}</div>
              </div>

              <div className="border-t pt-4">
                <div className="font-medium mb-3">Lines</div>
                <div className="grid gap-2">
                  {doc.lines.map((l) => (
                    <div key={l.id} className="rounded-xl border p-3 text-sm">
                      <div className="flex flex-wrap gap-3 justify-between">
                        <div className="font-mono">{l.productId}</div>
                        <div>QtyBase: <b>{l.qtyBase}</b></div>
                      </div>
                      <div className="mt-2 grid gap-1 md:grid-cols-3 text-muted-foreground">
                        <div>Lot: {l.lotCode ?? "—"}</div>
                        <div>Expiry: {l.expiryDate ?? "—"}</div>
                        <div>UnitCost: {l.unitCost ?? "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {doc.docType === InventoryDocType.IssueToRep ? (
                <div className="text-xs text-muted-foreground">
                  * الباركود للمندوب يتم إنشاؤه من صفحة “باركود مندوب”
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
