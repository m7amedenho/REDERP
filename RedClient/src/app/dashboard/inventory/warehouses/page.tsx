// "use client";

// import { useState } from "react";
// import { DataTable } from "@/components/blocks/DataTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Warehouse,
//   Plus,
//   MapPin,
//   Package,
//   Users,
//   Activity,
//   TrendingUp,
//   AlertTriangle,
// } from "lucide-react";
// import { WarehouseModal } from "@/components/inventory/WarehouseModal";
// import { Warehouse as WarehouseType } from "@/lib/types/inventory";
// import { useRouter } from "next/navigation";

// // تعريف نوع البيانات للمخازن
// export type Warehouse = {
//   id: string;
//   name: string;
//   location: string;
//   type: "رئيسي" | "فرعي" | "معرض" | "مرتجع";
//   capacity: number;
//   currentStock: number;
//   utilization: number;
//   itemCount: number;
//   allowedUsers: string[];
//   status: "نشط" | "غير نشط" | "صيانة";
//   createdAt: string;
// };

// // بيانات تجريبية للمخازن
// const data: Warehouse[] = [
//   {
//     id: "1",
//     name: "مخزن البذور الرئيسي",
//     location: "النهضة - سند 1",
//     type: "رئيسي",
//     capacity: 10000,
//     currentStock: 8500,
//     utilization: 85,
//     itemCount: 45,
//     allowedUsers: ["user1", "user2", "user3"],
//     status: "نشط",
//     createdAt: "2023-01-15",
//   },
// ];

// // تعريف الأعمدة
// export const columns: ColumnDef<Warehouse>[] = [
//   {
//     accessorKey: "name",
//     header: "اسم المخزن",
//     enableGlobalFilter: true,
//   },
//   {
//     accessorKey: "location",
//     header: "الموقع",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1">
//         <MapPin className="w-3 h-3 text-muted-foreground" />
//         <span className="text-sm">{row.original.location}</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "type",
//     header: "نوع المخزن",
//     cell: ({ row }) => {
//       const typeColors: { [key: string]: string } = {
//         رئيسي: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
//         فرعي: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
//         معرض: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
//         مرتجع:
//           "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
//       };

//       return (
//         <Badge
//           className={
//             typeColors[row.original.type] || "bg-gray-100 text-gray-800"
//           }
//         >
//           {row.original.type}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "utilization",
//     header: "نسبة الاستخدام",
//     cell: ({ row }) => {
//       const utilization = row.original.utilization;
//       const getColor = (value: number) => {
//         if (value >= 80)
//           return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
//         if (value >= 60)
//           return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
//       };

//       return (
//         <div className="flex items-center gap-2">
//           <div className="w-16 bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-primary h-2 rounded-full transition-all duration-300"
//               style={{ width: `${utilization}%` }}
//             />
//           </div>
//           <Badge className={getColor(utilization)}>{utilization}%</Badge>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "itemCount",
//     header: "عدد الأصناف",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1">
//         <Package className="w-3 h-3 text-muted-foreground" />
//         <span>{row.original.itemCount.toLocaleString()}</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "allowedUsers",
//     header: "المستخدمون المسموحون",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1">
//         <Users className="w-3 h-3 text-muted-foreground" />
//         <span>{row.original.allowedUsers.length} مستخدمين</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "الحالة",
//     cell: ({ row }) => {
//       const statusColors: { [key: string]: string } = {
//         نشط: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
//         "غير نشط":
//           "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
//         صيانة: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
//       };

//       return (
//         <Badge
//           className={
//             statusColors[row.original.status] || "bg-gray-100 text-gray-800"
//           }
//         >
//           {row.original.status}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "currentStock",
//     header: "الرصيد الحالي",
//     cell: ({ row }) => (
//       <div className="text-sm">
//         {row.original.currentStock.toLocaleString()} /{" "}
//         {row.original.capacity.toLocaleString()}
//       </div>
//     ),
//   },
// ];

// export default function WarehousesPage() {
//   const router = useRouter();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
//     null
//   );

//   const handleEdit = (warehouse: Warehouse) => {
//     setSelectedWarehouse(warehouse);
//     setModalOpen(true);
//   };

