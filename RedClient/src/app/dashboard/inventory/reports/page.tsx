"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartAreaInteractive } from "@/components/blocks/chart-area-interactive";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Warehouse,
  Truck,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  PieChart,
  Activity,
  DollarSign,
  Target,
  Clock,
  FileText,
  Printer,
} from "lucide-react";
import Link from "next/link";

// بيانات تجريبية للتقارير
const reportsData = {
  summary: {
    totalValue: 2847500,
    totalItems: 13450,
    activeWarehouses: 8,
    lowStockItems: 23,
    turnoverRate: 3.2,
    avgStorageTime: 45,
  },
  monthlyTrends: [
    { month: "يناير", inbound: 1200, outbound: 850, value: 245000 },
    { month: "فبراير", inbound: 1350, outbound: 920, value: 268000 },
    { month: "مارس", inbound: 1100, outbound: 780, value: 223000 },
    { month: "أبريل", inbound: 1400, outbound: 950, value: 289000 },
    { month: "مايو", inbound: 1250, outbound: 880, value: 256000 },
    { month: "يونيو", inbound: 1245, outbound: 890, value: 267000 },
  ],
  categoryDistribution: [
    { category: "البذور والشتلات", items: 245, value: 892000, percentage: 31 },
    { category: "المبيدات", items: 180, value: 1245000, percentage: 44 },
    { category: "الأدوات الزراعية", items: 156, value: 456000, percentage: 16 },
    { category: "الأسمدة", items: 89, value: 253000, percentage: 9 },
  ],
  warehousePerformance: [
    {
      warehouse: "مخزن البذور الرئيسي",
      utilization: 85,
      turnover: 4.2,
      efficiency: 92,
    },
    {
      warehouse: "مخزن المبيدات",
      utilization: 64,
      turnover: 3.8,
      efficiency: 87,
    },
    {
      warehouse: "معرض الأدوات",
      utilization: 70,
      turnover: 2.9,
      efficiency: 78,
    },
    {
      warehouse: "مخزن المرتجعات",
      utilization: 15,
      turnover: 1.2,
      efficiency: 45,
    },
  ],
  alerts: [
    {
      type: "low_stock",
      count: 23,
      items: ["بذور الخيار", "مبيد الآفات", "أدوات الري"],
    },
    { type: "expiring", count: 15, items: ["مبيد كلوروبيرفوس", "سماد NPK"] },
    { type: "overstock", count: 8, items: ["خراطيم الري", "مضخات صغيرة"] },
  ],
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تقارير المخزون</h1>
            <p className="text-muted-foreground">
              تحليلات شاملة وتقارير مفصلة لأداء المخزون
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تصدير البيانات
          </Button>
          <Button className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة التقرير
          </Button>
        </div>
      </div>

      {/* فلاتر التقرير */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">الفترة الزمنية</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">شهر واحد</SelectItem>
                  <SelectItem value="3months">3 أشهر</SelectItem>
                  <SelectItem value="6months">6 أشهر</SelectItem>
                  <SelectItem value="1year">سنة كاملة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">المخزن</label>
              <Select
                value={selectedWarehouse}
                onValueChange={setSelectedWarehouse}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المخازن</SelectItem>
                  <SelectItem value="1">مخزن البذور الرئيسي</SelectItem>
                  <SelectItem value="2">مخزن المبيدات</SelectItem>
                  <SelectItem value="3">معرض الأدوات</SelectItem>
                  <SelectItem value="4">مخزن المرتجعات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="gap-2">
              <Filter className="w-4 h-4" />
              تطبيق الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ملخص التقرير */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              القيمة الإجمالية
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportsData.summary.totalValue.toLocaleString()} جنيه
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.5%
              </span>
              من الفترة السابقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الدوران</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportsData.summary.turnoverRate}x
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +0.3
              </span>
              من الفترة السابقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أصناف منخفضة المخزون
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reportsData.summary.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              تحتاج إعادة طلب فوري
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              متوسط وقت التخزين
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportsData.summary.avgStorageTime} يوم
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -3 أيام
              </span>
              من الفترة السابقة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تبويبات التقارير */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="movements">حركات المخزون</TabsTrigger>
          <TabsTrigger value="categories">توزيع الفئات</TabsTrigger>
          <TabsTrigger value="warehouses">أداء المخازن</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>حركة المخزون الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع القيمة حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportsData.categoryDistribution.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.category}</span>
                        <Badge variant="outline">{category.percentage}%</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{category.items} صنف</span>
                        <span>{category.value.toLocaleString()} جنيه</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليل حركات المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportsData.monthlyTrends.map((month, index) => (
                  <div
                    key={month.month}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 text-sm font-medium">
                      {month.month}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-muted-foreground">
                            وارد: {month.inbound}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-muted-foreground">
                            صادر: {month.outbound}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-100 dark:bg-green-950/20 rounded h-2">
                          <div
                            className="bg-green-500 h-2 rounded transition-all duration-300"
                            style={{
                              width: `${
                                (month.inbound /
                                  (month.inbound + month.outbound)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="flex-1 bg-red-100 dark:bg-red-950/20 rounded h-2">
                          <div
                            className="bg-red-500 h-2 rounded transition-all duration-300"
                            style={{
                              width: `${
                                (month.outbound /
                                  (month.inbound + month.outbound)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        {month.value.toLocaleString()} جنيه
                      </div>
                      <div className="text-xs text-muted-foreground">
                        صافي القيمة
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأصناف حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportsData.categoryDistribution.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PieChart className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.items} صنف
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{category.percentage}%</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {category.items}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          عدد الأصناف
                        </div>
                      </div>

                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {category.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          القيمة الإجمالية
                        </div>
                      </div>

                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {category.percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          نسبة التوزيع
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أداء المخازن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportsData.warehousePerformance.map((warehouse) => (
                  <div
                    key={warehouse.warehouse}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Warehouse className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {warehouse.warehouse}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            تحليل الأداء
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          warehouse.efficiency >= 80
                            ? "default"
                            : warehouse.efficiency >= 60
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {warehouse.efficiency >= 80
                          ? "ممتاز"
                          : warehouse.efficiency >= 60
                          ? "جيد"
                          : "يحتاج تحسين"}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>نسبة الاستخدام</span>
                          <span className="font-medium">
                            {warehouse.utilization}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              warehouse.utilization >= 80
                                ? "bg-green-500"
                                : warehouse.utilization >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${warehouse.utilization}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>معدل الدوران</span>
                          <span className="font-medium">
                            {warehouse.turnover}x
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(warehouse.turnover / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الكفاءة العامة</span>
                          <span className="font-medium">
                            {warehouse.efficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              warehouse.efficiency >= 80
                                ? "bg-green-500"
                                : warehouse.efficiency >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${warehouse.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنبيهات المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportsData.alerts.map((alert, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {alert.type === "low_stock" && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        {alert.type === "expiring" && (
                          <Calendar className="w-5 h-5 text-orange-500" />
                        )}
                        {alert.type === "overstock" && (
                          <Package className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <div className="font-medium">
                            {alert.type === "low_stock"
                              ? "أصناف منخفضة المخزون"
                              : alert.type === "expiring"
                              ? "أصناف قريبة من الانتهاء"
                              : "أصناف زائدة في المخزون"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {alert.count} صنف متأثر
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.type === "low_stock"
                            ? "destructive"
                            : alert.type === "expiring"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {alert.type === "low_stock"
                          ? "عاجل"
                          : alert.type === "expiring"
                          ? "متوسط"
                          : "منخفض"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {alert.items.map((item, itemIndex) => (
                        <Badge
                          key={itemIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline">
                        عرض التفاصيل
                      </Button>
                      <Button size="sm">اتخاذ إجراء</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* روابط التقارير المخصصة */}
      <Card>
        <CardHeader>
          <CardTitle>تقارير مخصصة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/inventory/reports/stock-balance">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Package className="w-6 h-6" />
                <span>جرد المخزون</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/reports/stock-movements">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Truck className="w-6 h-6" />
                <span>حركات المخزون</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/reports/low-stock">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>الأصناف المنخفضة</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/reports/expiry">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>الأصناف منتهية الصلاحية</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
