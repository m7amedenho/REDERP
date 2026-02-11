"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageX,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// نوع بيانات المرتجع للجدول
export type ReturnRow = {
  id: string;
  returnNumber: string;
  originalInvoiceNumber: string;
  customerName: string;
  totalAmount: number;
  returnType: "replacement" | "refund" | "credit";
  status: "completed" | "pending" | "rejected";
  returnDate: string;
  itemsCount: number;
};

// بيانات تجريبية للمرتجعات
const mockReturns: ReturnRow[] = [
  {
    id: "1",
    returnNumber: "RET-001",
    originalInvoiceNumber: "INV-001",
    customerName: "أحمد محمد",
    totalAmount: 5000,
    returnType: "refund",
    status: "completed",
    returnDate: "2024-01-15",
    itemsCount: 2,
  },
  {
    id: "2",
    returnNumber: "RET-002",
    originalInvoiceNumber: "INV-002",
    customerName: "شركة الزراعة",
    totalAmount: 12000,
    returnType: "replacement",
    status: "pending",
    returnDate: "2024-01-14",
    itemsCount: 3,
  },
  {
    id: "3",
    returnNumber: "RET-003",
    originalInvoiceNumber: "INV-004",
    customerName: "فاطمة السيد",
    totalAmount: 3500,
    returnType: "credit",
    status: "completed",
    returnDate: "2024-01-13",
    itemsCount: 1,
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<ReturnRow>[] = [
  {
    accessorKey: "returnNumber",
    header: "رقم المرتجع",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("returnNumber")}</div>
    ),
  },
  {
    accessorKey: "originalInvoiceNumber",
    header: "الفاتورة الأصلية",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("originalInvoiceNumber")}</Badge>
    ),
  },
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "totalAmount",
    header: "قيمة المرتجع",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <span className="font-medium">{amount.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "returnType",
    header: "نوع المعالجة",
    cell: ({ row }) => {
      const type = row.getValue("returnType") as string;
      const text =
        type === "replacement"
          ? "استبدال"
          : type === "refund"
          ? "رد مبلغ"
          : "رصيد";
      return <Badge variant="outline">{text}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "completed"
          ? "default"
          : status === "pending"
          ? "secondary"
          : "destructive";

      const icon =
        status === "completed" ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : status === "pending" ? (
          <Clock className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        );

      const text =
        status === "completed"
          ? "مكتمل"
          : status === "pending"
          ? "قيد المراجعة"
          : "مرفوض";

      return (
        <Badge variant={variant} className="flex items-center w-fit">
          {icon}
          {text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "returnDate",
    header: "تاريخ المرتجع",
    cell: ({ row }) => {
      const date = new Date(row.getValue("returnDate"));
      return <span>{date.toLocaleDateString("ar-EG")}</span>;
    },
  },
  {
    accessorKey: "itemsCount",
    header: "عدد الأصناف",
    cell: ({ row }) => {
      const count = row.getValue("itemsCount") as number;
      return <Badge variant="secondary">{count} صنف</Badge>;
    },
  },
];

export default function ReturnsPage() {
  const router = useRouter();

  const handleEdit = (returnItem: ReturnRow) => {
    toast.info("قيد التطوير");
  };

  const handleDelete = (returns: ReturnRow[]) => {
    if (confirm(`هل تريد حقاً حذف ${returns.length} مرتجع؟`)) {
      toast.success(`تم حذف ${returns.length} مرتجع`);
    }
  };

  const handleView = (returnItem: ReturnRow) => {
    router.push(`/dashboard/sales/returns/${returnItem.id}`);
  };

  const handleAddNew = () => {
    toast.info("قيد التطوير - ستفتح نافذة إضافة مرتجع");
  };

  // إحصائيات سريعة
  const stats = {
    total: mockReturns.length,
    completed: mockReturns.filter((r) => r.status === "completed").length,
    pending: mockReturns.filter((r) => r.status === "pending").length,
    totalAmount: mockReturns.reduce((sum, r) => sum + r.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PackageX className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">إدارة المرتجعات</h1>
            <p className="text-muted-foreground">
              إدارة وتتبع مرتجعات المبيعات
            </p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة مرتجع جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المرتجعات
            </CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مرتجعات مكتملة
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalAmount.toLocaleString()} ج.م
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول المرتجعات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المرتجعات</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockReturns}
            searchPlaceholder="ابحث في المرتجعات..."
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
                column: "status",
                options: ["مكتمل", "قيد المراجعة", "مرفوض"],
              },
              {
                column: "returnType",
                options: ["استبدال", "رد مبلغ", "رصيد"],
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
