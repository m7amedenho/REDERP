// components/approval-data-table.tsx
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconEye,
  IconCheck,
  IconX,
  IconEdit,
  IconMessage,
  IconSend,
  IconPrinter,
  IconAlertCircle,
  IconDotsVertical,
} from "@tabler/icons-react";
import { PurchaseRequest, PurchaseRequestStatus } from "../types/approval";

interface ApprovalDataTableProps {
  data: PurchaseRequest[];
  onView: (request: PurchaseRequest) => void;
  onApprove: (requests: PurchaseRequest[]) => void;
  onReject: (requests: PurchaseRequest[]) => void;
  onReturn: (requests: PurchaseRequest[]) => void;
  onAddNote: (request: PurchaseRequest) => void;
  onSendNotification: (request: PurchaseRequest) => void;
  onPrint: (request: PurchaseRequest) => void;
}

export function ApprovalDataTable({
  data,
  onView,
  onApprove,
  onReject,
  onReturn,
  onAddNote,
  onSendNotification,
  onPrint,
}: ApprovalDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<PurchaseRequest[]>([]);

  const getStatusVariant = (status: PurchaseRequestStatus) => {
    switch (status) {
      case "معتمدة":
        return "default";
      case "بانتظار الاعتماد":
        return "secondary";
      case "مرفوضة":
        return "destructive";
      case "تحت المراجعة":
        return "outline";
      case "معلقة":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "شديدة العجلة":
        return "text-red-600 bg-red-50 border-red-200";
      case "عاجلة":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const columns: ColumnDef<PurchaseRequest>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedRows(value ? data : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setSelectedRows((prev) =>
              value
                ? [...prev, row.original]
                : prev.filter((r) => r.id !== row.original.id)
            );
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "invoiceNumber",
      header: "رقم الفاتورة",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">{row.getValue("invoiceNumber")}</span>
          {row.original.urgencyAlert && (
            <IconAlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "employeeName",
      header: "اسم المندوب",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("employeeName")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.employeeDepartment}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الطلب",
    },
    {
      accessorKey: "dueDate",
      header: "تاريخ الاستحقاق",
      cell: ({ row }) => {
        const dueDate = new Date(row.getValue("dueDate"));
        const today = new Date();
        const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        
        return (
          <div>
            <div>{row.getValue("dueDate")}</div>
            {daysDiff <= 3 && (
              <div className="text-xs text-red-600">
                {daysDiff} أيام متبقية
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "المبلغ الإجمالي",
      cell: ({ row }) => (
        <span className="font-semibold">
          {Number(row.getValue("totalAmount")).toLocaleString()} ج.م
        </span>
      ),
    },
    {
      accessorKey: "itemsCount",
      header: "عدد الأصناف",
      cell: ({ row }) => `${row.getValue("itemsCount")} أصناف`,
    },
    {
      accessorKey: "priority",
      header: "الأولوية",
      cell: ({ row }) => (
        <Badge variant="outline" className={getPriorityColor(row.getValue("priority"))}>
          {row.getValue("priority")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(request)}>
                  <IconEye className="h-4 w-4 ml-2" />
                  عرض التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onApprove([request])}>
                  <IconCheck className="h-4 w-4 ml-2" />
                  اعتماد الطلب
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject([request])}>
                  <IconX className="h-4 w-4 ml-2" />
                  رفض الطلب
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReturn([request])}>
                  <IconEdit className="h-4 w-4 ml-2" />
                  طلب تعديل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddNote(request)}>
                  <IconMessage className="h-4 w-4 ml-2" />
                  إضافة ملاحظة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendNotification(request)}>
                  <IconSend className="h-4 w-4 ml-2" />
                  إرسال إشعار
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPrint(request)}>
                  <IconPrinter className="h-4 w-4 ml-2" />
                  طباعة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* الإجراءات الجماعية */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.length} طلب محدد
          </span>
          <Button
            size="sm"
            onClick={() => onApprove(selectedRows)}
            className="gap-2"
          >
            <IconCheck className="h-4 w-4" />
            اعتماد المحدد
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(selectedRows)}
            className="gap-2"
          >
            <IconX className="h-4 w-4" />
            رفض المحدد
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReturn(selectedRows)}
            className="gap-2"
          >
            <IconEdit className="h-4 w-4" />
            ارجاع المحدد
          </Button>
        </div>
      )}

      {/* جدول البيانات */}
      <DataTable
        columns={columns}
        data={data}
        title="طلبات الشراء للاعتماد"
        searchPlaceholder="ابحث في طلبات الشراء..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
        onView={onView}
        onDelete={() => {}} // غير مستخدم في هذه الصفحة
        filterOptions={[
          {
            column: "status",
            options: ["بانتظار الاعتماد", "معتمدة", "مرفوضة", "تحت المراجعة", "معلقة"],
          },
          {
            column: "priority",
            options: ["عادية", "عاجلة", "شديدة العجلة"],
          },
        ]}
      />
    </div>
  );
}