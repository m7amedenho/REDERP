"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  IconShield,
  IconPlus,
  IconSearch,
  IconFilter,
  IconDownload,
} from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Warranty {
  id: string;
  warrantyNumber: string;
  customer: string;
  product: string;
  invoiceNumber: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: "active" | "expired" | "claimed" | "void";
  claimStatus?: "pending" | "approved" | "rejected";
}

export default function WarrantiesPage() {
  const [globalFilter, setGlobalFilter] = useState("");

  // بيانات تجريبية
  const warranties: Warranty[] = [
    {
      id: "1",
      warrantyNumber: "WAR-2024-001",
      customer: "أحمد محمد",
      product: "منتج 1",
      invoiceNumber: "INV-2024-001",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      durationMonths: 12,
      status: "active",
    },
    {
      id: "2",
      warrantyNumber: "WAR-2024-002",
      customer: "محمد علي",
      product: "منتج 2",
      invoiceNumber: "INV-2024-002",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      durationMonths: 12,
      status: "claimed",
      claimStatus: "pending",
    },
    {
      id: "3",
      warrantyNumber: "WAR-2023-045",
      customer: "سارة أحمد",
      product: "منتج 3",
      invoiceNumber: "INV-2023-145",
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      durationMonths: 12,
      status: "expired",
    },
    {
      id: "4",
      warrantyNumber: "WAR-2024-003",
      customer: "فاطمة حسن",
      product: "منتج 4",
      invoiceNumber: "INV-2024-003",
      startDate: "2024-02-10",
      endDate: "2025-08-10",
      durationMonths: 18,
      status: "active",
    },
    {
      id: "5",
      warrantyNumber: "WAR-2024-004",
      customer: "خالد محمود",
      product: "منتج 5",
      invoiceNumber: "INV-2024-004",
      startDate: "2024-01-20",
      endDate: "2025-01-20",
      durationMonths: 12,
      status: "claimed",
      claimStatus: "approved",
    },
  ];

  const columns: ColumnDef<Warranty>[] = [
    {
      accessorKey: "warrantyNumber",
      header: "رقم الضمان",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("warrantyNumber")}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "العميل",
    },
    {
      accessorKey: "product",
      header: "المنتج",
    },
    {
      accessorKey: "invoiceNumber",
      header: "رقم الفاتورة",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.getValue("invoiceNumber")}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "تاريخ البدء",
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return (
          <span className="text-sm">{date.toLocaleDateString("ar-EG")}</span>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "تاريخ الانتهاء",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        const now = new Date();
        const isExpiringSoon =
          date.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000;

        return (
          <span
            className={`text-sm ${
              isExpiringSoon ? "text-orange-600 font-medium" : ""
            }`}
          >
            {date.toLocaleDateString("ar-EG")}
            {isExpiringSoon && status === "active" && (
              <Badge variant="outline" className="mr-2 text-xs">
                قريب الانتهاء
              </Badge>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "durationMonths",
      header: "المدة",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("durationMonths")} شهر</span>
      ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const warranty = row.original;

        let variant: "default" | "secondary" | "destructive" | "outline" =
          "default";
        let text = "";

        switch (status) {
          case "active":
            variant = "default";
            text = "نشط";
            break;
          case "expired":
            variant = "destructive";
            text = "منتهي";
            break;
          case "claimed":
            variant = "secondary";
            text = "تم المطالبة";
            break;
          case "void":
            variant = "outline";
            text = "ملغي";
            break;
        }

        return (
          <div className="flex flex-col gap-1">
            <Badge variant={variant}>{text}</Badge>
            {warranty.claimStatus && (
              <Badge
                variant={
                  warranty.claimStatus === "approved"
                    ? "default"
                    : warranty.claimStatus === "rejected"
                    ? "destructive"
                    : "outline"
                }
                className="text-xs"
              >
                {warranty.claimStatus === "pending"
                  ? "قيد المراجعة"
                  : warranty.claimStatus === "approved"
                  ? "موافق عليها"
                  : "مرفوضة"}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const warranty = row.original;
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              عرض
            </Button>
            {warranty.status === "active" && (
              <Button variant="outline" size="sm">
                مطالبة
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: warranties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // إحصائيات
  const stats = {
    total: warranties.length,
    active: warranties.filter((w) => w.status === "active").length,
    expired: warranties.filter((w) => w.status === "expired").length,
    claimed: warranties.filter((w) => w.status === "claimed").length,
    expiringSoon: warranties.filter((w) => {
      const endDate = new Date(w.endDate);
      const now = new Date();
      const daysLeft =
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 30 && w.status === "active";
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <IconShield className="h-8 w-8" />
            إدارة الضمانات
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة ضمانات المنتجات ومطالبات الضمان
          </p>
        </div>
        <Button className="gap-2">
          <IconPlus className="h-4 w-4" />
          إضافة ضمان جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الضمانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ضمانات نشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              منتهية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.expired}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مطالبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.claimed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              قريبة الانتهاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.expiringSoon}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>جميع الضمانات</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في الضمانات..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pr-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <IconFilter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <IconDownload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-right align-middle font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      لا توجد ضمانات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              عرض {table.getState().pagination.pageIndex + 1} من{" "}
              {table.getPageCount()} صفحة
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
