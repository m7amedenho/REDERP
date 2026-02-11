"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  IconFileDownload,
  IconPrinter,
  IconFilter,
  IconChartBar,
  IconTable,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesDetailedReportPage() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [dateRange, setDateRange] = useState("month");

  // بيانات تجريبية
  const dailySalesData = [
    { date: "01/01", sales: 4000, invoices: 12, customers: 8 },
    { date: "02/01", sales: 3000, invoices: 10, customers: 6 },
    { date: "03/01", sales: 5000, invoices: 15, customers: 11 },
    { date: "04/01", sales: 2780, invoices: 8, customers: 5 },
    { date: "05/01", sales: 1890, invoices: 6, customers: 4 },
    { date: "06/01", sales: 2390, invoices: 9, customers: 7 },
    { date: "07/01", sales: 3490, invoices: 11, customers: 9 },
  ];

  const categoryData = [
    { name: "منتجات زراعية", value: 40, sales: 45000 },
    { name: "أدوات", value: 30, sales: 33750 },
    { name: "معدات", value: 20, sales: 22500 },
    { name: "أخرى", value: 10, sales: 11250 },
  ];

  const topProducts = [
    { name: "منتج 1", quantity: 245, revenue: 36750 },
    { name: "منتج 2", quantity: 198, revenue: 29700 },
    { name: "منتج 3", quantity: 167, revenue: 25050 },
    { name: "منتج 4", quantity: 134, revenue: 20100 },
    { name: "منتج 5", quantity: 112, revenue: 16800 },
  ];

  const salesByRep = [
    { name: "أحمد محمد", sales: 125000, invoices: 45, customers: 23 },
    { name: "محمد علي", sales: 98000, invoices: 38, customers: 19 },
    { name: "سارة أحمد", sales: 87000, invoices: 32, customers: 16 },
    { name: "فاطمة حسن", sales: 76000, invoices: 28, customers: 14 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">تقرير المبيعات التفصيلي</h1>
          <p className="text-muted-foreground mt-1">
            تحليل شامل لأداء المبيعات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <IconFileDownload className="h-4 w-4" />
            تصدير Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <IconPrinter className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            الفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>الفترة الزمنية</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="quarter">هذا الربع</SelectItem>
                  <SelectItem value="year">هذا العام</SelectItem>
                  <SelectItem value="custom">فترة مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>المندوب</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="rep1">أحمد محمد</SelectItem>
                  <SelectItem value="rep2">محمد علي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>العميل</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="c1">عميل 1</SelectItem>
                  <SelectItem value="c2">عميل 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المنتج</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="p1">منتج 1</SelectItem>
                  <SelectItem value="p2">منتج 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع الفاتورة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="credit">آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">تطبيق الفلاتر</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112,500 ج.م</div>
            <p className="text-xs text-green-600 mt-1">
              +12.5% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد الفواتير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-green-600 mt-1">+8.3% عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط الفاتورة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">787 ج.م</div>
            <p className="text-xs text-red-600 mt-1">-2.1% عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-green-600 mt-1">
              +15.2% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === "chart" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("chart")}
          className="gap-2"
        >
          <IconChartBar className="h-4 w-4" />
          المخططات
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="gap-2"
        >
          <IconTable className="h-4 w-4" />
          الجداول
        </Button>
      </div>

      {viewMode === "chart" ? (
        <>
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>مبيعات يومية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    name="المبيعات"
                  />
                  <Line
                    type="monotone"
                    dataKey="invoices"
                    stroke="#82ca9d"
                    name="الفواتير"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>المبيعات حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#8884d8" name="الكمية" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="الإيراد" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Rep */}
          <Card>
            <CardHeader>
              <CardTitle>أداء المندوبين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByRep}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="المبيعات" />
                  <Bar dataKey="invoices" fill="#82ca9d" name="الفواتير" />
                  <Bar dataKey="customers" fill="#ffc658" name="العملاء" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">التاريخ</th>
                    <th className="text-right p-2">رقم الفاتورة</th>
                    <th className="text-right p-2">العميل</th>
                    <th className="text-right p-2">المندوب</th>
                    <th className="text-right p-2">المبلغ</th>
                    <th className="text-right p-2">النوع</th>
                    <th className="text-right p-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        2024-01-{String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="p-2">
                        INV-2024-{String(i + 1).padStart(3, "0")}
                      </td>
                      <td className="p-2">عميل {i + 1}</td>
                      <td className="p-2">مندوب {(i % 3) + 1}</td>
                      <td className="p-2">
                        {(Math.random() * 10000).toFixed(2)} ج.م
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {i % 2 === 0 ? "نقدي" : "آجل"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          مكتمل
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