//   const handleDelete = (warehouses: Warehouse[]) => {
//     console.log("حذف المخازن:", warehouses);
//     if (confirm(`هل تريد حقاً حذف ${warehouses.length} مخزن؟`)) {
//       // تنفيذ الحذف
//     }
//   };

//   const handleView = (warehouse: Warehouse) => {
//     router.push(`/dashboard/inventory/warehouses/${warehouse.id}`);
//   };

//   const handleAddNew = () => {
//     setSelectedWarehouse(null);
//     setModalOpen(true);
//   };

//   const handleSave = async (warehouseData: Partial<WarehouseType>) => {
//     console.log("حفظ المخزن:", warehouseData);
//     // هنا يتم إرسال البيانات إلى API
//     // await api.saveWarehouse(warehouseData);
//   };

//   return (
//     <div className="space-y-6">
//       {/* رأس الصفحة */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Warehouse className="w-8 h-8 text-primary" />
//           <div>
//             <h1 className="text-2xl font-bold">إدارة المخازن</h1>
//             <p className="text-muted-foreground">
//               إدارة شاملة لجميع المخازن والمستودعات في الشركة
//             </p>
//           </div>
//         </div>
//         <Button onClick={handleAddNew} className="gap-2">
//           <Plus className="w-4 h-4" />
//           إضافة مخزن جديد
//         </Button>
//       </div>

