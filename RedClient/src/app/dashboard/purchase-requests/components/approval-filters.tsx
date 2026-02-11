/* eslint-disable @typescript-eslint/no-explicit-any */
// components/approval-filters.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconFilter, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface ApprovalFiltersProps {
  onFiltersChange: (filters: any) => void;
}

type Filters = {
  status: string;
  employee: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
  productType: string;
  invoiceNumber: string;
};

export function ApprovalFilters({ onFiltersChange }: ApprovalFiltersProps) {
  const [filters, setFilters] = useState({
    status: "",
    employee: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    productType: "",
    invoiceNumber: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
  const emptyFilters: Filters = {
    status: "",
    employee: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    productType: "",
    invoiceNumber: "",
  };
  setFilters(emptyFilters);
  onFiltersChange(emptyFilters);
};

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="space-y-4">
      {/* شريط الفلترات السريع */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <IconFilter className="h-4 w-4" />
                الفلترات
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">الفلترات المتقدمة</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-auto p-0 text-xs text-red-600"
                    >
                      مسح الكل
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">حالة الطلب</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="بانتظار الاعتماد">بانتظار الاعتماد</SelectItem>
                        <SelectItem value="معتمدة">معتمدة</SelectItem>
                        <SelectItem value="مرفوضة">مرفوضة</SelectItem>
                        <SelectItem value="تحت المراجعة">تحت المراجعة</SelectItem>
                        <SelectItem value="معلقة">معلقة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee">المندوب</Label>
                    <Select
                      value={filters.employee}
                      onValueChange={(value) => handleFilterChange("employee", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع المندوبين" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المندوبين</SelectItem>
                        <SelectItem value="أحمد محمد">أحمد محمد</SelectItem>
                        <SelectItem value="فاطمة علي">فاطمة علي</SelectItem>
                        <SelectItem value="محمد خالد">محمد خالد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">من مبلغ</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minAmount}
                        onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">إلى مبلغ</Label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={filters.maxAmount}
                        onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">من تاريخ</Label>
                      <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange("startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">إلى تاريخ</Label>
                      <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange("endDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType">نوع البضاعة</Label>
                    <Select
                      value={filters.productType}
                      onValueChange={(value) => handleFilterChange("productType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الأنواع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                        <SelectItem value="أثاث">أثاث</SelectItem>
                        <SelectItem value="قرطاسية">قرطاسية</SelectItem>
                        <SelectItem value="مواد بناء">مواد بناء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* بحث برقم الفاتورة */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="ابحث برقم الفاتورة..."
            value={filters.invoiceNumber}
            onChange={(e) => handleFilterChange("invoiceNumber", e.target.value)}
          />
        </div>

        {/* الفلترات النشطة */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value && key !== 'invoiceNumber') {
              return (
                <Badge key={key} variant="secondary" className="gap-1">
                  {value}
                  <button
                    onClick={() => clearFilter(key)}
                    className="hover:text-red-600"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}