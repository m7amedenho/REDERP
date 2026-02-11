// src/app/customers/leads/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconUserPlus, IconTransfer } from "@tabler/icons-react";
import { Lead } from "./schema";
import { getLeads, convertLeadToCustomer } from "./actions";
import { useEffect, useState } from "react";

// تعريف الأعمدة
const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "phone",
    header: "رقم",
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
    accessorKey: "lastContact",
    header: "آخر تواصل",
  },
  {
    accessorKey: "interestLevel",
    header: "درجة الاهتمام",
    cell: ({ row }) => {
        const level = row.getValue("interestLevel") as string;
        const variant =
            level === "مرتفع"
                ? "default"
                : level === "متوسط"
                ? "secondary"
                : "destructive";

        return <Badge variant={variant}>{level}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
            status === "جديد"
                ? "outline"
                : status === "مُحول لعميل"
                ? "default"
                : "secondary";

        return <Badge variant={variant}>{status}</Badge>;
    },
  },
  // الإجراءات
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const lead = row.original;
      const handleConvert = () => {
        convertLeadToCustomer(lead.id);
        alert(`تم طلب تحويل العميل المحتمل: ${lead.name}`);
      };

      return (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={handleConvert}
            disabled={lead.status === "مُحول لعميل"}
        >
          <IconTransfer className="h-4 w-4 ml-2" />
          تحويل لعميل
        </Button>
      );
    },
  },
];

// صفحة المكون
export default function LeadsPage() {
  const [data, setData] = useState<Lead[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadLeads = async () => {
      const leads = await getLeads();
      setData(leads);
    };

    loadLeads();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        title="عملاء محتملين (Leads)"
        searchPlaceholder="ابحث بالاسم أو الهاتف..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
        // Filter options start here
        // Filters (المنطقة/المندوب/تاريخ الإضافة/الحالة)
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
            options: ["جديد", "تم التواصل", "غير مؤهل", "مُحول لعميل"],
          },
        ]}
      />
    </div>
  );
}