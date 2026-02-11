// src/app/customers/opening-balance/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCash, IconUpload, IconUserCheck } from "@tabler/icons-react";
import { OpeningBalance } from "./schema";
import { getOpeningBalances } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة
const columns: ColumnDef<OpeningBalance>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "balanceAmount",
    header: "الرصيد",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("balanceAmount"));
        const type = amount >= 0 ? "مدين" : "دائن";
        const color = amount >= 0 ? "text-red-600" : "text-green-600";
        return (
            <div className="flex justify-between items-center text-left font-bold">
                <span className={color}>{Math.abs(amount).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">{type}</span>
            </div>
        );
    },
  },
  {
    accessorKey: "entryDate",
    header: "تاريخ الإدخال",
  },
  {
    accessorKey: "notes",
    header: "ملاحظات",
  },
];

// صفحة المكون
export default function OpeningBalancePage() {
  const [data, setData] = useState<OpeningBalance[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadBalances = async () => {
      const balances = await getOpeningBalances();
      setData(balances);
    };

    loadBalances();
  }, []);


  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">أرصدة العملاء أول المدة (Opening Balance)</h1>
      <p className="text-sm text-muted-foreground">صفحة لإدارة أرصدة العملاء الافتتاحية.</p>
      
      {/* Form و Import */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <IconUserCheck className="h-5 w-5 ml-2" />
                    إضافة/تعديل رصيد أول مدة لعميل
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Form إضافة رصيد أول مدة */}
                <p className="text-sm text-muted-foreground">Form Placeholder: Select Customer, Balance Amount, Entry Date, Notes.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <IconUpload className="h-5 w-5 ml-2" />
                    استيراد Excel
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full">
                    تحميل ملف Excel
                </Button>
            </CardContent>
        </Card>
      </div>

      {/* جدول بسيط */}
      <DataTable
        columns={columns}
        data={data}
        title="قائمة أرصدة أول المدة"
        searchPlaceholder="تصفية حسب العميل..."
        rtl={true}
        showExport={true}
        showSelection={false}
        showSearch={true}
        showFilters={true}
        filterOptions={[
            {
                column: "customerName",
                options: data.map(d => d.customerName),
            }
        ]}
      />
    </div>
  );
}