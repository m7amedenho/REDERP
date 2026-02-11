"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Package,
  Warehouse,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Truck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  History,
  BarChart3,
  Target,
  Activity,
  Hash,
} from "lucide-react";

// بيانات تجريبية للمنتج المحدد بالباركود
const productData = {
  id: "1",
  barcode: "123456789012",
  name: "مبيد كلوروبيرفوس 48%",
  code: "PEST-001",
  category: "المبيدات",
  currentLocation: {
    warehouseId: "2",
    warehouseName: "مخزن المبيدات",
    section: "القسم A",
    shelf: "الرف 3",
    position: "الصندوق 12",
  },
  status: "في المخزن",
  storageDuration: 23,
  turnoverRate: 2.8,
  lastMovement: {
    date: "2024-01-15",
    time: "14:20",
    type: "صادر",
    quantity: 10,
    user: "فاطمة علي",
  },
  timeline: [
    {
      id: "1",
      date: "2024-01-15",
      time: "14:20",
      type: "صادر",
      fromLocation: "مخزن المبيدات",
      toLocation: "العميل - محمد أحمد",
      quantity: 10,
      unit: "لتر",
      user: "فاطمة علي",
      notes: "بيع للعميل",
    },
    {
      id: "2",
      date: "2024-01-10",
      time: "09:15",
      type: "وارد",
      fromLocation: "المورد - شركة الكيماويات",
      toLocation: "مخزن المبيدات",
      quantity: 50,
      unit: "لتر",
      user: "أحمد محمد",
      notes: "توريد جديد",
    },
    {
      id: "3",
      date: "2023-12-28",
      time: "11:30",
      type: "تحويل",
      fromLocation: "مخزن المرتجعات",
      toLocation: "مخزن المبيدات",
      quantity: 15,
      unit: "لتر",
      user: "سارة أحمد",
      notes: "تحويل من المرتجعات",
    },
  ],
  performance: {
    avgStorageTime: 23,
    totalMovements: 45,
    turnoverRate: 2.8,
    utilizationRate: 78,
  },
  alerts: [
    {
      type: "expiring",
      message: "ينتهي في غضون 15 يوم",
      priority: "medium",
    },
  ],
};

export default function BarcodeTrackingPage() {
  const params = useParams();
  const barcode = params.code as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [barcode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تتبع بالباركود: {barcode}</h1>
            <p className="text-muted-foreground">
              معلومات مفصلة عن المنتج وتتبع حركاته
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            تقرير مفصل
          </Button>
          <Button>
            <History className="w-4 h-4 mr-2" />
            تعديل التتبع
          </Button>
        </div>
      </div>

      {/* معلومات المنتج الأساسية */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              معلومات المنتج
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    اسم المنتج:
                  </span>
                  <span className="font-medium">{productData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    الباركود:
                  </span>
                  <Badge variant="outline">{productData.barcode}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    كود الصنف:
                  </span>
                  <Badge variant="secondary">{productData.code}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {productData.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">الحالة:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {productData.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    مدة التخزين:
                  </span>
                  <span className="font-medium">
                    {productData.storageDuration} يوم
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              الموقع الحالي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {productData.currentLocation.warehouseName}
                </span>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                {productData.currentLocation.section} -{" "}
                {productData.currentLocation.shelf}
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                {productData.currentLocation.position}
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">آخر حركة:</span>
                <span className="font-medium">
                  {productData.lastMovement.date}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">النوع:</span>
                <Badge variant="outline">{productData.lastMovement.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">المستخدم:</span>
                <span className="font-medium">
                  {productData.lastMovement.user}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مؤشرات الأداء */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">معدل الدوران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productData.performance.turnoverRate}x
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              +0.3 من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الحركات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productData.performance.totalMovements}
            </div>
            <div className="text-xs text-muted-foreground">
              حركة منذ الإنشاء
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط التخزين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productData.performance.avgStorageTime} يوم
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingDown className="w-3 h-3" />
              -5 أيام من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              معدل الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productData.performance.utilizationRate}%
            </div>
            <Progress
              value={productData.performance.utilizationRate}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* التنبيهات */}
      {productData.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              تنبيهات المنتج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <Badge
                    variant={
                      alert.priority === "high" ? "destructive" : "secondary"
                    }
                  >
                    {alert.priority === "high" ? "عالي" : "متوسط"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الخط الزمني والتفاصيل */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
          <TabsTrigger value="movements">الحركات التفصيلية</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                الخط الزمني للمنتج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productData.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.type === "وارد"
                            ? "bg-green-500"
                            : event.type === "صادر"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      />
                      {index < productData.timeline.length - 1 && (
                        <div className="w-px h-16 bg-gray-200 dark:bg-gray-700 mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              event.type === "وارد"
                                ? "bg-green-100 text-green-800"
                                : event.type === "صادر"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {event.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.date} - {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {event.user}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {event.quantity} {event.unit}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span>من {event.fromLocation}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span>إلى {event.toLocation}</span>
                        </div>

                        {event.notes && (
                          <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-950/20 p-2 rounded">
                            {event.notes}
                          </div>
                        )}
                      </div>
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
              <CardTitle>سجل الحركات التفصيلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productData.timeline.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          event.type === "وارد"
                            ? "bg-green-500"
                            : event.type === "صادر"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{event.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.date} - {event.time}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        {event.quantity} {event.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>أداء المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>معدل الدوران</span>
                    <span className="font-medium">
                      {productData.performance.turnoverRate}x
                    </span>
                  </div>
                  <Progress value={75} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>معدل الاستخدام</span>
                    <span className="font-medium">
                      {productData.performance.utilizationRate}%
                    </span>
                  </div>
                  <Progress value={productData.performance.utilizationRate} />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إجمالي الحركات:</span>
                    <Badge variant="outline">
                      {productData.performance.totalMovements}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">متوسط وقت التخزين:</span>
                    <Badge variant="outline">
                      {productData.performance.avgStorageTime} يوم
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توصيات التحسين</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">تحسين التخزين</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    يمكن نقل المنتج إلى مخزن ذو حركة أعلى لتحسين الدوران
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">أداء ممتاز</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    معدل الدوران الحالي أفضل من المتوسط بنسبة 15%
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
