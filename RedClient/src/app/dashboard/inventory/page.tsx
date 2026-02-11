// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ChartAreaInteractive } from "@/components/blocks/chart-area-interactive";
// import {
//   Boxes,
//   TrendingUp,
//   TrendingDown,
//   AlertTriangle,
//   Package,
//   Warehouse,
//   Truck,
//   Plus,
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity,
//   Calendar,
//   DollarSign,
//   BarChart3,
// } from "lucide-react";
// import Link from "next/link";

// // بيانات تجريبية للإحصائيات
// const statsData = {
//   totalItems: 13450,
//   totalWarehouses: 8,
//   totalValue: 2847500,
//   lowStockItems: 23,
//   expiringItems: 45,
//   monthlyInbound: 1245,
//   monthlyOutbound: 890,
//   monthlyTurnover: 3.2,
// };

// const chartData = [
//   { date: "2024-01", inbound: 1200, outbound: 850 },
//   { date: "2024-02", inbound: 1350, outbound: 920 },
//   { date: "2024-03", inbound: 1100, outbound: 780 },
//   { date: "2024-04", inbound: 1400, outbound: 950 },
//   { date: "2024-05", inbound: 1250, outbound: 880 },
//   { date: "2024-06", inbound: 1245, outbound: 890 },
// ];

// export default function InventoryDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* رأس الصفحة */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Boxes className="w-8 h-8 text-primary" />
//           <div>
//             <h1 className="text-2xl font-bold">نظرة عامة على المخزون</h1>
//             <p className="text-muted-foreground">إدارة وتتبع شامل للمخزون</p>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Link href="/dashboard/inventory/items">
//             <Button className="gap-2">
//               <Plus className="w-4 h-4" />
//               إضافة صنف جديد
//             </Button>
//           </Link>
//           <Link href="/dashboard/inventory/transactions">
//             <Button variant="outline" className="gap-2">
//               <Activity className="w-4 h-4" />
//               حركات جديدة
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* الإحصائيات الرئيسية */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               إجمالي الأصناف
//             </CardTitle>
//             <Package className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {statsData.totalItems.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600 flex items-center gap-1">
//                 <TrendingUp className="w-3 h-3" />
//                 +12.5%
//               </span>
//               من الشهر الماضي
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               المخازن النشطة
//             </CardTitle>
//             <Warehouse className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {statsData.totalWarehouses}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               جميع المخازن تعمل بشكل طبيعي
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               القيمة الإجمالية
//             </CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {statsData.totalValue.toLocaleString()} جنيه
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600 flex items-center gap-1">
//                 <TrendingUp className="w-3 h-3" />
//                 +8.2%
//               </span>
//               من الشهر الماضي
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">معدل الدوران</CardTitle>
//             <BarChart3 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {statsData.monthlyTurnover}x
//             </div>
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600 flex items-center gap-1">
//                 <TrendingUp className="w-3 h-3" />
//                 +0.5%
//               </span>
//               من الشهر الماضي
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* التنبيهات والحركات */}
//       <div className="grid gap-4 lg:grid-cols-2">
//         {/* التنبيهات */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500" />
//               تنبيهات المخزون
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
//               <div className="flex items-center gap-2">
//                 <TrendingDown className="w-4 h-4 text-orange-600" />
//                 <span className="text-sm">أصناف منخفضة المخزون</span>
//               </div>
//               <Badge variant="secondary">{statsData.lowStockItems} صنف</Badge>
//             </div>

//             <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-red-600" />
//                 <span className="text-sm">أصناف قريبة من الانتهاء</span>
//               </div>
//               <Badge variant="destructive">{statsData.expiringItems} صنف</Badge>
//             </div>

//             <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
//               <div className="flex items-center gap-2">
//                 <Truck className="w-4 h-4 text-blue-600" />
//                 <span className="text-sm">طلبات التحويل المعلقة</span>
//               </div>
//               <Badge variant="outline">3 طلبات</Badge>
//             </div>

//             <div className="pt-2">
//               <Link href="/dashboard/inventory/reports/low-stock">
//                 <Button variant="outline" className="w-full">
//                   عرض جميع التنبيهات
//                   <ArrowUpRight className="w-4 h-4 mr-2" />
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>

//         {/* الحركات الشهرية */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Activity className="w-5 h-5 text-blue-500" />
//               حركات المخزون الشهرية
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
//               <div className="flex items-center gap-2">
//                 <ArrowUpRight className="w-4 h-4 text-green-600" />
//                 <span className="text-sm">الوارد الشهري</span>
//               </div>
//               <div className="text-lg font-bold text-green-600">
//                 {statsData.monthlyInbound.toLocaleString()}
//               </div>
//             </div>

