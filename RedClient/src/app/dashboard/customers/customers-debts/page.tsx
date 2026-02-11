// src/app/customers/customers-debts/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { CustomerDebt } from "./schema";
import { getCustomerDebts } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة لـ Table
const columns: ColumnDef<CustomerDebt>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "totalDebt",
    header: "إجمالي المديونية",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalDebt"));
        return <div className="text-left font-bold">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "overdueAmount",
    header: "متأخرات",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("overdueAmount"));
        return <div className="text-left font-medium text-red-600">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "region",
    header: "المنطقة",
  },
  {
    accessorKey: "delegate",
    header: "المندوب",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
            status === "في الموعد"
                ? "default"
                : status === "متأخر جداً"
                ? "destructive"
                : "secondary";

        return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// صفحة المكون
export default function CustomersDebtsPage() {
  const [data, setData] = useState<CustomerDebt[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadDebts = async () => {
      const debts = await getCustomerDebts();
      setData(debts);
    };

    loadDebts();
  }, []);

  const handleViewDetails = (debt: CustomerDebt) => {
    setSelectedDebt(debt);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">مديونيات العملاء (Customers Debts)</h1>
      <p className="text-sm text-muted-foreground">صفحة قوية لإدارة ديون العملاء.</p>
      
      <DataTable
        columns={columns}
        data={data}
        title="قائمة مديونيات العملاء"
        searchPlaceholder="ابحث باسم العميل..."
        rtl={true}
        showExport={true}
        showSelection={false}
        showSearch={true}
        showFilters={true}
        onView={handleViewDetails} // استخدام onView لفتح Drawer
        filterOptions={[
            {
                column: "region",
                options: ["المنطقة أ", "المنطقة ب", "المنطقة ج"],
            },
            {
                column: "delegate",
                options: ["أحمد", "فاطمة"],
            },
            {
                column: "status",
                options: ["في الموعد", "متأخر", "متأخر جداً"],
            },
        ]}
      />

      {/* تفاصيل مديونية العميل (Drawer) */}
      <Drawer open={!!selectedDebt} onOpenChange={(open) => !open && setSelectedDebt(null)}>
        <DrawerContent className="h-[90%]">
          <DrawerHeader>
            <DrawerTitle>تفاصيل مديونية العميل: {selectedDebt?.customerName}</DrawerTitle>
            <DrawerDescription>
                إجمالي المديونية: {selectedDebt?.totalDebt.toLocaleString()} | المتأخرات: {selectedDebt?.overdueAmount.toLocaleString()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">History للمستحقات (Placeholder)</h3>
            <p className="text-sm text-muted-foreground">
                عرض تاريخ الفواتير المستحقة، تواريخ الدفع، وأي تسويات تمت.
            </p>
            {/* هنا يتم وضع محتوى History */}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}