"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function AccessPage() {
  const { roles, permissions, selectedOrgUnitId, loadMyAccess } = useAuth();

  if (!selectedOrgUnitId) return <div className="p-6" dir="rtl">اختار OrgUnit أولاً.</div>;

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <h1 className="text-xl font-bold">صلاحياتي داخل النطاق الحالي</h1>
      <Button variant="outline" onClick={() => loadMyAccess(selectedOrgUnitId)}>تحديث الصلاحيات</Button>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Roles</h2>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => <span key={r} className="px-2 py-1 rounded border text-sm">{r}</span>)}
          {roles.length === 0 && <span className="text-muted-foreground">لا يوجد</span>}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {permissions.map((p) => <div key={p} className="text-sm border rounded p-2">{p}</div>)}
          {permissions.length === 0 && <span className="text-muted-foreground">لا يوجد</span>}
        </div>
      </div>
    </div>
  );
}
