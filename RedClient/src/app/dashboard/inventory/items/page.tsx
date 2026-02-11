"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Plus,
  QrCode,
  Calendar,
  Hash,
  Scan,
  Filter,
} from "lucide-react";
import { ItemDrawer } from "@/components/inventory/ItemDrawer";
import { InventoryItem as InventoryItemType } from "@/lib/types/inventory";
import { useRouter } from "next/navigation";

// تعريف نوع البيانات للأصناف
export type InventoryItem = {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  supportsBarcode: boolean;
  supportsExpiry: boolean;
  supportsLot: boolean;
  status: "نشط" | "غير نشط";
  currentStock: number;
  minStock: number;
  maxStock: number;
  createdAt: string;
};

// بيانات تجريبية للأصناف
const data: InventoryItem[] = [
  {
    id: "1",
    code: "SEED-001",
    name: "بذور طماطم هجين 025 F1",
    category: "البذور",
    unit: "كيلوجرام",
    supportsBarcode: true,
    supportsExpiry: false,
    supportsLot: true,
    status: "نشط",
    currentStock: 150,
    minStock: 20,
    maxStock: 200,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "PEST-001",
    name: "مبيد كلوروبيرفوس 48%",
    category: "المبيدات",
    unit: "لتر",
    supportsBarcode: true,
    supportsExpiry: true,
    supportsLot: true,
    status: "نشط",
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    code: "TOOL-001",
    name: "مضخة رش يدوية 16 لتر",
    category: "الأدوات الزراعية",
    unit: "قطعة",
    supportsBarcode: false,
    supportsExpiry: false,
    supportsLot: false,
    status: "نشط",
    currentStock: 25,
    minStock: 5,
    maxStock: 50,
    createdAt: "2024-03-05",
  },
  {
    id: "4",
    code: "SEED-002",
    name: "شتلات فلفل ألوان",
    category: "شتلات",
    unit: "صينية",
    supportsBarcode: true,
    supportsExpiry: false,
    supportsLot: true,
    status: "نشط",
    currentStock: 8,
    minStock: 10,
    maxStock: 30,
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    code: "FERT-001",
    name: "سماد NPK 20-20-20",
    category: "الأسمدة",
    unit: "كيلوجرام",
    supportsBarcode: true,
    supportsExpiry: true,
    supportsLot: true,
    status: "غير نشط",
    currentStock: 0,
    minStock: 50,
    maxStock: 200,
    createdAt: "2023-12-01",
  },
  {
    id: "6",
    code: "TOOL-002",
    name: "خرطوم ري طول 50 متر",
    category: "الأدوات الزراعية",
    unit: "متر",
    supportsBarcode: false,
    supportsExpiry: false,
    supportsLot: false,
    status: "نشط",
    currentStock: 320,
    minStock: 100,
    maxStock: 500,
    createdAt: "2024-02-15",
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "code",
    header: "كود الصنف",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "name",
    header: "اسم الصنف",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "category",
    header: "الفئة",
    cell: ({ row }) => {
      const categoryColors: { [key: string]: string } = {
        البذور:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        المبيدات: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        "الأدوات الزراعية":
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        الأسمدة:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        شتلات:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      };

      return (
        <Badge
          className={
            categoryColors[row.original.category] || "bg-gray-100 text-gray-800"
          }
        >
          {row.original.category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "unit",
    header: "الوحدة",
  },
  {
    accessorKey: "supportsBarcode",
    header: "الباركود",
    cell: ({ row }) => (
      <Badge variant={row.original.supportsBarcode ? "default" : "secondary"}>
        {row.original.supportsBarcode ? (
          <QrCode className="w-3 h-3 mr-1" />
        ) : (
          <span className="w-3 h-3 mr-1">✗</span>
        )}
        {row.original.supportsBarcode ? "مدعوم" : "غير مدعوم"}
      </Badge>
    ),
  },
  {
    accessorKey: "supportsExpiry",
    header: "الصلاحية",
    cell: ({ row }) => (
      <Badge variant={row.original.supportsExpiry ? "default" : "secondary"}>
        {row.original.supportsExpiry ? (
          <Calendar className="w-3 h-3 mr-1" />
        ) : (
          <span className="w-3 h-3 mr-1">✗</span>
        )}
        {row.original.supportsExpiry ? "مدعوم" : "غير مدعوم"}
      </Badge>
    ),
  },
  {
    accessorKey: "supportsLot",
    header: "اللوطات",
    cell: ({ row }) => (
      <Badge variant={row.original.supportsLot ? "default" : "secondary"}>
        {row.original.supportsLot ? (
          <Hash className="w-3 h-3 mr-1" />
        ) : (
          <span className="w-3 h-3 mr-1">✗</span>
        )}
        {row.original.supportsLot ? "مدعوم" : "غير مدعوم"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "نشط" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "currentStock",
    header: "الرصيد الحالي",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const minStock = row.original.minStock;
      const isLowStock = stock <= minStock;

      return (
        <div
          className={`flex items-center gap-2 ${
            isLowStock ? "text-red-600 font-medium" : ""
          }`}
        >
          <span>{stock.toLocaleString()}</span>
          {isLowStock && (
            <Badge variant="destructive" className="text-xs">
              منخفض
            </Badge>
          )}
        </div>
      );
    },
  },
];

export default function InventoryItemsPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDelete = (items: InventoryItem[]) => {
    console.log("حذف الأصناف:", items);
    if (confirm(`هل تريد حقاً حذف ${items.length} صنف؟`)) {
      // تنفيذ الحذف
    }
  };

  const handleView = (item: InventoryItem) => {
    router.push(`/dashboard/inventory/items/${item.id}`);
  };

  const handleScanBarcode = () => {
    console.log("مسح باركود");
    // فتح ماسح الباركود
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleSave = async (itemData: Partial<InventoryItemType>) => {
    console.log("حفظ الصنف:", itemData);
    // هنا يتم إرسال البيانات إلى API
    // await api.saveItem(itemData);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">إدارة الأصناف</h1>
            <p className="text-muted-foreground">
              إدارة شاملة لجميع أصناف المخزون مع دعم الباركود واللوطات والصلاحية
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة صنف جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الأصناف
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">صنف نشط في المخزون</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أصناف منخفضة المخزون
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.filter((item) => item.currentStock <= item.minStock).length}
            </div>
            <p className="text-xs text-muted-foreground">تحتاج إعادة طلب</p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أصناف منخفضة المخزون
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.filter((item) => item.currentStock <= item.minStock).length}
            </div>
            <p className="text-xs text-muted-foreground">تحتاج إعادة طلب</p>
          </CardContent>
        </Card>
      </div> */}

      {/* جدول الأصناف */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الأصناف</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="ابحث في الأصناف بالكود أو الاسم..."
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
                column: "category",
                options: [
                  "البذور والشتلات",
                  "المبيدات",
                  "الأدوات الزراعية",
                  "الأسمدة",
                ],
              },
              {
                column: "status",
                options: ["نشط", "غير نشط"],
              },
              {
                column: "supportsBarcode",
                options: ["مدعوم", "غير مدعوم"],
              },
              {
                column: "supportsLot",
                options: ["مدعوم", "غير مدعوم"],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Drawer لإضافة/تعديل الصنف */}
      <ItemDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem as any}
        onSave={handleSave}
      />
    </div>
  );
}
