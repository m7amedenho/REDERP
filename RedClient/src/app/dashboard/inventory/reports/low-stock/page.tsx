"use client";

import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  TrendingDown,
  Package,
  ShoppingCart,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Filter,
  Download,
  Printer,
} from "lucide-react";
import Link from "next/link";

// تعريف نوع البيانات للأصناف المنخفضة
export type LowStockItem = {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  shortage: number;
  shortagePercentage: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  lastRestock: string;
  daysSinceRestock: number;
  status: "حرج" | "منخفض" | "متوسط";
  supplier: string;
  leadTime: number; // أيام
};

// بيانات تجريبية للأصناف المنخفضة المخزون
const data: LowStockItem[] = [
  {
    id: "1",
    code: "SEED-002",
    name: "شتلات فلفل ألوان",
    category: "البذور والشتلات",
    currentStock: 8,
    minStock: 10,
    maxStock: 30,
    shortage: 2,
    shortagePercentage: 20,
    unit: "صينية",
    unitPrice: 45,
    totalValue: 360,
    lastRestock: "2024-01-10",
    daysSinceRestock: 5,
    status: "حرج",
    supplier: "مشتل الرياض",
    leadTime: 3,
  },
  {
    id: "2",
    code: "PEST-001",
    name: "مبيد كلوروبيرفوس 48%",
    category: "المبيدات",
    currentStock: 45,
    minStock: 50,
    maxStock: 100,
    shortage: 5,
    shortagePercentage: 10,
    unit: "لتر",
    unitPrice: 120,
    totalValue: 5400,
    lastRestock: "2024-01-08",
    daysSinceRestock: 7,
    status: "حرج",
    supplier: "شركة الكيماويات",
    leadTime: 5,
  },
  {
    id: "3",
    code: "TOOL-001",
    name: "مضخة رش يدوية 16 لتر",
    category: "الأدوات الزراعية",
    currentStock: 25,
    minStock: 30,
    maxStock: 50,
    shortage: 5,
    shortagePercentage: 17,
    unit: "قطعة",
    unitPrice: 280,
    totalValue: 7000,
    lastRestock: "2024-01-05",
    daysSinceRestock: 10,
    status: "منخفض",
    supplier: "مورد الأدوات الزراعية",
    leadTime: 7,
  },
  {
    id: "4",
    code: "FERT-001",
    name: "سماد NPK 20-20-20",
    category: "الأسمدة",
    currentStock: 12,
    minStock: 15,
    maxStock: 40,
    shortage: 3,
    shortagePercentage: 20,
    unit: "كيلوجرام",
    unitPrice: 85,
    totalValue: 1020,
    lastRestock: "2024-01-12",
    daysSinceRestock: 3,
    status: "منخفض",
    supplier: "مصنع الأسمدة",
    leadTime: 4,
  },
  {
    id: "5",
    code: "SEED-003",
    name: "بذور الخيار الهجين F1",
    category: "البذور والشتلات",
    currentStock: 18,
    minStock: 20,
    maxStock: 60,
    shortage: 2,
    shortagePercentage: 10,
    unit: "كيلوجرام",
    unitPrice: 320,
    totalValue: 5760,
    lastRestock: "2024-01-09",
    daysSinceRestock: 6,
    status: "متوسط",
    supplier: "مورد البذور المتخصصة",
    leadTime: 2,
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<LowStockItem>[] = [
  {
    accessorKey: "code",
    header: "كود الصنف",
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
        "البذور والشتلات":
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        المبيدات: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        "الأدوات الزراعية":
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        الأسمدة:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
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
    accessorKey: "currentStock",
    header: "الرصيد الحالي",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-red-600">
          {row.original.currentStock}
        </span>
        <span className="text-xs text-muted-foreground">
          / {row.original.minStock}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shortage",
    header: "العجز",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-medium text-red-600">{row.original.shortage}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.shortagePercentage}%
        </div>
      </div>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "سعر الوحدة",
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-medium">
          {row.original.unitPrice.toLocaleString()} جنيه
        </div>
        <div className="text-xs text-muted-foreground">للوحدة</div>
      </div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: "القيمة الإجمالية",
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-medium">
          {row.original.totalValue.toLocaleString()} جنيه
        </div>
        <div className="text-xs text-muted-foreground">للرصيد الحالي</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const statusColors: { [key: string]: string } = {
        حرج: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        منخفض:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
        متوسط:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
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
  {
    accessorKey: "daysSinceRestock",
    header: "أيام منذ آخر توريد",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <span>{row.original.daysSinceRestock} يوم</span>
      </div>
    ),
  },
  {
    accessorKey: "supplier",
    header: "المورد",
  },
];

export default function LowStockReportPage() {
  const totalShortage = data.reduce((sum, item) => sum + item.shortage, 0);
  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  const avgShortagePercentage = Math.round(
    data.reduce((sum, item) => sum + item.shortagePercentage, 0) / data.length
  );

  const handleCreateOrder = () => {
    console.log("إنشاء طلب توريد للأصناف المنخفضة");
  };

  const handleViewItem = (item: LowStockItem) => {
    console.log("عرض تفاصيل الصنف:", item);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">الأصناف المنخفضة المخزون</h1>
            <p className="text-muted-foreground">
              تقرير مفصل عن الأصناف التي تحتاج إعادة توريد فوري
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة التقرير
          </Button>
          <Button onClick={handleCreateOrder} className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            إنشاء طلب توريد
          </Button>
        </div>
      </div>

      {/* ملخص التقرير */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              عدد الأصناف المنخفضة
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              صنف تحتاج إعادة توريد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العجز</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShortage}</div>
            <p className="text-xs text-muted-foreground">وحدة تحتاج توريد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              متوسط نسبة العجز
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgShortagePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              من الحد الأدنى المطلوب
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              القيمة المفقودة
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()} جنيه
            </div>
            <p className="text-xs text-muted-foreground">
              قيمة العجز في المخزون
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل العجز حسب الفئة */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع العجز حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "البذور والشتلات", count: 2, percentage: 40 },
                { category: "المبيدات", count: 1, percentage: 20 },
                { category: "الأدوات الزراعية", count: 1, percentage: 20 },
                { category: "الأسمدة", count: 1, percentage: 20 },
              ].map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{category.category}</span>
                    <Badge variant="outline">{category.count} صنف</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توصيات التوريد العاجل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">توريد فوري مطلوب</span>
              </div>
              <p className="text-xs text-muted-foreground">
                هناك صنفان في حالة حرجة تحتاجان توريد فوري خلال 24 ساعة
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">توريد أسبوعي</span>
              </div>
              <p className="text-xs text-muted-foreground">
                3 أصناف تحتاج توريد خلال الأسبوع القادم
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>متوسط وقت التوريد:</span>
                <span className="font-medium">4.2 أيام</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>إجمالي الطلبات المقترحة:</span>
                <Badge variant="outline">{data.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الأصناف المنخفضة */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الأصناف المنخفضة المخزون</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="ابحث في الأصناف المنخفضة بالاسم أو الكود..."
            rtl={true}
            showExport={true}
            showSelection={true}
            showSearch={true}
            showFilters={true}
            onView={handleViewItem}
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
                options: ["حرج", "منخفض", "متوسط"],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* توصيات التوريد */}
      <Card>
        <CardHeader>
          <CardTitle>خطة التوريد المقترحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="font-medium">توريد فوري (24 ساعة)</span>
              </div>
              <div className="space-y-2">
                {data
                  .filter((item) => item.status === "حرج")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <Badge variant="outline">
                        {item.shortage} {item.unit}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="font-medium">توريد أسبوعي</span>
              </div>
              <div className="space-y-2">
                {data
                  .filter((item) => item.status === "منخفض")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <Badge variant="outline">
                        {item.shortage} {item.unit}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="font-medium">توريد شهري</span>
              </div>
              <div className="space-y-2">
                {data
                  .filter((item) => item.status === "متوسط")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <Badge variant="outline">
                        {item.shortage} {item.unit}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
