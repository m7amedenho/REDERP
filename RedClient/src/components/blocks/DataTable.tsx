/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/blocks/DataTable/index.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  PaginationState,
  FilterFn,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Search,
  Filter,
  Info,
  Edit,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RowAction<TData> = {
  label: string;
  icon: React.ElementType; 
  onClick: (row: TData) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  showExport?: boolean;
  showSelection?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  rtl?: boolean;
  title?: string;
  onEdit?: (row: TData) => void;
  onDelete?: (rows: TData[]) => void;
  onView?: (row: TData) => void;
  rowActions?: RowAction<TData>[];
  filterOptions?: {
    column: string;
    options: string[];
  }[];
}

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  return String(value ?? "")
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "بحث...",
  searchColumn = "email",
  showExport = true,
  showSelection = true,
  showSearch = true,
  showFilters = true,
  rtl = true,
  title,
  onEdit,
  onDelete,
  onView,
  rowActions = [],
  filterOptions = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  // إضافة عمود التحديد إذا كان مطلوبًا
  const tableColumns = showSelection
    ? [
        {
          id: "select",
          header: ({ table }: { table: any }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="تحديد الكل"
            />
          ),
          cell: ({ row }: { row: any }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="تحديد الصف"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : columns;

  // إضافة عمود الإجراءات إذا كانت هناك أي معالجات محددة
  const actionColumn: ColumnDef<TData, TValue> = {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={rtl ? "end" : "start"}>
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            {onView && (
              <DropdownMenuItem onClick={() => onView(record)}>
                <Info className="w-4 h-4 ml-2" />
                التفاصيل
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(record)}>
                <Edit className="w-4 h-4 ml-2" />
                تعديل
              </DropdownMenuItem>
            )}
            {rowActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(record)}
                  className={action.variant === 'destructive' ? "text-red-600 focus:text-red-600" : undefined}
                >
                  <Icon className="w-4 h-4 ml-2" />
                  {action.label}
                </DropdownMenuItem>
              )
            })}
            {(onDelete || rowActions.length > 0) && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete([record])}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="w-4 h-4 ml-2" />
                حذف
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  // إذا كان هناك معالجات، أضف عمود الإجراءات
  const finalColumns =
    onEdit || onDelete || onView || rowActions.length > 0
      ? [...tableColumns, actionColumn]
      : tableColumns;

  const table = useReactTable({
    data,
    columns: finalColumns as ColumnDef<TData, TValue>[],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
  });

  // دالة لتصدير البيانات إلى Excel
  const exportToExcel = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const dataToExport =
      selectedRows.length > 0 ? selectedRows.map((row) => row.original) : data;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "data.xlsx");
  };

  // دالة لحذف الصفوف المحددة
  const handleDeleteSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (onDelete) {
      onDelete(selectedRows);
      setRowSelection({});
    }
  };

  return (
    <div className="w-full" dir={rtl ? "rtl" : "ltr"}>
      {(title || showSearch || showExport || filterOptions.length > 0) && (
        <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
          {title && <h2 className="text-xl font-bold">{title}</h2>}

          <div className="flex items-center gap-2 flex-wrap">
            {showSearch && (
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute top-1/2 transform -translate-y-1/2 right-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pr-8"
                />
              </div>
            )}

            {filterOptions.length > 0 && showFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map((filterOption, index) => (
                  <Select
                    key={index}
                    onValueChange={(value) => {
                      if (value === "all") {
                        table
                          .getColumn(filterOption.column)
                          ?.setFilterValue("");
                      } else {
                        table
                          .getColumn(filterOption.column)
                          ?.setFilterValue(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue
                        placeholder={`تصفية ${filterOption.column}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {filterOption.options.map((option, optIndex) => (
                        <SelectItem key={optIndex} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  تصدير Excel
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    الأعمدة
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={rtl ? "end" : "start"}>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {Object.keys(rowSelection).length > 0 && onDelete && (
        <div className="bg-primary/10 p-3 rounded-md mb-4 flex items-center justify-between">
          <span>{Object.keys(rowSelection).length} عنصر محدد</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            حذف المحدد
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table className="m-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={rtl ? "text-right" : "text-left"}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={rtl ? "text-right" : "text-left"}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4 flex-wrap gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} من{" "}
          {table.getFilteredRowModel().rows.length} صفوف محددة.
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <div className="flex items-center gap-1">
            <span>الصفحة</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} من{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span>عدد الصفوف في الصفحة:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded p-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
