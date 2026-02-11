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

export default function RepStockReportPage() {
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [orgUnitId, setOrgUnitId] = useState("");
  const [repUserId, setRepUserId] = useState("");

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

  async function run() {
    if (!orgUnitId) return;
    setLoading(true);
    try {
      const data = await inventoryApi.reportRepStock({
        orgUnitId,
        repUserId: repUserId || undefined,
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
      <PageHeader title="مخزون المندوب (Rep Stock)" subtitle="فلتر بالمندوب (اختياري)" />

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

        <Input className="rounded-xl" value={repUserId} onChange={(e) => setRepUserId(e.target.value)} placeholder="RepUserId (اختياري)" />

        <Button className="rounded-xl" onClick={run}>عرض</Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        title="Rep Stock"
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
