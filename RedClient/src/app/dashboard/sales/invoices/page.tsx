"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Plus,
  
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { InvoiceDrawer } from "@/components/sales/InvoiceDrawer";
import { Invoice } from "@/lib/types/sales";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// نوع بيانات الفاتورة للجدول
export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  invoiceType: "cash" | "credit";
  responsibility: "salesman" | "company";
  dueDate?: string;
  invoiceDate: string;
  salesRepName: string;
  status: "draft" | "confirmed" | "cancelled";
};

// بيانات تجريبية للفواتير
const mockInvoices: InvoiceRow[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customerName: "أحمد محمد الفلاح",
    customerPhone: "01234567890",
    totalAmount: 12500,
    paidAmount: 12500,
    remainingAmount: 0,
    paymentStatus: "paid",
    invoiceType: "cash",
    responsibility: "company",
    invoiceDate: "2024-01-15",
    salesRepName: "محمد أحمد",
    status: "confirmed",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customerName: "شركة الزراعة الحديثة",
    customerPhone: "01098765432",
    totalAmount: 35000,
    paidAmount: 20000,
    remainingAmount: 15000,
    paymentStatus: "partial",
    invoiceType: "credit",
    responsibility: "salesman",
    dueDate: "2024-02-15",
    invoiceDate: "2024-01-15",
    salesRepName: "علي حسن",
    status: "confirmed",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customerName: "فاطمة السيد",
    customerPhone: "01555666777",
    totalAmount: 8900,
    paidAmount: 0,
    remainingAmount: 8900,
    paymentStatus: "unpaid",
    invoiceType: "credit",
    responsibility: "company",
    dueDate: "2024-02-10",
    invoiceDate: "2024-01-14",
    salesRepName: "محمد أحمد",
    status: "confirmed",
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    customerName: "مؤسسة النخيل الزراعية",
    customerPhone: "01234555666",
    totalAmount: 45000,
    paidAmount: 45000,
    remainingAmount: 0,
    paymentStatus: "paid",
    invoiceType: "cash",
    responsibility: "company",
    invoiceDate: "2024-01-14",
    salesRepName: "سارة أحمد",
    status: "confirmed",
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    customerName: "حسن عبد الله",
    customerPhone: "01777888999",
    totalAmount: 15600,
    paidAmount: 10000,
    remainingAmount: 5600,
    paymentStatus: "partial",
    invoiceType: "credit",
    responsibility: "salesman",
    dueDate: "2024-02-20",
    invoiceDate: "2024-01-13",
    salesRepName: "علي حسن",
    status: "confirmed",
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "رقم الفاتورة",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("invoiceNumber")}</div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("customerName")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.customerPhone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "المبلغ الإجمالي",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <span className="font-medium">{amount.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "حالة الدفع",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      const variant =
        status === "paid"
          ? "default"
          : status === "partial"
          ? "secondary"
          : "destructive";

      const icon =
        status === "paid" ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : status === "partial" ? (
          <Clock className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        );

      const text =
        status === "paid"
          ? "مدفوع"
          : status === "partial"
          ? "جزئي"
          : "غير مدفوع";

      return (
        <Badge variant={variant} className="flex items-center w-fit">
          {icon}
          {text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "invoiceType",
    header: "نوع الفاتورة",
    cell: ({ row }) => {
      const type = row.getValue("invoiceType") as string;
      return (
        <Badge variant={type === "cash" ? "default" : "outline"}>
          {type === "cash" ? "نقدي" : "آجل"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "responsibility",
    header: "المسؤولية",
    cell: ({ row }) => {
      const resp = row.getValue("responsibility") as string;
      return (
        <span className="text-sm">
          {resp === "company" ? "نظام الشركة" : "على مسؤولية مندوب"}
        </span>
      );
    },
  },
  {
    accessorKey: "invoiceDate",
    header: "تاريخ الفاتورة",
    cell: ({ row }) => {
      const date = new Date(row.getValue("invoiceDate"));
      return <span>{date.toLocaleDateString("ar-EG")}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "تاريخ الاستحقاق",
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      if (!dueDate) return <span className="text-muted-foreground">-</span>;

      const date = new Date(dueDate);
      const today = new Date();
      const isOverdue = date < today;

      return (
        <span className={isOverdue ? "text-red-600 font-medium" : ""}>
          {date.toLocaleDateString("ar-EG")}
          {isOverdue && (
            <Badge variant="destructive" className="mr-2">
              متأخر
            </Badge>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "salesRepName",
    header: "المندوب",
    enableGlobalFilter: true,
  },
];

export default function InvoicesPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(
    null
  );

  const handleEdit = (invoice: InvoiceRow) => {
    setSelectedInvoice(invoice);
    setDrawerOpen(true);
  };

  const handleDelete = (invoices: InvoiceRow[]) => {
    console.log("حذف الفواتير:", invoices);
    if (confirm(`هل تريد حقاً حذف ${invoices.length} فاتورة؟`)) {
      toast.success(`تم حذف ${invoices.length} فاتورة`);
    }
  };

  const handleView = (invoice: InvoiceRow) => {
    router.push(`/dashboard/sales/invoices/${invoice.id}/print`);
  };

  const handleAddNew = () => {
    setSelectedInvoice(null);
    setDrawerOpen(true);
  };

  const handleSave = async (invoiceData: Partial<Invoice>) => {
    console.log("حفظ الفاتورة:", invoiceData);
    // هنا يتم إرسال البيانات إلى API
    // await api.saveInvoice(invoiceData);
    toast.success("تم حفظ الفاتورة بنجاح");
  };

  // إحصائيات سريعة
  const stats = {
    total: mockInvoices.length,
    paid: mockInvoices.filter((inv) => inv.paymentStatus === "paid").length,
    unpaid: mockInvoices.filter((inv) => inv.paymentStatus === "unpaid").length,
    totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">إدارة الفواتير</h1>
            <p className="text-muted-foreground">
              إدارة وتتبع جميع فواتير المبيعات
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            إنشاء فاتورة جديدة
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الفواتير
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير مدفوعة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              فواتير غير مدفوعة
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unpaid}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المبالغ
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalAmount.toLocaleString()} ج.م
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الفواتير */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockInvoices}
            searchPlaceholder="ابحث بالفواتير أو العملاء..."
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
                column: "paymentStatus",
                options: ["مدفوع", "جزئي", "غير مدفوع"],
              },
              {
                column: "invoiceType",
                options: ["نقدي", "آجل"],
              },
              {
                column: "responsibility",
                options: ["نظام الشركة", "على مسؤولية مندوب"],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Drawer لإنشاء/تعديل الفاتورة */}
      <InvoiceDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedInvoice(null);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        invoice={selectedInvoice as any}
        onSave={handleSave}
        customers={[]}
        products={[]}
      />
    </div>
  );
}
