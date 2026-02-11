/* eslint-disable @typescript-eslint/no-unused-vars */
// components/rep-report-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepReport } from "@/app/dashboard/rep-debts/types/rep-debts-reports";
import {
  IconTrendingUp,
  IconCash,
  IconUser,
  IconStar,
  IconStarFilled,
  IconGift,
  IconRefresh,
  IconAlertTriangle,
  IconMessage,
  IconChartBar,
  IconReceipt,
  IconThumbUp,
  IconThumbDown,
  IconEdit,
} from "@tabler/icons-react";
import Image from "next/image";
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
} from 'recharts';

interface RepReportDialogProps {
  report: RepReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function RepReportDialog({ report, open, onOpenChange }: RepReportDialogProps) {
  if (!report) return null;

  const getPerformanceVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    if (score >= 60) return "outline";
    return "destructive";
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getReviewIcon = (type: string) => {
    switch (type) {
      case "إيجابي": return <IconThumbUp className="h-4 w-4 text-green-600" />;
      case "سلبي": return <IconThumbDown className="h-4 w-4 text-red-600" />;
      default: return <IconMessage className="h-4 w-4 text-blue-600" />;
    }
  };

  const getReviewColor = (type: string) => {
    switch (type) {
      case "إيجابي": return "text-green-600 bg-green-50 border-green-200";
      case "سلبي": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <IconStarFilled
              key={star}
              className="text-yellow-500"
              size={16}
            />
          ) : (
            <IconStar
              key={star}
              className="text-gray-300"
              size={16}
            />
          )
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            تقرير أداء المندوب - {report.period}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" >
          {/* العمود الأيمن - معلومات المندوب */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة المندوب */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative inline-block mb-4">
                  <Image
                    src={report.repImage || "/api/placeholder/150/150"}
                    alt={report.repName}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                  <Badge 
                    variant={getPerformanceVariant(report.performanceScore)}
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${getPerformanceColor(report.performanceScore)}`}
                  >
                    {report.performanceScore}%
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{report.repName}</h3>
                <p className="text-muted-foreground mb-4">مندوب مبيعات</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الفترة:</span>
                    <span className="font-medium">{report.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">من:</span>
                    <span className="font-medium">{report.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">إلى:</span>
                    <span className="font-medium">{report.endDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات سريعة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">نظرة سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconTrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">المبيعات</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {(report.totalSales / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconCash className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">التحصيل</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {(report.totalCollections / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconUser className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">عملاء جدد</span>
                  </div>
                  <span className="font-bold">{report.newClients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconChartBar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">الزيارات</span>
                  </div>
                  <span className="font-bold">{report.visitsCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* حالة المديونيات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">حالة المديونيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded">
                  <span className="text-sm">أولية</span>
                  <span className="font-bold text-red-600">
                    {(report.debtStatus.initialDebt / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center p-2  rounded">
                  <span className="text-sm">حالية</span>
                  <span className="font-bold text-orange-600">
                    {(report.debtStatus.currentDebt / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded">
                  <span className="text-sm">محصل</span>
                  <span className="font-bold text-green-600">
                    {(report.debtStatus.collectedAmount / 1000).toFixed(0)}K
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* العمود الأيسر - المحتوى الرئيسي */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <IconChartBar className="h-4 w-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <IconStar className="h-4 w-4" />
                  آراء العملاء
                </TabsTrigger>
                <TabsTrigger value="gifts" className="flex items-center gap-2">
                  <IconGift className="h-4 w-4" />
                  الهدايا
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex items-center gap-2">
                  <IconRefresh className="h-4 w-4" />
                  المرتجعات
                </TabsTrigger>
                <TabsTrigger value="problems" className="flex items-center gap-2">
                  <IconAlertTriangle className="h-4 w-4" />
                  المشاكل
                </TabsTrigger>
              </TabsList>

              {/* نظرة عامة */}
              <TabsContent value="overview" className="space-y-6">
                {/* إحصائيات رئيسية */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" dir="rtl">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {(report.totalSales / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {(report.totalCollections / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-muted-foreground">إجمالي التحصيل</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {(report.netIncome / 1000).toFixed(0)}K
                      </div>
                      <p className="text-sm text-muted-foreground">صافي الدخل</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">
                        {report.newClients}
                      </div>
                      <p className="text-sm text-muted-foreground">عملاء جدد</p>
                    </CardContent>
                  </Card>
                </div>

                {/* المبيعات حسب المنتج */}
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المبيعات حسب المنتج</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6"dir="rtl">
                      
                      <div className="space-y-3">
                        {report.salesByProduct.map((product, index) => (
                          <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                              <div>
                                <div className="font-medium">{product.productName}</div>
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

                {/* الأنشطة اليومية */}
                <Card>
                  <CardHeader>
                    <CardTitle>الأنشطة اليومية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={report.dailyActivities}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="#10b981" name="المبيعات" strokeWidth={2} />
                          <Line type="monotone" dataKey="collections" stroke="#3b82f6" name="التحصيل" strokeWidth={2} />
                          <Line type="monotone" dataKey="visits" stroke="#f59e0b" name="الزيارات" strokeWidth={2} />
                          <Line type="monotone" dataKey="newClients" stroke="#8b5cf6" name="عملاء جدد" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* آراء العملاء */}
              <TabsContent value="reviews" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"dir="rtl">
                  {report.customerReviews.map((review) => (
                    <Card key={review.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{review.clientName}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getReviewColor(review.type)}>
                              {getReviewIcon(review.type)}
                              <span className="mr-1">{review.type}</span>
                            </Badge>
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <p className="text-sm mb-3">{review.comment}</p>
                        {review.repResponse && (
                          <div className="p-3 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                              <IconEdit className="h-3 w-3 text-blue-600" />
                              <span className="text-sm font-medium">رد المندوب:</span>
                            </div>
                            <p className="text-sm">{review.repResponse}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* الهدايا */}
              <TabsContent value="gifts" className="space-y-4">
                <div className="overflow-x-auto"dir="rtl">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">العميل</th>
                        <th className="text-center p-3">نوع الهدية</th>
                        <th className="text-center p-3">القيمة</th>
                        <th className="text-center p-3">التاريخ</th>
                        <th className="text-center p-3">السبب</th>
                        <th className="text-center p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.gifts.map((gift) => (
                        <tr key={gift.id} className="border-b">
                          <td className="p-3 font-medium">{gift.clientName}</td>
                          <td className="p-3 text-center">{gift.giftType}</td>
                          <td className="p-3 text-center font-semibold">
                            {gift.value.toLocaleString()} ج.م
                          </td>
                          <td className="p-3 text-center">{gift.date}</td>
                          <td className="p-3 text-center">{gift.reason}</td>
                          <td className="p-3 text-center">
                            <Badge variant={gift.approved ? "default" : "secondary"}>
                              {gift.approved ? "معتمد" : "قيد المراجعة"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* المرتجعات */}
              <TabsContent value="returns" className="space-y-4">
                <div className="overflow-x-auto" dir="rtl">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">المنتج</th>
                        <th className="text-center p-3">العميل</th>
                        <th className="text-center p-3">الكمية</th>
                        <th className="text-center p-3">القيمة</th>
                        <th className="text-center p-3">التاريخ</th>
                        <th className="text-center p-3">السبب</th>
                        <th className="text-center p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.returns.map((returnItem) => (
                        <tr key={returnItem.id} className="border-b">
                          <td className="p-3 font-medium">{returnItem.productName}</td>
                          <td className="p-3 text-center">{returnItem.clientName}</td>
                          <td className="p-3 text-center">{returnItem.quantity}</td>
                          <td className="p-3 text-center font-semibold text-red-600">
                            {returnItem.amount.toLocaleString()} ج.م
                          </td>
                          <td className="p-3 text-center">{returnItem.date}</td>
                          <td className="p-3 text-center">{returnItem.reason}</td>
                          <td className="p-3 text-center">
                            <Badge 
                              variant={
                                returnItem.status === "معتمد" ? "default" :
                                returnItem.status === "مرفوض" ? "destructive" : "secondary"
                              }
                            >
                              {returnItem.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* المشاكل */}
              <TabsContent value="problems" className="space-y-4">
                <div className="grid grid-cols-1 gap-4"dir="rtl">
                  {report.problems.map((problem) => (
                    <Card key={problem.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{problem.clientName}</h4>
                            <p className="text-sm text-muted-foreground">{problem.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                problem.status === "مغلق" ? "default" :
                                problem.status === "معلق" ? "secondary" : "outline"
                              }
                            >
                              {problem.status}
                            </Badge>
                            <Badge variant="outline">{problem.type}</Badge>
                          </div>
                        </div>
                        <p className="text-sm mb-3">{problem.description}</p>
                        {problem.solution && (
                          <div className="bg-green-800 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <IconThumbUp className="h-3 w-3" />
                              <span className="text-sm font-medium">الحل المقدم:</span>
                            </div>
                            <p className="text-sm">{problem.solution}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}