/* eslint-disable @typescript-eslint/no-unused-vars */
// components/sales-reps-table.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { SalesRep } from "../types/sales-rep";
import { 
  IconMail, 
  IconCalendar,
  IconTrendingUp,
  IconUsers,
  IconCash,
  IconDotsVertical,
  IconEdit,
  IconEye
} from "@tabler/icons-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

interface SalesRepsTableProps {
  data: SalesRep[];
  onView: (rep: SalesRep) => void;
  onEdit: (rep: SalesRep) => void;
  onPerformance: (rep: SalesRep) => void;
}

export function SalesRepsTable({ 
  data, 
  onView, 
  onEdit, 
//   onPerformance 
}: SalesRepsTableProps) {

  const columns: ColumnDef<SalesRep>[] = [
    {
      accessorKey: "name",
      header: "المندوب",
      cell: ({ row }) => {
        const rep = row.original;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={rep.image}
              alt={rep.name}
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
            <div>
              <div className="font-medium">{rep.name}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <IconMail className="h-3 w-3" />
                {rep.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "المنطقة",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.department}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.position}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = 
          status === "نشط" ? "default" :
          status === "غير نشط" ? "secondary" : "outline";
        
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "rating",
      header: "التقييم",
      cell: ({ row }) => <StarRating rating={row.getValue("rating")} />,
    },
    {
      accessorKey: "totalSales",
      header: "المبيعات",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconTrendingUp className="h-4 w-4 text-green-600" />
          <span className="font-medium">
            {(Number(row.getValue("totalSales")) / 1000).toFixed(1)}K
          </span>
          <span className="text-sm text-muted-foreground">ج.م</span>
        </div>
      ),
    },
    {
      accessorKey: "newClients",
      header: "عملاء جدد",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconUsers className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.getValue("newClients")}</span>
        </div>
      ),
    },
    {
      accessorKey: "collectionRate",
      header: "معدل التحصيل",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCash className="h-4 w-4 text-purple-600" />
          <span className="font-medium">{row.getValue("collectionRate")}%</span>
        </div>
      ),
    },
    {
      accessorKey: "performanceScore",
      header: "مؤشر الأداء",
      cell: ({ row }) => {
        const score = Number(row.getValue("performanceScore"));
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  score >= 80 ? "bg-green-600" :
                  score >= 60 ? "bg-yellow-600" : "bg-red-600"
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium w-8">{score}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "hireDate",
      header: "تاريخ التعيين",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <IconCalendar className="h-3 w-3" />
          {row.getValue("hireDate")}
        </div>
      ),
    },
    {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <div className="flex items-center gap-2">
          
          {/* زر العرض السريع */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(request)}
            className="h-8 w-8 p-0"
          >
            <IconEye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

  return (

    <div className="container">
    <DataTable
      columns={columns}
      data={data}
      title="إدارة المندوبين"
      searchPlaceholder="ابحث في المندوبين..."
      rtl={true}
      showExport={true}
      showSelection={true}
      showSearch={true}
      showFilters={true}
      onView={onView}
      onEdit={onEdit}
    //   onPerformance={onPerformance}
      filterOptions={[
        {
          column: "status",
          options: ["نشط", "غير نشط", "إجازة"],
        },
        {
          column: "department",
          options: ["مبيعات", "تسويق", "خدمة عملاء", "مشتريات"],
        },
      ]}
    />
    </div>
  );
}