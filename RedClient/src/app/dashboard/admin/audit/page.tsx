"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AuditLog = {
  id: number;
  correlationId: string;
  actorUserId?: string;
  actorUserName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  orgUnitId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  timestampUtc: string;
};

function can(permissionKeys: string[], key: string) {
  return permissionKeys?.includes(key);
}

export default function AuditPage() {
  const { permissions, isLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [action, setAction] = useState("");
  const [orgUnitId, setOrgUnitId] = useState("");
  const [correlationId, setCorrelationId] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get<AuditLog[]>("/audit/logs", {
        params: {
          page,
          pageSize: 30,
          entityType: entityType || undefined,
          entityId: entityId || undefined,
          action: action || undefined,
          orgUnitId: orgUnitId || undefined,
          correlationId: correlationId || undefined,
        },
      });
      setLogs(res.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل تحميل اللوجز");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchLogs();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (isLoading || loading) {
    return (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[520px]" />
      </div>
    );
  }

  if (!can(permissions, "Audit.View")) {
    return (
      <div className="p-6" dir="rtl">
        <Card>
          <CardHeader><CardTitle>غير مصرح</CardTitle></CardHeader>
          <CardContent>مش عندك صلاحية عرض الـ Audit Logs.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">مراجعة كل العمليات والتغييرات.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setPage(1); fetchLogs(); }}>
            بحث
          </Button>
          <Button variant="outline" onClick={fetchLogs}>تحديث</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Filters</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="entityType" value={entityType} onChange={(e) => setEntityType(e.target.value)} />
          <Input placeholder="entityId" value={entityId} onChange={(e) => setEntityId(e.target.value)} />
          <Input placeholder="action" value={action} onChange={(e) => setAction(e.target.value)} />
          <Input placeholder="orgUnitId" value={orgUnitId} onChange={(e) => setOrgUnitId(e.target.value)} />
          <Input placeholder="correlationId" value={correlationId} onChange={(e) => setCorrelationId(e.target.value)} />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>السابق</Button>
            <Badge variant="secondary">Page {page}</Badge>
            <Button variant="outline" onClick={() => setPage((p) => p + 1)}>التالي</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Results</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الوقت</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Org</TableHead>
                  <TableHead>Correlation</TableHead>
                  <TableHead>Success</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap">{new Date(l.timestampUtc).toLocaleString()}</TableCell>
                    <TableCell>{l.actorUserName || l.actorUserId || "-"}</TableCell>
                    <TableCell className="font-medium">{l.action}</TableCell>
                    <TableCell className="text-xs">
                      <div>{l.entityType}</div>
                      <div className="text-muted-foreground">{l.entityId || "-"}</div>
                    </TableCell>
                    <TableCell className="text-xs">{l.orgUnitId || "-"}</TableCell>
                    <TableCell className="text-xs">{l.correlationId}</TableCell>
                    <TableCell>
                      {l.success ? <Badge>OK</Badge> : <Badge variant="destructive">FAIL</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
