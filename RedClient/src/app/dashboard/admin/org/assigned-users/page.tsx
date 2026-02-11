"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AssignedUser = {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  jobTitle: string;
  isActive: boolean;
  assignmentType: number;
};

function can(permissionKeys: string[], key: string) {
  return permissionKeys?.includes(key);
}

function assignmentLabel(t: number) {
  return t === 1 ? "أساسي" : t === 2 ? "ثانوي" : "مؤقت";
}

export default function AssignedUsersPage() {
  const { selectedOrgUnitId, permissions, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AssignedUser[]>([]);

  const fetchData = async () => {
    if (!selectedOrgUnitId) return;
    setLoading(true);
    try {
      const res = await api.get<AssignedUser[]>(`/users/${selectedOrgUnitId}/assigned-users`);
      setRows(res.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!selectedOrgUnitId) return;
      await fetchData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgUnitId]);

  if (isLoading || loading) {
    return (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[520px]" />
      </div>
    );
  }

  if (!can(permissions, "Users.View")) {
    return (
      <div className="p-6" dir="rtl">
        <Card>
          <CardHeader><CardTitle>غير مصرح</CardTitle></CardHeader>
          <CardContent>مش عندك صلاحية عرض المستخدمين.</CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedOrgUnitId) {
    return (
      <div className="p-6" dir="rtl">
        <Card>
          <CardHeader><CardTitle>اختر وحدة</CardTitle></CardHeader>
          <CardContent>اختار الفرع/الوحدة من الهيدر الأول.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">المستخدمين داخل الوحدة</h1>
          <p className="text-sm text-muted-foreground">
            OrgUnitId: <span className="font-mono text-xs">{selectedOrgUnitId}</span>
          </p>
        </div>

        <Button variant="outline" onClick={fetchData}>تحديث</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assigned Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>اليوزر</TableHead>
                  <TableHead>الإيميل</TableHead>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>الربط</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>{u.userName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.jobTitle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{assignmentLabel(u.assignmentType)}</Badge>
                    </TableCell>
                    <TableCell>
                      {u.isActive ? <Badge>نشط</Badge> : <Badge variant="destructive">متوقف</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {rows.length === 0 ? (
              <div className="text-sm text-muted-foreground mt-4">لا يوجد مستخدمين مرتبطين بهذه الوحدة.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
