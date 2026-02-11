/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/rep-reports/page.tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RepReport,
  ProductSales,
  DailyActivity,
} from "../rep-debts/types/rep-debts-reports";
import {
  IconTrendingUp,
  IconCash,
  IconUser,
  IconCalendar,
  IconDownload,
  IconEye,
  IconChartBar,
  IconReceipt,
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Image from "next/image";
import { RepReportDialog } from "./components/rep-report-dialog";
import { DatePicker, DateRange } from "@/components/blocks/date-picker";

// بيانات تجريبية
// في صفحة تقارير المندوبين - تحديث البيانات
const mockRepReports: RepReport[] = [
  {
    id: "1",
    repId: "1",
    repName: "رشاد سعيد",
    repImage: "/reps-rashad.png",
    period: "أسبوعي",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    totalSales: 75000,
    totalCollections: 45000,
    totalExpenses: 5000,
    netIncome: 40000,
    newClients: 8,
    visitsCount: 25,
    ordersCount: 18,
    performanceScore: 88,
    debtStatus: {
      initialDebt: 150000,
      currentDebt: 120000,
      collectedAmount: 30000,
    },
    salesByProduct: [
      {
        productId: "1",
        productName: "طماطم 025",
        quantity: 50,
        amount: 25000,
        percentage: 33,
      },
      {
        productId: "2",
        productName: "خيار المنار",
        quantity: 30,
        amount: 15000,
        percentage: 20,
      },
      {
        productId: "3",
        productName: "كوسة زهرة",
        quantity: 40,
        amount: 20000,
        percentage: 27,
      },
      {
        productId: "4",
        productName: "كنتالوب شمس",
        quantity: 20,
        amount: 15000,
        percentage: 20,
      },
    ],
    dailyActivities: [
      {
        date: "2024-01-01",
        sales: 10000,
        collections: 8000,
        visits: 4,
        newClients: 1,
      },
      {
        date: "2024-01-02",
        sales: 12000,
        collections: 6000,
        visits: 5,
        newClients: 2,
      },
      {
        date: "2024-01-03",
        sales: 8000,
        collections: 7000,
        visits: 3,
        newClients: 0,
      },
      {
        date: "2024-01-04",
        sales: 15000,
        collections: 9000,
        visits: 6,
        newClients: 3,
      },
      {
        date: "2024-01-05",
        sales: 11000,
        collections: 8000,
        visits: 4,
        newClients: 1,
      },
      {
        date: "2024-01-06",
        sales: 9000,
        collections: 5000,
        visits: 2,
        newClients: 1,
      },
      {
        date: "2024-01-07",
        sales: 10000,
        collections: 2000,
        visits: 1,
        newClients: 0,
      },
    ],
    customerReviews: [
      {
        id: "1",
        clientName: "مزرعة النصر",
        rating: 5,
        comment: "خدمة ممتازة ومنتج عالي الجودة، المندوب محترف جداً في التعامل",
        date: "2024-01-05",
        type: "إيجابي",
        repResponse: "شكراً لثقتكم، نعمل دائماً على تقديم الأفضل",
      },
      {
        id: "2",
        clientName: "شركة الأهرام",
        rating: 3,
        comment: "التسليم تأخر يومين عن الموعد المتفق عليه",
        date: "2024-01-03",
        type: "سلبي",
      },
      {
        id: "3",
        clientName: "مزرعة الخير",
        rating: 4,
        comment: "اقترح توفير خصومات للكميات الكبيرة",
        date: "2024-01-06",
        type: "مقترح",
        repResponse: "تم رفع المقترح للإدارة وسيتم دراسة الأمر",
      },
    ],
    gifts: [
      {
        id: "1",
        clientName: "مزرعة النصر",
        giftType: "سلة هدايا",
        value: 500,
        date: "2024-01-04",
        reason: "عميل دائم ومميز",
        approved: true,
      },
      {
        id: "2",
        clientName: "جمعية الفلاحين",
        giftType: "خصم خاص",
        value: 1000,
        date: "2024-01-06",
        reason: "كمية شراء كبيرة",
        approved: false,
      },
    ],
    returns: [
      {
        id: "1",
        productName: "أسمدة NPK",
        clientName: "مزرعة السلام",
        quantity: 5,
        amount: 2500,
        date: "2024-01-02",
        reason: "تلف في العبوة",
        status: "معتمد",
      },
      {
        id: "2",
        productName: "بذور قمح",
        clientName: "مزرعة الأمل",
        quantity: 10,
        amount: 3000,
        date: "2024-01-05",
        reason: "عدم المطابقة للمواصفات",
        status: "معلق",
      },
    ],
    problems: [
      {
        id: "1",
        type: "تأخير",
        description: "تأخر في تسليم الطلب لمدة يومين بسبب ظروف النقل",
        clientName: "شركة الأهرام",
        date: "2024-01-03",
        status: "مغلق",
        solution: "تم تقديم خصم 10% وتعويض العميل عن التأخير",
      },
      {
        id: "2",
        type: "جودة",
        description: "شكوى من جودة المنتج وعدم مطابقته للمواصفات",
        clientName: "مزرعة الأمل",
        date: "2024-01-05",
        status: "معلق",
      },
    ],
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function RepReportsPage() {
  const [selectedReport, setSelectedReport] = useState<RepReport | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

const [selectedDate, setSelectedDate] = useState<Date | DateRange | undefined>(undefined);

const handleDateSelect = (date: Date | DateRange | undefined) => {
  setSelectedDate(date);
};


  const handleViewReport = (report: RepReport) => {
    setSelectedReport(report);
    setReportDialogOpen(true);
  };

  const getPerformanceVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    if (score >= 60) return "outline";
    return "destructive";
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const columns: ColumnDef<RepReport>[] = [
    {
      accessorKey: "repName",
      header: "المندوب",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.original.repImage}
            alt={row.original.repName}
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <div>
            <div className="font-medium">{row.original.repName}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.period}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: "الفترة",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("period")}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalSales",
      header: "إجمالي المبيعات",
      cell: ({ row }) => (
        <div className="font-bold text-green-600">
          {Number(row.getValue("totalSales")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "totalCollections",
      header: "إجمالي التحصيل",
      cell: ({ row }) => (
        <div className="text-blue-600 font-semibold">
          {Number(row.getValue("totalCollections")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "netIncome",
      header: "صافي الدخل",
      cell: ({ row }) => (
        <div className="font-bold text-purple-600">
          {Number(row.getValue("netIncome")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "newClients",
      header: "عملاء جدد",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("newClients")}</span>
        </div>
      ),
    },
    {
      accessorKey: "performanceScore",
      header: "مؤشر الأداء",
      cell: ({ row }) => {
        const score = Number(row.getValue("performanceScore"));
        return (
          <Badge
            variant={getPerformanceVariant(score)}
            className={getPerformanceColor(score)}
          >
            {score}%
          </Badge>
        );
      },
    },
  ];

  // إحصائيات سريعة
  const stats = {
    totalSales: mockRepReports.reduce(
      (sum, report) => sum + report.totalSales,
      0
    ),
    totalCollections: mockRepReports.reduce(
      (sum, report) => sum + report.totalCollections,
      0
    ),
    totalNetIncome: mockRepReports.reduce(
      (sum, report) => sum + report.netIncome,
      0
    ),
    totalNewClients: mockRepReports.reduce(
      (sum, report) => sum + report.newClients,
      0
    ),
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* العنوان والفلترات */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تقارير المندوبين</h1>
          <p className="text-muted-foreground mt-2">
            تحليل وتقييم أداء فريق المبيعات
          </p>
        </div>
      </div>

      {/* فلترات التقارير */}
      <div dir="ltr">
       <DatePicker
  mode="range"
  selected={selectedDate}
  onSelect={handleDateSelect}
  label="تاريخ البدء"
  placeholder="اختر تاريخ البدء"
  locale="en"
  dateFormat="dd/MM/yyyy"
  required
/>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المبيعات
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(stats.totalSales / 1000).toFixed(0)}K ج.م
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي التحصيل
            </CardTitle>
            <IconCash className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalCollections / 1000).toFixed(0)}K ج.م
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الدخل</CardTitle>
            <IconReceipt className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(stats.totalNetIncome / 1000).toFixed(0)}K ج.م
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء جدد</CardTitle>
            <IconUser className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNewClients}</div>
          </CardContent>
        </Card>
      </div>

      {/* جدول التقارير */}
      <DataTable
        columns={columns}
        data={mockRepReports}
        title="تقارير أداء المندوبين"
        searchPlaceholder="ابحث باسم المندوب..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
        onView={handleViewReport}
        filterOptions={[
          {
            column: "period",
            options: ["يومي", "أسبوعي", "شهري", "سنوي"],
          },
        ]}
      />

      {/* مودال تفاصيل التقرير */}
      {/* <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تقرير أداء المندوب</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
             
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedReport.repImage}
                    alt={selectedReport.repName}
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedReport.repName}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedReport.period} - من {selectedReport.startDate}{" "}
                      إلى {selectedReport.endDate}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={getPerformanceVariant(
                    selectedReport.performanceScore
                  )}
                  className={getPerformanceColor(
                    selectedReport.performanceScore
                  )}
                >
                  مؤشر الأداء: {selectedReport.performanceScore}%
                </Badge>
              </div>

         
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedReport.totalSales.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المبيعات
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedReport.totalCollections.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي التحصيل
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedReport.netIncome.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">صافي الدخل</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {selectedReport.newClients}
                    </div>
                    <p className="text-sm text-muted-foreground">عملاء جدد</p>
                  </CardContent>
                </Card>
              </div>

            
              <Card>
                <CardHeader>
                  <CardTitle>حالة المديونيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {selectedReport.debtStatus.initialDebt.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        مديونية أولية
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {selectedReport.debtStatus.currentDebt.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        مديونية حالية
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {selectedReport.debtStatus.collectedAmount.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">مبلغ محصل</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

             
              <Card>
                <CardHeader>
                  <CardTitle>توزيع المبيعات حسب المنتج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedReport.salesByProduct}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ productName, percentage }) =>
                              `${productName}: ${percentage}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="amount"
                          >
                            {selectedReport.salesByProduct.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} ج.م`, "المبلغ"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {selectedReport.salesByProduct.map((product, index) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <div>
                              <div className="font-medium">
                                {product.productName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {product.quantity} وحدة
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {product.amount.toLocaleString()} ج.م
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

           
              <Card>
                <CardHeader>
                  <CardTitle>الأنشطة اليومية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedReport.dailyActivities}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#10b981"
                          name="المبيعات"
                        />
                        <Line
                          type="monotone"
                          dataKey="collections"
                          stroke="#3b82f6"
                          name="التحصيل"
                        />
                        <Line
                          type="monotone"
                          dataKey="visits"
                          stroke="#f59e0b"
                          name="الزيارات"
                        />
                        <Line
                          type="monotone"
                          dataKey="newClients"
                          stroke="#8b5cf6"
                          name="عملاء جدد"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
      <RepReportDialog
        report={selectedReport}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </div>
  );
}
