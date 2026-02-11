"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFileDownload,
  IconPrinter,
  IconAlertTriangle,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react";
import {
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

export default function DebtAnalysisReportPage() {
  // Aging Analysis Data
  const agingData = [
    { range: "متأخر 90+ يوم", amount: 45000, customers: 8, color: "#ef4444" },
    {
      range: "متأخر 60-90 يوم",
      amount: 32000,
      customers: 12,
      color: "#f97316",
    },
    {
      range: "متأخر 30-60 يوم",
      amount: 28000,
      customers: 15,
      color: "#f59e0b",
    },
    { range: "متأخر 0-30 يوم", amount: 18000, customers: 20, color: "#eab308" },
    { range: "لم يحل الأجل", amount: 52000, customers: 35, color: "#22c55e" },
  ];

  const topDebtors = [
    {
      name: "شركة النور",
      debt: 45000,
      overdue: 30000,
      creditLimit: 50000,
      daysOverdue: 95,
      risk: "high",
    },
    {
      name: "أحمد محمد",
      debt: 32000,
      overdue: 20000,
      creditLimit: 40000,
      daysOverdue: 75,
      risk: "high",
    },
    {
      name: "محمد علي",
      debt: 28000,
      overdue: 15000,
      creditLimit: 35000,
      daysOverdue: 55,
      risk: "medium",
    },
    {
      name: "سارة أحمد",
      debt: 25000,
      overdue: 10000,
      creditLimit: 30000,
      daysOverdue: 40,
      risk: "medium",
    },
    {
      name: "فاطمة حسن",
      debt: 18000,
      overdue: 5000,
      creditLimit: 25000,
      daysOverdue: 25,
      risk: "low",
    },
  ];

  const collectionTrend = [
    { month: "يناير", collected: 85000, target: 100000 },
    { month: "فبراير", collected: 92000, target: 100000 },
    { month: "مارس", collected: 78000, target: 100000 },
    { month: "أبريل", collected: 95000, target: 100000 },
    { month: "مايو", collected: 88000, target: 100000 },
    { month: "يونيو", collected: 105000, target: 100000 },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <Badge variant="destructive" className="gap-1">
            <IconAlertTriangle className="h-3 w-3" />
            عالي
          </Badge>
        );
      case "medium":
        return <Badge className="bg-orange-500 gap-1">متوسط</Badge>;
      case "low":
        return <Badge className="bg-green-500 gap-1">منخفض</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">تحليل المديونيات</h1>
          <p className="text-muted-foreground mt-1">
            تقرير شامل لمديونيات العملاء وتحليل الأعمار
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المديونيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">175,000 ج.م</div>
            <p className="text-xs text-red-600 mt-1">+5.2% عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متأخرات السداد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">123,000 ج.م</div>
            <p className="text-xs text-muted-foreground mt-1">
              70.3% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد المدينين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90 عميل</div>
            <p className="text-xs text-green-600 mt-1">-3 عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط فترة التحصيل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 يوم</div>
            <p className="text-xs text-red-600 mt-1">+5 أيام عن الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="h-5 w-5" />
              تحليل الأعمار (Aging Analysis)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.range}\n${entry.amount} ج.م`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع المديونيات حسب الفترة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agingData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.range}</span>
                    <span className="font-bold">{item.amount} ج.م</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.amount / 175000) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.customers} عميل
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            اتجاه التحصيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collectionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#22c55e" name="المحصل" />
              <Bar dataKey="target" fill="#94a3b8" name="المستهدف" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Debtors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="h-5 w-5 text-red-500" />
            أكبر المدينين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">#</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">إجمالي الدين</th>
                  <th className="text-right p-3">المتأخر</th>
                  <th className="text-right p-3">الحد الائتماني</th>
                  <th className="text-right p-3">أيام التأخير</th>
                  <th className="text-right p-3">درجة المخاطرة</th>
                  <th className="text-right p-3">الاستخدام</th>
                  <th className="text-right p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {topDebtors.map((debtor, index) => {
                  const utilizationPercent =
                    (debtor.debt / debtor.creditLimit) * 100;
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">{debtor.name}</td>
                      <td className="p-3 font-semibold">
                        {debtor.debt.toLocaleString()} ج.م
                      </td>
                      <td className="p-3 text-red-600 font-medium">
                        {debtor.overdue.toLocaleString()} ج.م
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {debtor.creditLimit.toLocaleString()} ج.م
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {debtor.daysOverdue} يوم
                        </Badge>
                      </td>
                      <td className="p-3">{getRiskBadge(debtor.risk)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2 w-20">
                            <div
                              className={`h-2 rounded-full ${
                                utilizationPercent > 90
                                  ? "bg-red-500"
                                  : utilizationPercent > 70
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(utilizationPercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {utilizationPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          تفاصيل
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <IconAlertTriangle className="h-5 w-5" />
            تنبيهات هامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <IconAlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <p>
                <strong>8 عملاء</strong> لديهم ديون متأخرة أكثر من 90 يوماً
                بإجمالي <strong>45,000 ج.م</strong>
              </p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <IconAlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <p>
                <strong>5 عملاء</strong> تجاوزوا 90% من حد الائتمان الخاص بهم
              </p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <IconAlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p>
                متوسط فترة التحصيل زاد بمقدار <strong>5 أيام</strong> عن الشهر
                الماضي
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
