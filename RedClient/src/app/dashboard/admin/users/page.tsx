"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { buildTree, OrgNode, OrgUnitFlat, orgTypeLabel } from "@/lib/orgTree";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type UserRow = { id: string; fullName: string; userName: string; email: string; jobTitle: string; isActive: boolean };
type CreateUserDto = { userName: string; email: string; fullName: string; jobTitle: string; password: string };

type AssignUserDto = { userId: string; orgUnitId: string; assignmentType: number };
type AssignRoleScopeDto = { userId: string; roleName: string; orgUnitId: string; appliesToChildren: boolean };

function can(permissionKeys: string[], key: string) {
  return permissionKeys?.includes(key);
}

export default function UsersPage() {
  const { permissions, isLoading } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [orgFlat, setOrgFlat] = useState<OrgUnitFlat[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // create user modal
  const [cu, setCu] = useState<CreateUserDto>({ userName: "", email: "", fullName: "", jobTitle: "", password: "" });

  // assign org modal
  const [aoOrgId, setAoOrgId] = useState<string>("");
  const [aoType, setAoType] = useState<string>("1");

  // assign role scope modal
  const [rsOrgId, setRsOrgId] = useState<string>("");
  const [rsRole, setRsRole] = useState<string>("SalesDelegate");
  const [rsChildren, setRsChildren] = useState<boolean>(true);

  const orgTree = useMemo(() => buildTree(orgFlat), [orgFlat]);

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId) || null, [users, selectedUserId]);

  const refresh = async () => {
    setLoading(true);
    const [u, o] = await Promise.all([api.get<UserRow[]>("/users/list"), api.get<OrgUnitFlat[]>("/org/tree")]);
    setUsers(u.data || []);
    setOrgFlat(o.data || []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const createUser = async () => {
    if (!can(permissions, "Users.Create")) return toast.error("مش معاك صلاحية");
    if (!cu.userName || !cu.email || !cu.fullName || !cu.password) return toast.error("املأ البيانات");

    try {
      const res = await api.post<{ userId: string }>("/users/create", cu);
      toast.success("تم إنشاء المستخدم");
      setCu({ userName: "", email: "", fullName: "", jobTitle: "", password: "" });
      await refresh();
      setSelectedUserId(res.data.userId);
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل إنشاء المستخدم");
    }
  };

  const assignOrg = async () => {
    if (!can(permissions, "Org.AssignUsers")) return toast.error("مش معاك صلاحية");
    if (!selectedUserId) return toast.error("اختار مستخدم");
    if (!aoOrgId) return toast.error("اختار فرع/قسم");

    const dto: AssignUserDto = { userId: selectedUserId, orgUnitId: aoOrgId, assignmentType: Number(aoType) };
    try {
      await api.post(`/users/${aoOrgId}/assign-user`, dto);
      toast.success("تم ربط المستخدم بالفرع/القسم");
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل الربط");
    }
  };

  const assignRoleScope = async () => {
    if (!can(permissions, "Org.AssignRoles")) return toast.error("مش معاك صلاحية");
    if (!selectedUserId) return toast.error("اختار مستخدم");
    if (!rsOrgId) return toast.error("اختار نطاق");

    const dto: AssignRoleScopeDto = { userId: selectedUserId, roleName: rsRole, orgUnitId: rsOrgId, appliesToChildren: rsChildren };
    try {
      await api.post(`/users/${rsOrgId}/assign-role-scope`, dto);
      toast.success("تم تعيين الدور داخل النطاق");
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل تعيين الدور");
    }
  };

  const OrgPickerTree = ({ onPick }: { onPick: (id: string) => void }) => {
    const Node = ({ n, level }: { n: OrgNode; level: number }) => (
      <div className="space-y-1">
        <button
          className="w-full text-right rounded-md px-2 py-2 hover:bg-muted transition flex items-center justify-between"
          onClick={() => onPick(n.id)}
        >
          <div className="flex items-center gap-2">
            <span style={{ marginRight: level * 14 }} />
            <span className="font-medium">{n.name}</span>
            <Badge variant="secondary">{orgTypeLabel(n.type)}</Badge>
            {!n.isActive ? <Badge variant="destructive">متوقف</Badge> : null}
          </div>
        </button>
        {n.children?.map((c) => (
          <Node key={c.id} n={c} level={level + 1} />
        ))}
      </div>
    );

    return (
      <ScrollArea className="h-[380px] pr-2">
        <div className="space-y-2">{orgTree.map((n) => <Node key={n.id} n={n} level={0} />)}</div>
      </ScrollArea>
    );
  };

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

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
          <p className="text-sm text-muted-foreground">إنشاء مستخدم + ربطه بفرع/قسم + تعيين دوره داخل النطاق.</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!can(permissions, "Users.Create")}>مستخدم جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>إنشاء مستخدم</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Username" value={cu.userName} onChange={(e) => setCu({ ...cu, userName: e.target.value })} />
                <Input placeholder="Email" value={cu.email} onChange={(e) => setCu({ ...cu, email: e.target.value })} />
                <Input placeholder="Full name" value={cu.fullName} onChange={(e) => setCu({ ...cu, fullName: e.target.value })} />
                <Input placeholder="Job title" value={cu.jobTitle} onChange={(e) => setCu({ ...cu, jobTitle: e.target.value })} />
                <Input placeholder="Password" type="password" value={cu.password} onChange={(e) => setCu({ ...cu, password: e.target.value })} />
                <Button onClick={createUser}>إنشاء</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={refresh}>تحديث</Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">قائمة المستخدمين</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>اليوزر</TableHead>
                    <TableHead>الإيميل</TableHead>
                    <TableHead>الوظيفة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const selected = u.id === selectedUserId;
                    return (
                      <TableRow
                        key={u.id}
                        className={selected ? "bg-muted" : ""}
                        onClick={() => setSelectedUserId(u.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell className="font-medium">{u.fullName}</TableCell>
                        <TableCell>{u.userName}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.jobTitle}</TableCell>
                        <TableCell>{u.isActive ? <Badge>نشط</Badge> : <Badge variant="destructive">متوقف</Badge>}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">إجراءات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!selectedUser ? (
              <div className="text-sm text-muted-foreground">اختار مستخدم من الجدول.</div>
            ) : (
              <>
                <div className="text-sm">
                  <div className="font-medium">{selectedUser.fullName}</div>
                  <div className="text-muted-foreground">{selectedUser.email}</div>
                </div>

                <Separator />

                {/* Assign to org */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={!can(permissions, "Org.AssignUsers")}>ربط بفرع/قسم</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>ربط المستخدم بوحدة</DialogTitle></DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">نوع الربط</label>
                        <Select value={aoType} onValueChange={setAoType}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Primary</SelectItem>
                            <SelectItem value="2">Secondary</SelectItem>
                            <SelectItem value="3">Temporary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm">اختر الوحدة</label>
                        <OrgPickerTree onPick={(id) => setAoOrgId(id)} />
                        <div className="text-xs text-muted-foreground mt-1">المختار: {aoOrgId || "-"}</div>
                      </div>

                      <Button onClick={assignOrg}>حفظ الربط</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Assign role scope */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!can(permissions, "Org.AssignRoles")}>تعيين دور داخل نطاق</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Role Scope</DialogTitle></DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Role</label>
                        <Select value={rsRole} onValueChange={setRsRole}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="CEO">CEO</SelectItem>
                            <SelectItem value="AreaManager">AreaManager</SelectItem>
                            <SelectItem value="BranchManager">BranchManager</SelectItem>
                            <SelectItem value="AccountManager">AccountManager</SelectItem>
                            <SelectItem value="SalesDelegate">SalesDelegate</SelectItem>
                            <SelectItem value="Accountant">Accountant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm">نطاق org</label>
                        <OrgPickerTree onPick={(id) => setRsOrgId(id)} />
                        <div className="text-xs text-muted-foreground mt-1">المختار: {rsOrgId || "-"}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant={rsChildren ? "default" : "outline"} onClick={() => setRsChildren(true)}>
                          يشمل الأبناء
                        </Button>
                        <Button variant={!rsChildren ? "default" : "outline"} onClick={() => setRsChildren(false)}>
                          نفس الوحدة فقط
                        </Button>
                      </div>

                      <Button onClick={assignRoleScope}>تعيين</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
