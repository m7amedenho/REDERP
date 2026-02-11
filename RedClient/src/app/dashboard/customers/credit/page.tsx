// src/app/customers/credit/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCreditCard, IconPlus } from "@tabler/icons-react";
import { CreditLimit } from "./schema";
import { getCreditLimits, requestCreditLimitIncrease } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة لـ Table العملاء
const columns: ColumnDef<CreditLimit>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "creditLimit",
    header: "السقف الائتماني",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("creditLimit"));
        return <div className="text-left font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "usedCredit",
    header: "المستخدم",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("usedCredit"));
        return <div className="text-left font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "currentBalance",
    header: "الرصيد المتاح",
    cell: ({ row }) => {
        const balance = parseFloat(row.getValue("currentBalance"));
        const color = balance < 0 ? "text-red-600" : "text-green-600";
        return <div className={`text-left font-bold ${color}`}>{balance.toLocaleString()}</div>;
    },
  },
  // الإجراءات
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const credit = row.original;
      const handleRequestIncrease = () => {
        const requestedAmount = prompt("أدخل مبلغ الزيادة المطلوب:");
        if (requestedAmount && !isNaN(parseFloat(requestedAmount))) {
            requestCreditLimitIncrease(credit.customerId, parseFloat(requestedAmount));
        } else if (requestedAmount) {
            alert("يرجى إدخال رقم صحيح.");
        }
      };

      return (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRequestIncrease}
        >
          <IconPlus className="h-4 w-4 ml-2" />
          طلب زيادة
        </Button>
      );
    },
  },
];

// صفحة المكون
export default function CreditManagementPage() {
  const [data, setData] = useState<CreditLimit[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadCreditLimits = async () => {
      const limits = await getCreditLimits();
      setData(limits);
    };

    loadCreditLimits();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">إدارة الائتمان والموافقات (Credit Management)</h1>
      <p className="text-sm text-muted-foreground">السقف الائتماني للعميل + الموافقات.</p>
      
      {/* بطاقة العميل الائتمانية - Card Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconCreditCard className="h-5 w-5 ml-2" />
            بطاقة العميل الائتمانية
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                (هذه البطاقة تعرض تفاصيل السقف الائتماني لعميل واحد مختار من الجدول أدناه)
            </p>
        </CardContent>
      </Card>

      {/* Table العملاء */}
      <DataTable
        columns={columns}
        data={data}
        title="قائمة العملاء والسقف الائتماني"
        searchPlaceholder="ابحث باسم العميل..."
        rtl={true}
        showExport={true}
        showSelection={false}
        showSearch={true}
        showFilters={false}
        // يمكن إضافة زر "صفحة موافقات للمدير" هنا في شريط الأدوات
      />
      
      {/* صفحة موافقات للمدير - Link Placeholder */}
      <p className="text-sm text-muted-foreground">
        **ملاحظة:** صفحة الموافقات للمدير موجودة في مسار منفصل: /dashboard/sales/credit/approvals
      </p>
    </div>
  );
}