// src/app/customers/guarantees/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconShield, IconPlus } from "@tabler/icons-react";
import { Guarantee } from "./schema";
import { getGuarantees } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة
const columns: ColumnDef<Guarantee>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "type",
    header: "نوع الضمان",
  },
  {
    accessorKey: "documentNumber",
    header: "رقم المستند",
  },
  {
    accessorKey: "value",
    header: "القيمة",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("value"));
        return <div className="text-left font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "تاريخ الاستحقاق",
  },
  {
    accessorKey: "status",
    header: "حالة التحصيل",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
            status === "فعال"
                ? "default"
                : status === "مرتجع"
                ? "destructive"
                : status === "محصل"
                ? "secondary"
                : "outline"; // منتهي

        return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// صفحة المكون
export default function GuaranteesPage() {
  const [data, setData] = useState<Guarantee[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadGuarantees = async () => {
      const guarantees = await getGuarantees();
      setData(guarantees);
    };

    loadGuarantees();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">الضمانات (Guarantees)</h1>
      <p className="text-sm text-muted-foreground">ضمان شيكات – إيصالات أمانة – أوراق.</p>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-lg">
                <IconPlus className="h-5 w-5 ml-2" />
                إضافة ضمان جديد
            </CardTitle>
        </CardHeader>
        <CardContent>
             {/* Form: نوع الضمان – رقم – القيمة – تاريخ الاستحقاق – حالة التحصيل */}
             <p className="text-sm text-muted-foreground">Form Placeholder: Type, Number, Value, Due Date, Status.</p>
        </CardContent>
      </Card>
      
      {/* DataTable */}
      <DataTable
        columns={columns}
        data={data}
        title="قائمة الضمانات"
        searchPlaceholder="ابحث باسم العميل أو رقم المستند..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
      />
    </div>
  );
}