//             <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
//               <div className="flex items-center gap-2">
//                 <ArrowDownRight className="w-4 h-4 text-red-600" />
//                 <span className="text-sm">الصادر الشهري</span>
//               </div>
//               <div className="text-lg font-bold text-red-600">
//                 {statsData.monthlyOutbound.toLocaleString()}
//               </div>
//             </div>

//             <div className="pt-2">
//               <Link href="/dashboard/inventory/transactions">
//                 <Button variant="outline" className="w-full">
//                   عرض جميع الحركات
//                   <ArrowUpRight className="w-4 h-4 mr-2" />
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* الرسوم البيانية والتقارير */}
//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
//           <TabsTrigger value="movements">حركات المخزون</TabsTrigger>
//           <TabsTrigger value="performance">أداء المخازن</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>توزيع الأصناف حسب الفئة</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">البذور والشتلات</span>
//                     <Badge variant="outline">45%</Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">المبيدات</span>
//                     <Badge variant="outline">30%</Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">الأدوات الزراعية</span>
//                     <Badge variant="outline">15%</Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">الأخرى</span>
//                     <Badge variant="outline">10%</Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>حالة المخازن</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">مخزن البذور</span>
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                       ممتلئ 85%
//                     </Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">مخزن المبيدات</span>
//                     <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
//                       متوسط 65%
//                     </Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">مخزن الأدوات</span>
//                     <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
//                       منخفض 35%
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="movements" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>حركة الوارد والصادر (6 أشهر)</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ChartAreaInteractive />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="performance" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>أداء المخازن حسب الدوران</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                   <div>
//                     <div className="font-medium">مخزن البذور</div>
//                     <div className="text-sm text-muted-foreground">
//                       أعلى دوران في المخازن
//                     </div>
//                   </div>
//                   <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
//                     4.2x
//                   </Badge>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
//                   <div>
//                     <div className="font-medium">مخزن المبيدات</div>
//                     <div className="text-sm text-muted-foreground">
//                       دوران مستقر
//                     </div>
//                   </div>
//                   <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                     3.8x
//                   </Badge>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
//                   <div>
//                     <div className="font-medium">مخزن الأدوات</div>
//                     <div className="text-sm text-muted-foreground">
//                       يحتاج تحسين
//                     </div>
//                   </div>
//                   <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
//                     2.1x
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* روابط سريعة */}
//       <Card>
//         <CardHeader>
//           <CardTitle>روابط سريعة</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Link href="/dashboard/inventory/items">
//               <Button variant="outline" className="w-full h-16 flex-col gap-2">
//                 <Package className="w-6 h-6" />
//                 <span>إدارة الأصناف</span>
//               </Button>
//             </Link>

//             <Link href="/dashboard/inventory/warehouses">
//               <Button variant="outline" className="w-full h-16 flex-col gap-2">
//                 <Warehouse className="w-6 h-6" />
//                 <span>إدارة المخازن</span>
//               </Button>
//             </Link>

//             <Link href="/dashboard/inventory/transactions">
//               <Button variant="outline" className="w-full h-16 flex-col gap-2">
//                 <Truck className="w-6 h-6" />
//                 <span>الحركات والعمليات</span>
//               </Button>
//             </Link>

//             <Link href="/dashboard/inventory/tracking">
//               <Button variant="outline" className="w-full h-16 flex-col gap-2">
//                 <Activity className="w-6 h-6" />
//                 <span>نظام التتبع</span>
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { PageHeader } from "@/components/inventory/PageHeader";
import { StatCard } from "@/components/inventory/StatCard";

export default function InventoryHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="المخزون"
        subtitle="استلام • تحويلات • صرف للمندوب • جرد • تقارير"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="المخازن" href="/dashboard/inventory/warehouses" hint="إنشاء/تفعيل/مخزن مندوب" />
        <StatCard title="مستند جديد" href="/dashboard/inventory/docs/new" hint="استلام/تحويل/صرف/تسوية" />
        <StatCard title="أرصدة المخزون" href="/dashboard/inventory/stock/onhand" hint="OnHand + فلترة" />
        <StatCard title="جرد المخزون" href="/dashboard/inventory/counts/new" hint="جلسة جرد + Posting" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="باركود Zebra (مندوب)" href="/dashboard/inventory/barcodes/rep-package" hint="Token + ZPL جاهز للطباعة" />
        <StatCard title="التقارير" href="/dashboard/inventory/reports/valuation" hint="Valuation/Expiry/Ledger/RepStock" />
      </div>
    </div>
  );
}
