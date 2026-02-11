"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/inventory/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orgApi } from "@/lib/api/org";
import { inventoryApi } from "@/lib/api/inventory";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api/http";
import Link from "next/link";

export default function NewCountPage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [orgUnitId, setOrgUnitId] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseId, setWarehouseId] = useState("");

  const [sessionId, setSessionId] = useState("");

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
      if (ws.length) setWarehouseId(ws[0].id);
    })();
  }, [orgUnitId]);

  async function create() {
    try {
      const res = await inventoryApi.createCount({ orgUnitId, warehouseId, snapshotAtUtc: null });
      setSessionId(res.id);
      toast.success("تم إنشاء جلسة الجرد");
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="جرد جديد" subtitle="إنشاء جلسة ثم إضافة الأصناف ثم Post" />

      <Card className="rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
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

            <Button className="rounded-xl" onClick={create} disabled={!orgUnitId || !warehouseId}>
              إنشاء
            </Button>
          </div>

          {sessionId ? (
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="text-sm">
                SessionId: <span className="font-mono">{sessionId}</span>
              </div>
              <Link href={`/dashboard/inventory/counts/${sessionId}`}>
                <Button variant="secondary" className="rounded-xl">فتح الجلسة</Button>
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
