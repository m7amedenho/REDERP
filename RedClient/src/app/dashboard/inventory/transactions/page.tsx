"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Package,
  Warehouse,
} from "lucide-react";
import { TransactionDrawer } from "@/components/inventory/TransactionDrawer";
import { Transaction as TransactionType } from "@/lib/types/inventory";
import { useRouter } from "next/navigation";

// تعريف نوع البيانات للحركات
export type Transaction = {
  id: string;
  type: "وارد" | "صادر" | "تحويل" | "تسوية";
  date: string;
  time: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
  userId: string;
  userName: string;
  status: "مكتمل" | "معلق" | "ملغي";
};

// بيانات تجريبية للحركات
const data: Transaction[] = [
  {
    id: "1",
    type: "وارد",
    date: "2024-01-15",
    time: "09:30",
    warehouseId: "1",
    warehouseName: "مخزن البذور الرئيسي",
    itemId: "1",
    itemName: "بذور طماطم هجين F1",
    itemCode: "SEED-001",
    quantity: 50,
    unit: "كيلوجرام",
    lotNumber: "LOT-2024-001",
    userId: "user1",
    userName: "أحمد محمد",
    status: "مكتمل",
  },
  {
    id: "2",
    type: "صادر",
    date: "2024-01-15",
    time: "14:20",
    warehouseId: "1",
    warehouseName: "مخزن البذور الرئيسي",
    itemId: "2",
    itemName: "مبيد كلوروبيرفوس 48%",
    itemCode: "PEST-001",
    quantity: 10,
    unit: "لتر",
    expiryDate: "2025-06-15",
    userId: "user2",
    userName: "فاطمة علي",
    status: "مكتمل",
  },
  {
    id: "3",
    type: "تحويل",
    date: "2024-01-14",
    time: "11:15",
    warehouseId: "1",
    warehouseName: "مخزن البذور الرئيسي",
    itemId: "3",
    itemName: "مضخة رش يدوية 16 لتر",
    itemCode: "TOOL-001",
    quantity: 5,
    unit: "قطعة",
    notes: "تحويل إلى معرض الدمام",
    userId: "user1",
    userName: "أحمد محمد",
    status: "مكتمل",
  },
  {
    id: "4",
    type: "تسوية",
    date: "2024-01-14",
    time: "16:45",
    warehouseId: "2",
    warehouseName: "مخزن المبيدات",
    itemId: "2",
    itemName: "مبيد كلوروبيرفوس 48%",
    itemCode: "PEST-001",
    quantity: -2,
    unit: "لتر",
    notes: "تسوية عجز في الجرد",
    userId: "user3",
    userName: "محمد خالد",
    status: "مكتمل",
  },
  {
    id: "5",
    type: "وارد",
    date: "2024-01-13",
    time: "08:00",
    warehouseId: "3",
    warehouseName: "معرض الأدوات الزراعية",
    itemId: "6",
    itemName: "خرطوم ري طول 50 متر",
    itemCode: "TOOL-002",
    quantity: 20,
    unit: "متر",
    userId: "user4",
    userName: "سارة أحمد",
    status: "معلق",
  },
  {
    id: "6",
    type: "صادر",
    date: "2024-01-13",
    time: "13:30",
    warehouseId: "4",
    warehouseName: "مخزن المرتجعات",
    itemId: "4",
    itemName: "شتلات فلفل ألوان",
    itemCode: "SEED-002",
    quantity: 2,
    unit: "صينية",
    lotNumber: "LOT-2024-002",
    userId: "user5",
    userName: "علي حسن",
    status: "مكتمل",
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "رقم الحركة",
  },
  {
    accessorKey: "type",
    header: "نوع الحركة",
    cell: ({ row }) => {
      const typeIcons: { [key: string]: any } = {
        وارد: {
          icon: ArrowUpRight,
          color:
            "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100",
        },
        صادر: {
          icon: ArrowDownLeft,
          color: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100",
        },
        تحويل: {
          icon: ArrowRightLeft,
          color:
            "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100",
        },
        تسوية: {
          icon: RotateCcw,
          color:
            "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100",
        },
      };

      const typeInfo = typeIcons[row.original.type] || {
        icon: Activity,
        color: "text-gray-600 bg-gray-100",
      };
      const IconComponent = typeInfo.icon;

      return (
        <Badge className={`${typeInfo.color} gap-1`}>
          <IconComponent className="w-3 h-3" />
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "التاريخ",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Calendar className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm">{row.original.date}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.time}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "warehouseName",
    header: "المخزن",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Warehouse className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm">{row.original.warehouseName}</span>
      </div>
    ),
  },
  {
    accessorKey: "itemName",
    header: "الصنف",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-sm">{row.original.itemName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.itemCode}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "الكمية",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const isPositive = quantity > 0;
      const isNegative = quantity < 0;

      return (
        <div
          className={`flex items-center gap-1 ${
            isNegative ? "text-red-600" : isPositive ? "text-green-600" : ""
          }`}
        >
          {isPositive && <TrendingUp className="w-3 h-3" />}
          {isNegative && <TrendingDown className="w-3 h-3" />}
          <span className="font-medium">
            {Math.abs(quantity).toLocaleString()} {row.original.unit}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lotNumber",
    header: "رقم اللوط",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.lotNumber || "-"}</span>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "تاريخ الانتهاء",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.expiryDate || "-"}</span>
    ),
  },
  {
    accessorKey: "userName",
    header: "المستخدم",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const statusColors: { [key: string]: string } = {
        مكتمل:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        معلق: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        ملغي: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      };

      return (
        <Badge
          className={
            statusColors[row.original.status] || "bg-gray-100 text-gray-800"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];

// بيانات تجريبية للمخازن والأصناف
const warehouses = [
  { id: "1", name: "مخزن البذور الرئيسي" },
  { id: "2", name: "مخزن المبيدات" },
  { id: "3", name: "معرض الأدوات الزراعية" },
  { id: "4", name: "مخزن المرتجعات" },
];

const items = [
  { id: "1", name: "بذور طماطم هجين F1", code: "SEED-001", unit: "كيلوجرام" },
  { id: "2", name: "مبيد كلوروبيرفوس 48%", code: "PEST-001", unit: "لتر" },
  { id: "3", name: "مضخة رش يدوية 16 لتر", code: "TOOL-001", unit: "قطعة" },
  { id: "4", name: "شتلات فلفل ألوان", code: "SEED-002", unit: "صينية" },
  { id: "6", name: "خرطوم ري طول 50 متر", code: "TOOL-002", unit: "متر" },
];

export default function TransactionsPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  const handleDelete = (transactions: Transaction[]) => {
    console.log("حذف الحركات:", transactions);
    if (confirm(`هل تريد حقاً حذف ${transactions.length} حركة؟`)) {
      // تنفيذ الحذف
    }
  };

  const handleView = (transaction: Transaction) => {
    router.push(`/dashboard/inventory/transactions/${transaction.id}`);
  };

  const handleAddNew = () => {
    setSelectedTransaction(null);
    setDrawerOpen(true);
  };

  const handleSave = async (transactionData: Partial<TransactionType>) => {
    console.log("حفظ الحركة:", transactionData);
    // هنا يتم إرسال البيانات إلى API
    // await api.saveTransaction(transactionData);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">الحركات والعمليات</h1>
            <p className="text-muted-foreground">
              تتبع جميع حركات المخزون والعمليات اليومية
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            حركة جديدة
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الحركات اليوم
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter((t) => t.date === "2024-01-15").length}
            </div>
            <p className="text-xs text-muted-foreground">حركة اليوم الحالي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الحركات الواردة
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.filter((t) => t.type === "وارد").length}
            </div>
            <p className="text-xs text-muted-foreground">خلال الأسبوع الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الحركات الصادرة
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.filter((t) => t.type === "صادر").length}
            </div>
            <p className="text-xs text-muted-foreground">خلال الأسبوع الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الحركات المعلقة
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.filter((t) => t.status === "معلق").length}
            </div>
            <p className="text-xs text-muted-foreground">تحتاج متابعة</p>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل الحركات حسب النوع */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الحركات حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "وارد", icon: ArrowUpRight, color: "text-green-600" },
                { type: "صادر", icon: ArrowDownLeft, color: "text-red-600" },
                { type: "تحويل", icon: ArrowRightLeft, color: "text-blue-600" },
                { type: "تسوية", icon: RotateCcw, color: "text-orange-600" },
              ].map(({ type, icon: IconComponent, color }) => {
                const count = data.filter((t) => t.type === type).length;
                const percentage = Math.round((count / data.length) * 100);

                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${color}`} />
                      <span className="text-sm">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حالة الحركات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm">حركات مكتملة</span>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {data.filter((t) => t.status === "مكتمل").length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">حركات معلقة</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  {data.filter((t) => t.status === "معلق").length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-600" />
                  <span className="text-sm">حركات ملغية</span>
                </div>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  {data.filter((t) => t.status === "ملغي").length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تبويبات الحركات حسب النوع */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="inbound">الوارد</TabsTrigger>
          <TabsTrigger value="outbound">الصادر</TabsTrigger>
          <TabsTrigger value="transfer">التحويل</TabsTrigger>
          <TabsTrigger value="adjustment">التسوية</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>جميع الحركات</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="ابحث في الحركات بالصنف أو المخزن..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                filterOptions={[
                  {
                    column: "type",
                    options: ["وارد", "صادر", "تحويل", "تسوية"],
                  },
                  {
                    column: "status",
                    options: ["مكتمل", "معلق", "ملغي"],
                  },
                  {
                    column: "warehouseName",
                    options: [...new Set(data.map((t) => t.warehouseName))],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الحركات الواردة</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter((t) => t.type === "وارد")}
                searchPlaceholder="ابحث في الحركات الواردة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الحركات الصادرة</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter((t) => t.type === "صادر")}
                searchPlaceholder="ابحث في الحركات الصادرة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>حركات التحويل</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter((t) => t.type === "تحويل")}
                searchPlaceholder="ابحث في حركات التحويل..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>حركات التسوية</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter((t) => t.type === "تسوية")}
                searchPlaceholder="ابحث في حركات التسوية..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Drawer لإضافة/تعديل الحركة */}
      <TransactionDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction as any}
        warehouses={warehouses}
        items={items}
        onSave={handleSave}
      />
    </div>
  );
}
