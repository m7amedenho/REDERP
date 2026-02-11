"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Search,
  QrCode,
  Hash,
  MapPin,
  Clock,
  TrendingUp,
  Package,
  Warehouse,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  BarChart3,
  Target,
  Zap,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

// بيانات تجريبية لنظام التتبع
const trackingData = {
  totalTrackedItems: 1250,
  avgStorageTime: 45, // أيام
  turnoverRate: 3.2,
  trackedPercentage: 78,
  activeTracking: 890,
  stalledItems: 23,
  expiredItems: 5,
  transferRequests: 12,
};

const warehouseLocations = [
  {
    id: "1",
    name: "مخزن البذور الرئيسي",
    location: "الرياض",
    items: 245,
    utilization: 85,
  },
  {
    id: "2",
    name: "مخزن المبيدات",
    location: "جدة",
    items: 180,
    utilization: 64,
  },
  {
    id: "3",
    name: "معرض الأدوات",
    location: "الدمام",
    items: 156,
    utilization: 70,
  },
  {
    id: "4",
    name: "مخزن المرتجعات",
    location: "الرياض",
    items: 45,
    utilization: 15,
  },
];

const trackingAlerts = [
  {
    id: "1",
    type: "stalled",
    item: "مبيد كلوروبيرفوس 48%",
    location: "مخزن المبيدات",
    days: 67,
    priority: "high",
  },
  {
    id: "2",
    type: "expiring",
    item: "بذور الخيار الهجين",
    location: "مخزن البذور الرئيسي",
    expiryDate: "2024-02-15",
    priority: "medium",
  },
  {
    id: "3",
    type: "transfer",
    item: "مضخة رش يدوية 16 لتر",
    fromLocation: "مخزن البذور الرئيسي",
    toLocation: "معرض الأدوات",
    days: 3,
    priority: "low",
  },
];

const performanceMetrics = [
  { label: "معدل دوران المخزون", value: "3.2x", trend: "+0.5", status: "good" },
  { label: "متوسط وقت التخزين", value: "45 يوم", trend: "-3", status: "good" },
  {
    label: "نسبة الأصناف المتعقبة",
    value: "78%",
    trend: "+5%",
    status: "excellent",
  },
  {
    label: "سرعة الاستجابة للطلبات",
    value: "2.1 ساعة",
    trend: "-0.3",
    status: "good",
  },
];

