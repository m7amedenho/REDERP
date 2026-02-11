// src/app/customers/followup/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMessageCircle, IconClock } from "@tabler/icons-react";
import { FollowupLog } from "./schema";
import { getFollowupLogs } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة لـ DataTable
const columns: ColumnDef<FollowupLog>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "delegate",
    header: "المندوب",
  },
  {
    accessorKey: "type",
    header: "النوع",
  },
  {
    accessorKey: "notes",
    header: "ملاحظات",
  },
  {
    accessorKey: "logDate",
    header: "تاريخ المتابعة",
  },
  {
    accessorKey: "followupDate",
    header: "موعد المتابعة القادم",
  },
];

// دالة وهمية لـ Timeline item
const TimelineItem = ({ log }: { log: FollowupLog }) => (
    <div className="relative border-r border-gray-200 pr-8">
        <div className="absolute right-0 top-0 h-full w-4 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-blue-500 ring-8 ring-white"></div>
        </div>
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
            <time className="text-xs text-gray-500">{log.logDate}</time>
            <h3 className="text-sm font-semibold text-gray-900 mt-1">متابعة العميل: {log.customerName} - النوع: {log.type}</h3>
            <p className="text-sm text-gray-700 mt-2">{log.notes || "لا توجد ملاحظات."}</p>
            {log.followupDate && (
                <div className="flex items-center text-xs text-blue-600 mt-2">
                    <IconClock className="h-4 w-4 ml-1" />
                    <p>المتابعة القادمة: {log.followupDate}</p>
                </div>
            )}
        </div>
    </div>
);

// صفحة المكون
export default function CustomersFollowupPage() {
  const [data, setData] = useState<FollowupLog[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadLogs = async () => {
      const logs = await getFollowupLogs();
      setData(logs);
    };

    loadLogs();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">متابعة العملاء (Customers Follow-up)</h1>
      <p className="text-sm text-muted-foreground">صفحة سجلات الزيارات والاتصالات.</p>
      
      {/* Form لإضافة متابعة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconMessageCircle className="h-5 w-5 ml-2" />
            تسجيل متابعة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Follow-up Form: (نوع – ملاحظات – موعد المتابعة القادمة) */}
            <p>Form Placeholder: Select Customer, Type, Notes, Next Follow-up Date.</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>سجل المتابعات (Timeline)</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
            {data.map((log) => <TimelineItem key={log.id} log={log} />)}
            {data.length === 0 && <p className="text-center text-muted-foreground">لا توجد سجلات متابعة.</p>}
        </CardContent>
      </Card>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={data}
        title="قائمة سجلات المتابعة (DataTable)"
        searchPlaceholder="ابحث بالعميل أو المندوب..."
        rtl={true}
        showExport={true}
        showSelection={false}
        showSearch={true}
        showFilters={false}
      />
    </div>
  );
}