"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Hash,
  Package,
  Calendar,
  AlertTriangle,
  MapPin,
  TrendingUp,
  BarChart3,
  CheckCircle,
} from "lucide-react";

// بيانات تجريبية للوط
const lotData = {
  lotNumber: "LOT-2024-001",
  productName: "مبيد كلوروبيرفوس",
  productCode: "PRD-002",
  productionDate: "2024-01-10",
  expiryDate: "2025-01-10",
  totalQuantity: 1000,
  remainingQuantity: 450,
  status: "نشط",
  supplier: "شركة الكيماويات المتحدة",
  distribution: [
    {
      warehouse: "مخزن المبيدات الرئيسي",
      quantity: 300,
      percentage: 67,
      status: "نشط",
    },
    {
      warehouse: "معرض الأدوات",
      quantity: 150,
      percentage: 33,
      status: "نشط",
    },
    {
      warehouse: "مخزن الفرع الشرقي",
      quantity: 0,
      percentage: 0,
      status: "فارغ",
    },
  ],
  movements: [
    {
      id: "1",
      date: "2024-01-15",
      type: "صادر",
      quantity: 200,
      warehouse: "مخزن المبيدات الرئيسي",
      destination: "العميل - مزرعة النخيل",
    },
    {
      id: "2",
      date: "2024-01-12",
      type: "تحويل",
      quantity: 150,
      warehouse: "مخزن المبيدات الرئيسي",
      destination: "معرض الأدوات",
    },
    {
      id: "3",
      date: "2024-01-10",
      type: "وارد",
      quantity: 1000,
      warehouse: "مخزن المبيدات الرئيسي",
      destination: "-",
    },
  ],
  analytics: {
    salesRate: 55,
    daysRemaining: 350,
    averageDaily: 2.14,
    predictedDepletion: "2024-08-15",
  },
};

export default function LotTrackingPage() {
  const params = useParams();
  const lotNumber = params.lot as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [lotNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const usagePercentage = Math.round(
    ((lotData.totalQuantity - lotData.remainingQuantity) /
      lotData.totalQuantity) *
      100
  );

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hash className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تتبع اللوط</h1>
            <p className="text-muted-foreground">{lotData.lotNumber}</p>
          </div>
        </div>
        <Badge
          variant={lotData.status === "نشط" ? "default" : "secondary"}
          className="text-sm px-3 py-1"
        >
          {lotData.status}
        </Badge>
      </div>

      {/* معلومات اللوط */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              معلومات المنتج
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">اسم المنتج:</span>
              <span className="font-medium">{lotData.productName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">كود المنتج:</span>
              <Badge variant="outline">{lotData.productCode}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">رقم اللوط:</span>
              <Badge variant="secondary">{lotData.lotNumber}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">المورد:</span>
              <span className="font-medium">{lotData.supplier}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              تواريخ الصلاحية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">تاريخ الإنتاج:</span>
              <span className="font-medium">{lotData.productionDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">تاريخ الانتهاء:</span>
              <span className="font-medium text-orange-600">
                {lotData.expiryDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">الأيام المتبقية:</span>
              <Badge variant="outline">
                {lotData.analytics.daysRemaining} يوم
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الكميات */}
      <Card>
        <CardHeader>
          <CardTitle>حالة الكميات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {lotData.totalQuantity.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                الكمية الإجمالية
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {lotData.remainingQuantity.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                الكمية المتبقية
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(
                  lotData.totalQuantity - lotData.remainingQuantity
                ).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                الكمية المباعة
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>نسبة الاستخدام</span>
              <span className="font-medium">{usagePercentage}%</span>
            </div>
            <Progress value={usagePercentage} />
          </div>
        </CardContent>
      </Card>

      {/* التبويبات */}
      <Tabs defaultValue="distribution">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution">التوزيع</TabsTrigger>
          <TabsTrigger value="movements">الحركات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع اللوط على المخازن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lotData.distribution.map((dist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{dist.warehouse}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1">
                            <Progress value={dist.percentage} />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {dist.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold">{dist.quantity}</div>
                      <Badge
                        variant={
                          dist.status === "نشط" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {dist.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل حركات اللوط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lotData.movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          movement.type === "وارد"
                            ? "default"
                            : movement.type === "صادر"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {movement.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{movement.warehouse}</div>
                        <div className="text-sm text-muted-foreground">
                          {movement.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{movement.quantity}</div>
                      <div className="text-xs text-muted-foreground">
                        {movement.destination}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  تحليل الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>معدل البيع</span>
                    <span className="font-medium">
                      {lotData.analytics.salesRate}%
                    </span>
                  </div>
                  <Progress value={lotData.analytics.salesRate} />
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      المتوسط اليومي:
                    </span>
                    <span className="font-medium">
                      {lotData.analytics.averageDaily} وحدة/يوم
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      تاريخ النفاذ المتوقع:
                    </span>
                    <span className="font-medium">
                      {lotData.analytics.predictedDepletion}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  التوصيات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">معدل جيد</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    معدل البيع الحالي ضمن المعدل الطبيعي
                  </p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">مراقبة الصلاحية</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    يُنصح بمتابعة تاريخ الانتهاء لتجنب الهدر
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