//       {/* إحصائيات سريعة */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               إجمالي المخازن
//             </CardTitle>
//             <Warehouse className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{data.length}</div>
//             <p className="text-xs text-muted-foreground">
//               {data.filter((w) => w.status === "نشط").length} مخزن نشط
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">إجمالي السعة</CardTitle>
//             <Package className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {data.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">سعة تخزينية كلية</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               معدل الاستخدام
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {Math.round(
//                 data.reduce((sum, w) => sum + w.utilization, 0) / data.length
//               )}
//               %
//             </div>
//             <p className="text-xs text-muted-foreground">
//               متوسط استخدام المخازن
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               مخازن تحت الصيانة
//             </CardTitle>
//             <AlertTriangle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">
//               {data.filter((w) => w.status === "صيانة").length}
//             </div>
//             <p className="text-xs text-muted-foreground">تحتاج متابعة</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* تفاصيل المخازن حسب النوع */}
//       <div className="grid gap-4 lg:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>توزيع المخازن حسب النوع</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {["رئيسي", "فرعي", "معرض", "مرتجع"].map((type) => {
//                 const count = data.filter((w) => w.type === type).length;
//                 const percentage = Math.round((count / data.length) * 100);

//                 return (
//                   <div key={type} className="flex items-center justify-between">
//                     <span className="text-sm">{type}</span>
//                     <div className="flex items-center gap-2">
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-primary h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                       <Badge variant="outline">{count}</Badge>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>حالة المخازن</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
//                 <div className="flex items-center gap-2">
//                   <Activity className="w-4 h-4 text-green-600" />
//                   <span className="text-sm">مخازن نشطة</span>
//                 </div>
//                 <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                   {data.filter((w) => w.status === "نشط").length}
//                 </Badge>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
//                 <div className="flex items-center gap-2">
//                   <Package className="w-4 h-4 text-gray-600" />
//                   <span className="text-sm">مخازن غير نشطة</span>
//                 </div>
//                 <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
//                   {data.filter((w) => w.status === "غير نشط").length}
//                 </Badge>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
//                 <div className="flex items-center gap-2">
//                   <AlertTriangle className="w-4 h-4 text-red-600" />
//                   <span className="text-sm">مخازن تحت الصيانة</span>
//                 </div>
//                 <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
//                   {data.filter((w) => w.status === "صيانة").length}
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* جدول المخازن */}
//       <Card>
//         <CardHeader>
//           <CardTitle>قائمة المخازن</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             columns={columns}
//             data={data}
//             searchPlaceholder="ابحث في المخازن بالاسم أو الموقع..."
//             rtl={true}
//             showExport={true}
//             showSelection={true}
//             showSearch={true}
//             showFilters={true}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//             onView={handleView}
//             filterOptions={[
//               {
//                 column: "type",
//                 options: ["رئيسي", "فرعي", "معرض", "مرتجع"],
//               },
//               {
//                 column: "status",
//                 options: ["نشط", "غير نشط", "صيانة"],
//               },
//             ]}
//           />
//         </CardContent>
//       </Card>

//       {/* Modal لإضافة/تعديل المخزن */}
//       <WarehouseModal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setSelectedWarehouse(null);
//         }}
//         warehouse={selectedWarehouse as any}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { inventoryApi } from "@/lib/api/inventory";
import { orgApi } from "@/lib/api/org";
import { apiErrorMessage } from "@/lib/api/http";
import { PageHeader } from "@/components/inventory/PageHeader";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Row = {
  id: string;
  code: string;
  name: string;
  type: number;
  orgUnitId: string;
  isActive: boolean;
  ownerRepCode?: string | null;
};

export default function WarehousesPage() {
  const [orgUnitId, setOrgUnitId] = useState<string>("");
  const [orgUnits, setOrgUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  // create dialog
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<number>(1);

  const columns: ColumnDef<Row>[] = useMemo(
    () => [
      { accessorKey: "code", header: "الكود", enableGlobalFilter: true },
      { accessorKey: "name", header: "الاسم", enableGlobalFilter: true },
      {
        accessorKey: "type",
        header: "النوع",
        cell: ({ row }) => (
          <Badge variant={row.original.type === 2 ? "secondary" : "default"}>
            {row.original.type === 2 ? "مخزن مندوب (Mobile)" : "مخزن ثابت"}
          </Badge>
        ),
      },
      {
        accessorKey: "isActive",
        header: "الحالة",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "destructive"}>
            {row.original.isActive ? "نشط" : "غير نشط"}
          </Badge>
        ),
      },
      {
        accessorKey: "ownerRepCode",
        header: "Rep Code",
      },
    ],
    []
  );

  async function loadOrg() {
    const tree = await orgApi.tree();
    const active = tree.filter((x) => x.isActive);
    setOrgUnits(active.map((x) => ({ id: x.id, name: x.name })));
    if (!orgUnitId && active.length) setOrgUnitId(active[0].id);
  }

  async function loadWarehouses(ou: string) {
    if (!ou) return;
    setLoading(true);
    try {
      const list = await inventoryApi.warehouses(ou);
      setData(list as any);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orgUnitId) loadWarehouses(orgUnitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgUnitId]);

  async function createWarehouse() {
    try {
      await inventoryApi.createWarehouse({ orgUnitId, code, name, type });
      toast.success("تم إنشاء المخزن");
      setOpen(false);
      setCode("");
      setName("");
      setType(1);
      await loadWarehouses(orgUnitId);
    } catch (e) {
      toast.error(apiErrorMessage(e));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="المخازن"
        subtitle="مخازن ثابتة + مخازن مندوبي المبيعات"
        actions={
          <div className="flex gap-2">
            <Select value={orgUnitId} onValueChange={setOrgUnitId}>
              <SelectTrigger className="w-[240px] rounded-xl">
                <SelectValue placeholder="اختر الفرع/القسم" />
              </SelectTrigger>
              <SelectContent>
                {orgUnits.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">مخزن جديد</Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء مخزن</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3">
                  <Input placeholder="Code مثل WH-ALEX-01" value={code} onChange={(e) => setCode(e.target.value)} />
                  <Input placeholder="اسم المخزن" value={name} onChange={(e) => setName(e.target.value)} />
                  <Select value={String(type)} onValueChange={(v) => setType(Number(v))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="نوع المخزن" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Fixed</SelectItem>
                      <SelectItem value="2">Mobile (مندوب)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpen(false)} className="rounded-xl">
                    إلغاء
                  </Button>
                  <Button onClick={createWarehouse} className="rounded-xl" disabled={!orgUnitId || !code || !name}>
                    حفظ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={data}
        title="قائمة المخازن"
        rtl
        showExport={false}
        showSelection={false}
        showSearch={true}
        showFilters={true}
        searchPlaceholder="بحث بالكود أو الاسم..."
        filterOptions={[
          { column: "type", options: ["1", "2"] },
          { column: "isActive", options: ["true", "false"] },
        ]}
        // optional actions
        onView={(row) => console.log("view", row)}
        onEdit={(row) => console.log("edit", row)}
        onDelete={(rows) => console.log("delete", rows)}
      />

      {loading ? <div className="text-sm text-muted-foreground">تحميل...</div> : null}
    </div>
  );
}
