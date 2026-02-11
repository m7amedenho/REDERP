/* eslint-disable @typescript-eslint/no-unused-vars */
// app/purchase-invoices/page.tsx
"use client";

import { DataTable } from "@/components/blocks/DataTable";
import { PurchaseInvoiceForm } from "./purchase-invoice-form";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconTrash, IconPrinter } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export type PurchaseInvoice = {
  id: string;
  invoiceNumber: string;
  employeeName: string;
  totalAmount: number;
  status: "قيد الطلب" | "موافق عليها" | "مرفوضة" | "ملغاة";
  dueDate: string;
  createdAt: string;
  itemsCount: number;
};

// بيانات المثال
const data: PurchaseInvoice[] = [
  {
    id: "1",
    invoiceNumber: "PUR-2024-001",
    employeeName: "أحمد محمد",
    totalAmount: 15000,
    status: "قيد الطلب",
    dueDate: "2024-02-15",
    createdAt: "2024-01-15",
    itemsCount: 5,
  },
  {
    id: "2",
    invoiceNumber: "PUR-2024-002",
    employeeName: "فاطمة علي",
    totalAmount: 8500,
    status: "موافق عليها",
    dueDate: "2024-02-20",
    createdAt: "2024-01-16",
    itemsCount: 3,
  },
  {
    id: "3",
    invoiceNumber: "PUR-2024-003",
    employeeName: "محمد خالد",
    totalAmount: 12000,
    status: "مرفوضة",
    dueDate: "2024-02-25",
    createdAt: "2024-01-17",
    itemsCount: 7,
  },
  {
    id: "4",
    invoiceNumber: "PUR-2024-004",
    employeeName: "سارة عبدالله",
    totalAmount: 9500,
    status: "موافق عليها",
    dueDate: "2024-03-01",
    createdAt: "2024-01-18",
    itemsCount: 4,
  },
  {
    id: "5",
    invoiceNumber: "PUR-2024-005",
    employeeName: "يوسف أحمد",
    totalAmount: 18000,
    status: "قيد الطلب",
    dueDate: "2024-03-05",
    createdAt: "2024-01-19",
    itemsCount: 6,
  },
];

 const handlePrint = (invoice: PurchaseInvoice) => {
    console.log("طباعة الفاتورة:", invoice);
    window.location.href = `/dashboard/purchase-invoice/${invoice.id}/print`;
  };



export const columns: ColumnDef<PurchaseInvoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "رقم الفاتورة",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "employeeName",
    header: "اسم المندوب",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "totalAmount",
    header: "المبلغ الإجمالي",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <span>{amount.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = 
        status === "موافق عليها" ? "default" :
        status === "قيد الطلب" ? "secondary" :
        status === "مرفوضة" ? "destructive" : "outline";
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "تاريخ الاستحقاق",
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
  },
  {
    accessorKey: "itemsCount",
    header: "عدد الأصناف",
    cell: ({ row }) => {
      const count = row.getValue("itemsCount") as number;
      return <span>{count} أصناف</span>;
    },
  },
   {
    accessorKey: "print",
    header: "طباعة",
    cell: ({ row }) => {
      const invoice = row.original;
      return <Button variant={"link"} onClick={() => handlePrint(invoice)}><IconPrinter /></Button>;
    },
  },
];

export default function PurchaseInvoicesPage() {
  const router = useRouter();

  const handleView = (invoice: PurchaseInvoice) => {
    console.log("عرض الفاتورة:", invoice);
    router.push(`/dashboard/purchase-invoice/${invoice.id}`);
  };

 
  const handleDelete = (invoices: PurchaseInvoice[]) => {
    console.log("حذف الفواتير:", invoices);
    if (confirm(`هل تريد حقاً حذف ${invoices.length} فاتورة؟`)) {
      // تنفيذ الحذف
    }
  };

  return (
    <div className="mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">فواتير المشتريات</h1>
        <PurchaseInvoiceForm />
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        title="إدارة فواتير المشتريات"
        searchPlaceholder="ابحث في فواتير المشتريات..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
        onView={handleView}
        onDelete={handleDelete}
        
        filterOptions={[
          {
            column: "status",
            options: ["قيد الطلب", "موافق عليها", "مرفوضة", "ملغاة"],
          },
          {
            column: "employeeName",
            options: ["أحمد محمد", "فاطمة علي", "محمد خالد", "سارة عبدالله", "يوسف أحمد"],
          },
        ]}
      />
    </div>
  );
}