export default function TrackingDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("barcode");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (searchType === "barcode") {
        window.location.href = `/dashboard/inventory/tracking/barcode/${searchQuery}`;
      } else if (searchType === "lot") {
        window.location.href = `/dashboard/inventory/tracking/lot/${searchQuery}`;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">نظام التتبع المتقدم</h1>
            <p className="text-muted-foreground">
              تتبع شامل للمنتجات والأصناف مع تحليلات متقدمة
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/tracking/barcode/generate">
            <Button variant="outline" className="gap-2">
              <QrCode className="w-4 h-4" />
              توليد باركود
            </Button>
          </Link>
          <Link href="/dashboard/inventory/tracking/lot/create">
            <Button className="gap-2">
              <Hash className="w-4 h-4" />
              إنشاء لوط جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* شريط البحث المتقدم */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>البحث المتقدم</Label>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Button
                    variant={searchType === "barcode" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("barcode")}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    باركود
                  </Button>
                  <Button
                    variant={searchType === "lot" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("lot")}
                  >
                    <Hash className="w-4 h-4 mr-1" />
                    لوط
                  </Button>
                </div>
                <Input
                  placeholder={
                    searchType === "barcode"
                      ? "ادخل رمز الباركود..."
                      : "ادخل رقم اللوط..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  بحث
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات التتبع */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الأصناف تحت التتبع
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trackingData.totalTrackedItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              من إجمالي{" "}
              {Math.round(
                trackingData.totalTrackedItems /
                  (trackingData.trackedPercentage / 100)
              ).toLocaleString()}{" "}
              صنف
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
              {trackingData.avgStorageTime} يوم
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">تحسن بنسبة 8%</span> من الشهر
              الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الدوران</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trackingData.turnoverRate}x
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3 من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة التتبع</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trackingData.trackedPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5% من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* التنبيهات والحركات */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* التنبيهات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              تنبيهات التتبع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackingAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {alert.type === "stalled" && (
                      <Clock className="w-4 h-4 text-red-500" />
                    )}
                    {alert.type === "expiring" && (
                      <Calendar className="w-4 h-4 text-orange-500" />
                    )}
                    {alert.type === "transfer" && (
                      <Truck className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="font-medium text-sm">{alert.item}</span>
                  </div>
                  <Badge
                    variant={
                      alert.priority === "high"
                        ? "destructive"
                        : alert.priority === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {alert.priority === "high"
                      ? "عالي"
                      : alert.priority === "medium"
                      ? "متوسط"
                      : "منخفض"}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {alert.type === "stalled" &&
                    `متوقف منذ ${alert.days} يوم في ${alert.location}`}
                  {alert.type === "expiring" &&
                    `ينتهي في ${alert.expiryDate} في ${alert.location}`}
                  {alert.type === "transfer" &&
                    `تحويل من ${alert.fromLocation} إلى ${alert.toLocation}`}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                  <Button size="sm">اتخاذ إجراء</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* خريطة المواقع */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              توزيع الأصناف على المخازن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouseLocations.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Warehouse className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        {warehouse.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {warehouse.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${warehouse.utilization}%` }}
                      />
                    </div>
                    <Badge variant="outline">{warehouse.items} صنف</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مؤشرات الأداء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            مؤشرات أداء التتبع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {metric.label}
                  </span>
                  <Badge
                    variant={
                      metric.status === "excellent"
                        ? "default"
                        : metric.status === "good"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {metric.status === "excellent"
                      ? "ممتاز"
                      : metric.status === "good"
                      ? "جيد"
                      : "مقبول"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    metric.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.trend.startsWith("+") ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.trend} من الشهر الماضي
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تبويبات التتبع التفصيلية */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="barcode">تتبع بالباركود</TabsTrigger>
          <TabsTrigger value="lot">تتبع باللوطات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>حالة التتبع حسب المخزن</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouseLocations.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{warehouse.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              warehouse.utilization >= 80
                                ? "bg-red-500"
                                : warehouse.utilization >= 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${warehouse.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {warehouse.utilization}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع حالات التتبع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">تتبع نشط</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {trackingData.activeTracking} صنف
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">متوقف</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      {trackingData.stalledItems} صنف
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">منتهي الصلاحية</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                      {trackingData.expiredItems} صنف
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="barcode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تتبع بالباركود</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">مسح باركود للتتبع</h3>
                <p className="text-muted-foreground mb-4">
                  استخدم ماسح الباركود أو أدخل الرمز يدوياً للحصول على معلومات
                  مفصلة عن المنتج
                </p>
                <Button>
                  <QrCode className="w-4 h-4 mr-2" />
                  فتح ماسح الباركود
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تتبع باللوطات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Hash className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  تتبع الدفعات واللوطات
                </h3>
                <p className="text-muted-foreground mb-4">
                  تتبع حركة الدفعات واللوطات من الاستلام حتى البيع مع مراقبة
                  الصلاحية
                </p>
                <Button>
                  <Hash className="w-4 h-4 mr-2" />
                  إنشاء لوط جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليلات التتبع المتقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  تحليلات شاملة للتتبع
                </h3>
                <p className="text-muted-foreground mb-4">
                  رسوم بيانية وتقارير مفصلة عن أداء نظام التتبع والكفاءة
                </p>
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  عرض التقارير
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* روابط سريعة للتتبع */}
      <Card>
        <CardHeader>
          <CardTitle>روابط سريعة للتتبع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/inventory/tracking/barcode/generate">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <QrCode className="w-6 h-6" />
                <span>توليد باركود</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/tracking/lot/create">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Hash className="w-6 h-6" />
                <span>إنشاء لوط جديد</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/tracking/timeline/view">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Clock className="w-6 h-6" />
                <span>الخط الزمني</span>
              </Button>
            </Link>

            <Link href="/dashboard/inventory/tracking/reports">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>تقارير التتبع</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
