"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

// استيراد الأيقونات من Tabler Icons
import {
  IconShoppingCart,
  IconReceipt,
  IconUsers,
  IconPackage,
  IconStack2,
  IconReportAnalytics,
  IconUserPlus,
  IconClipboardList,
  IconCalendarEvent,
  IconBuildingWarehouse,
  IconCreditCard,
  IconScale,
  IconBook,
  IconCash,
  IconCurrencyDollar,
  IconChartHistogram,
  IconListDetails,
  IconArrowsExchange,
  IconGps,
  IconBarcode,
  IconClipboardCheck,
  IconMessageCircle,
  IconTransfer,
  IconShield,
  IconCheckbox,
  IconListCheck,
  IconRecycle,
  IconDevices,
  IconBucket,
  IconAlertTriangle,
  IconBox,
  IconTag,
  IconCoin,
  IconAdjustments,
  IconCalendarStats,
  IconDatabase,
  IconGift,
  IconMapPin,
  IconTruckDelivery,
  IconBuilding,
  IconUserShield,
  IconSettings,
  IconSearch,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconPlus,
  IconFilter,
  IconDownload,
  IconPrinter,
  IconHome,
  IconActivity,


  IconCalculator,
  IconBell,
} from "@tabler/icons-react";

// المكونات
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// بيانات الفواتير (نفس البيانات السابقة)
const invoicesData = [
  {
    id: "INV-001",
    customerName: "شركة النور للتجارة",
    date: "2024-07-10",
    amount: 15000,
    status: "مدفوعة",
    dueDate: "2024-07-20",
    invoiceNumber: "F-2024-001",
  },
  {
    id: "INV-002",
    customerName: "أحمد محمد",
    date: "2024-07-09",
    amount: 5000,
    status: "مدفوعة",
    dueDate: "2024-07-19",
    invoiceNumber: "F-2024-002",
  },
  {
    id: "INV-003",
    customerName: "مشتل الورود",
    date: "2024-07-08",
    amount: 8000,
    status: "متأخرة",
    dueDate: "2024-07-15",
    invoiceNumber: "F-2024-003",
  },
  {
    id: "INV-004",
    customerName: "شركة الأمل للزراعة",
    date: "2024-07-07",
    amount: 25000,
    status: "مدفوعة",
    dueDate: "2024-07-17",
    invoiceNumber: "F-2024-004",
  },
  {
    id: "INV-005",
    customerName: "فاطمة علي",
    date: "2024-07-06",
    amount: 3000,
    status: "مدفوعة",
    dueDate: "2024-07-16",
    invoiceNumber: "F-2024-005",
  },
];

// بيانات المدفوعات (نفس البيانات السابقة)
const paymentsData = [
  {
    id: "PAY-001",
    customerName: "شركة النور للتجارة",
    date: "2024-07-10",
    amount: 15000,
    method: "تحويل بنكي",
    status: "مكتمل",
  },
  {
    id: "PAY-002",
    customerName: "أحمد محمد",
    date: "2024-07-09",
    amount: 5000,
    method: "نقدي",
    status: "مكتمل",
  },
  {
    id: "PAY-003",
    customerName: "مشتل الورود",
    date: "2024-07-08",
    amount: 8000,
    method: "شيك",
    status: "معلق",
  },
];

// تعريف أعمدة جدول الفواتير
const invoiceColumns: ColumnDef<any>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "رقم الفاتورة",
  },
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="font-medium text-green-600">
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مدفوعة"
          ? "default"
          : status === "متأخرة"
          ? "destructive"
          : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "تاريخ الاستحقاق",
  },
];

// تعريف أعمدة جدول المدفوعات
const paymentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "رقم الدفع",
  },
  {
    accessorKey: "customerName",
    header: "العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="font-medium text-green-600">
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "method",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return <Badge variant="outline">{method}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مكتمل" ? "default" : status === "معلق" ? "secondary" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// مكون البطاقة الإحصائية
function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && (
            <span
              className={
                color === "green"
                  ? "text-green-600"
                  : color === "red"
                  ? "text-red-600"
                  : ""
              }
            >
              {" "}
              {trend}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// مكون بطاقة الإجراء السريع
function QuickActionCard({
  title,
  description,
  icon,
  color,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className="p-4 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// مكون قسم الإجراءات السريعة مع الرواقع الحقيقية
function QuickActionsSection() {
  const quickActions = [
    {
      title: "نقطة البيع (POS)",
      description: "بدء عملية بيع جديدة",
      icon: <IconShoppingCart className="h-6 w-6" />,
      color: "#3B82F6", // blue
      href: "/dashboard/sales/pos",
    },
    {
      title: "فواتير المبيعات",
      description: "إنشاء وإدارة الفواتير",
      icon: <IconReceipt className="h-6 w-6" />,
      color: "#10B981", // green
      href: "/dashboard/sales/invoices",
    },
    {
      title: "لوحة العملاء",
      description: "إدارة بيانات العملاء",
      icon: <IconUsers className="h-6 w-6" />,
      color: "#8B5CF6", // purple
      href: "/dashboard/customers/dashboard",
    },
    {
      title: "إدارة الأصناف",
      description: "إدارة المخزون والمنتجات",
      icon: <IconPackage className="h-6 w-6" />,
      color: "#F59E0B", // amber
      href: "/dashboard/inventory/items",
    },
    {
      title: "المخازن",
      description: "مراجعة وتحديث المخازن",
      icon: <IconStack2 className="h-6 w-6" />,
      color: "#EF4444", // red
      href: "/dashboard/inventory/warehouses",
    },
    {
      title: "التقارير",
      description: "عرض التقارير المالية",
      icon: <IconReportAnalytics className="h-6 w-6" />,
      color: "#6366F1", // indigo
      href: "/dashboard/sales/reports",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {quickActions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </div>
  );
}

// مكون قسم التصنيفات الرئيسية مع البيانات الحقيقية
function CategoriesSection() {
  const categories = [
    {
      title: "المخزون",
      items: [
        { title: "نظرة عامة", icon: IconPackage, href: "/dashboard/inventory" },
        { title: "إدارة الأصناف", icon: IconPackage, href: "/dashboard/inventory/items" },
        { title: "المخازن", icon: IconStack2, href: "/dashboard/inventory/warehouses" },
        { title: "تتبع المخزون", icon: IconBox, href: "/dashboard/inventory/tracking" },
        { title: "التحركات", icon: IconListDetails, href: "/dashboard/inventory/transactions" },
        { title: "مستند جديد", icon: IconArrowsExchange, href: "/dashboard/inventory/docs/new" },
        { title: "أرصدة المخزون", icon: IconReportAnalytics, href: "/dashboard/inventory/stock/onhand" },
      ],
    },
    {
      title: "العملاء",
      items: [
        { title: "لوحة العملاء", icon: IconUsers, href: "/dashboard/customers/dashboard" },
        { title: "عملاء محتملين", icon: IconUserPlus, href: "/dashboard/customers/leads" },
        { title: "متابعة العملاء", icon: IconMessageCircle, href: "/dashboard/customers/followup" },
        { title: "تحويل العملاء", icon: IconTransfer, href: "/dashboard/customers/transfer" },
        { title: "الضمانات", icon: IconShield, href: "/dashboard/customers/guarantees" },
        { title: "مديونيات العملاء", icon: IconListDetails, href: "/dashboard/customers/customers-debts" },
      ],
    },
    {
      title: "المبيعات",
      items: [
        { title: "نظرة عامة", icon: IconShoppingCart, href: "/dashboard/sales" },
        { title: "فواتير المبيعات", icon: IconReceipt, href: "/dashboard/sales/invoices" },
        { title: "نقطة البيع", icon: IconDevices, href: "/dashboard/sales/pos" },
        { title: "حجوزات المبيعات", icon: IconCalendarEvent, href: "/dashboard/sales/bookings" },
        { title: "إدارة الطلبات", icon: IconClipboardList, href: "/dashboard/sales/orders/manage" },
        { title: "مرتجعات المبيعات", icon: IconRecycle, href: "/dashboard/sales/returns" },
      ],
    },
    {
      title: "المالية",
      items: [
        { title: "الحسابات العامة", icon: IconCash, href: "/dashboard/accounts" },
        { title: "ميزان المراجعة", icon: IconScale, href: "/dashboard/accounting/trial-balance" },
        { title: "دفتر الاستاذ", icon: IconBook, href: "/dashboard/accounting/general-ledger" },
        { title: "الخزينة والنقدية", icon: IconBuildingWarehouse, href: "/dashboard/wallet" },
        { title: "التحصيلات اليومية", icon: IconCreditCard, href: "/dashboard/finance/daily-collections" },
        { title: "دفتر الشيكات", icon: IconClipboardList, href: "/dashboard/finance/checks-book" },
      ],
    },
    {
      title: "مندوبين المبيعات",
      items: [
        { title: "إدارة المندوبين", icon: IconBucket, href: "/dashboard/sales-reps" },
        { title: "مديونيات المندوبين", icon: IconAlertTriangle, href: "/dashboard/rep-debts" },
        { title: "تقارير المندوبين", icon: IconReportAnalytics, href: "/dashboard/rep-reports" },
      ],
    },
    {
      title: "الإعدادات",
      items: [
        { title: "المستخدمين والصلاحيات", icon: IconUserShield, href: "/dashboard/admin/users" },
        { title: "إدارة الفروع", icon: IconBuilding, href: "/dashboard/admin/org" },
        { title: "الإعدادات", icon: IconSettings, href: "/dashboard/settings" },
        { title: "المستخدمين", icon: IconUsers, href: "/dashboard/admin/users" },
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {category.items.slice(0, 6).map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-3"
                  >
                    <item.icon className="h-4 w-4 ml-2" />
                    <span className="text-right flex-1">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// مكون عرض إحصائيات الرسم البياني
function ChartStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">300K</div>
            <div className="text-sm text-muted-foreground">المبيعات (شهري)</div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">150K</div>
            <div className="text-sm text-muted-foreground">المصروفات (شهري)</div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">96.2%</div>
            <div className="text-sm text-muted-foreground">معدل التحصيل</div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">42</div>
            <div className="text-sm text-muted-foreground">أيام المخزون</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "المبيعات اليوم",
      value: "25,000 ج.م",
      description: "+12% من الأمس",
      icon: <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />,
      trend: "+12%",
      color: "green",
    },
    {
      title: "إجمالي العملاء",
      value: "156",
      description: "+5 عملاء جدد",
      icon: <IconUsers className="h-4 w-4 text-muted-foreground" />,
      trend: "+3.3%",
      color: "green",
    },
    {
      title: "المنتجات في المخزون",
      value: "485",
      description: "12 منتج منخفض",
      icon: <IconPackage className="h-4 w-4 text-muted-foreground" />,
      trend: "-2.1%",
      color: "red",
    },
    {
      title: "الفواتير المتأخرة",
      value: "5",
      description: "45,000 ج.م",
      icon: <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "فاتورة",
      description: "فاتورة جديدة لشركة النور",
      amount: "15,000 ج.م",
      time: "منذ ساعتين",
      status: "مكتمل",
    },
    {
      id: 2,
      type: "دفع",
      description: "تحصيل من أحمد محمد",
      amount: "5,000 ج.م",
      time: "منذ 4 ساعات",
      status: "مكتمل",
    },
    {
      id: 3,
      type: "طلب",
      description: "طلب جديد من مشتل الورود",
      amount: "8,000 ج.م",
      time: "منذ 6 ساعات",
      status: "قيد المعالجة",
    },
    {
      id: 4,
      type: "مخزون",
      description: "تحديث مستوى مخزون البذور",
      amount: "-",
      time: "منذ يوم",
      status: "مكتمل",
    },
  ];

  const topProducts = [
    { name: "بذور طماطم هجين", sales: 150, revenue: "22,500 ج.م" },
    { name: "شتلات زينة", sales: 85, revenue: "8,500 ج.م" },
    { name: "أسمدة NPK", sales: 42, revenue: "12,600 ج.م" },
    { name: "مبيدات حشرية", sales: 38, revenue: "2,850 ج.م" },
    { name: "أكياس زراعية", sales: 25, revenue: "12,500 ج.م" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* العنوان والشريط العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">
            نظرة عامة على أداء متجرك وإحصائيات المبيعات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في الفواتير، العملاء، المنتجات..."
              className="pl-3 pr-10 w-full md:w-64"
            />
          </div>
          <Button variant="outline">
            <IconFilter className="h-4 w-4 ml-2" />
            فلتر
          </Button>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div>
        <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
        <QuickActionsSection />
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            trend={stat.trend}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <IconHome className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4" />
            المبيعات
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <IconPackage className="h-4 w-4" />
            المخزون
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4" />
            المالية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* إحصائيات الرسم البياني */}
          <div>
            <h2 className="text-xl font-bold mb-4">إحصائيات المبيعات</h2>
            <Card>
              <CardHeader>
                <CardTitle>أداء المبيعات</CardTitle>
                <CardDescription>آخر 30 يوم - 10/06/2024 إلى 10/07/2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartStats />
                <div className="mt-6">
                  <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                    <div className="text-center">
                      <IconChartHistogram className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>رسم بياني تفاعلي للمبيعات</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الأقسام الرئيسية */}
          <div>
            <h2 className="text-xl font-bold mb-4">التصنيفات الرئيسية</h2>
            <CategoriesSection />
          </div>

          {/* أحدث الفواتير والمدفوعات */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>أحدث الفواتير</CardTitle>
                <CardDescription>آخر 5 فواتير</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={invoiceColumns}
                  data={invoicesData.slice(0, 5)}
                  searchPlaceholder="ابحث في الفواتير..."
                  rtl={true}
                  showExport={false}
                  showSelection={false}
                  showSearch={false}
                  showFilters={false}
                />
                <Link href="/dashboard/sales/invoices">
                  <Button variant="outline" className="w-full mt-4">
                    عرض جميع الفواتير
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أحدث المدفوعات</CardTitle>
                <CardDescription>آخر 5 مدفوعات</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={paymentColumns}
                  data={paymentsData}
                  searchPlaceholder="ابحث في المدفوعات..."
                  rtl={true}
                  showExport={false}
                  showSelection={false}
                  showSearch={false}
                  showFilters={false}
                />
                <Link href="/dashboard/finance/daily-collections">
                  <Button variant="outline" className="w-full mt-4">
                    عرض جميع المدفوعات
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* النشاطات الحديثة والمنتجات الأكثر مبيعاً */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>آخر النشاطات</CardTitle>
                <CardDescription>آخر التحديثات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === "فاتورة" && (
                            <IconReceipt className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === "دفع" && (
                            <IconCreditCard className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === "طلب" && (
                            <IconClipboardList className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === "مخزون" && (
                            <IconPackage className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{activity.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{activity.amount}</div>
                        <Badge
                          variant={
                            activity.status === "مكتمل"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
                <CardDescription>خلال الشهر الحالي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <IconPackage className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.sales} عملية بيع
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {product.revenue}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          الإيرادات
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إدارة الفواتير</CardTitle>
                    <CardDescription>الفواتير من 10/06/2024 إلى 10/07/2024</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <IconDownload className="h-4 w-4 ml-2" />
                      تصدير
                    </Button>
                    <Link href="/dashboard/sales/invoices">
                      <Button>
                        <IconPlus className="h-4 w-4 ml-2" />
                        فاتورة جديدة
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={invoiceColumns}
                  data={invoicesData}
                  searchPlaceholder="ابحث في الفواتير..."
                  rtl={true}
                  showExport={true}
                  showSelection={true}
                  showSearch={true}
                  showFilters={true}
                  filterOptions={[
                    {
                      column: "status",
                      options: ["مدفوعة", "متأخرة"],
                    },
                  ]}
                />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>فواتير متأخرة عن الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoicesData
                      .filter((inv) => inv.status === "متأخرة")
                      .map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 border border-red-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{invoice.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.invoiceNumber}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">
                              {invoice.amount.toLocaleString()} ج.م
                            </div>
                            <div className="text-sm text-red-600">
                              متأخرة
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>قائمة الدخل (الربح والخسارة)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">الإيرادات</span>
                        <span className="font-medium text-green-600">
                          300,000 ج.م
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1">
                        <div className="h-full bg-green-500 rounded-full w-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">المصروفات</span>
                        <span className="font-medium text-red-600">
                          150,000 ج.م
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1">
                        <div className="h-full bg-red-500 rounded-full w-1/2" />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="font-bold">صافي الربح</span>
                        <span className="font-bold text-green-600">
                          150,000 ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>التقارير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/sales/reports">
                      <Button variant="outline" className="w-full justify-start">
                        <IconReceipt className="h-4 w-4 ml-2" />
                        تقرير المبيعات اليومية
                      </Button>
                    </Link>
                    <Link href="/dashboard/sales/bookings">
                      <Button variant="outline" className="w-full justify-start">
                        <IconTrendingUp className="h-4 w-4 ml-2" />
                        تقرير أداء المنتجات
                      </Button>
                    </Link>
                    <Link href="/dashboard/customers/reports">
                      <Button variant="outline" className="w-full justify-start">
                        <IconUsers className="h-4 w-4 ml-2" />
                        تقرير عملاء
                      </Button>
                    </Link>
                    <Link href="/dashboard/sales/reports">
                      <Button variant="outline" className="w-full justify-start">
                        <IconCalendarEvent className="h-4 w-4 ml-2" />
                        تقرير شهري
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>المنتجات والخدمات</CardTitle>
                    <CardDescription>إدارة كتالوج المنتجات</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <IconDownload className="h-4 w-4 ml-2" />
                      تصدير المخزون
                    </Button>
                    <Link href="/dashboard/inventory/items">
                      <Button>
                        <IconPlus className="h-4 w-4 ml-2" />
                        منتج جديد
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  جدول إدارة المنتجات
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>المخزون المنخفض</CardTitle>
                  <CardDescription>يحتاج إعادة طلب</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "أكياس زراعية", current: 8, min: 10 },
                      { name: "مبيدات حشرية", current: 45, min: 50 },
                      { name: "أسمدة سائلة", current: 12, min: 15 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            الحد الأدنى: {item.min}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-yellow-600">
                            {item.current} وحدة
                          </div>
                          <div className="text-sm text-yellow-600">
                            منخفض
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المخزون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/inventory/warehouses">
                      <Button variant="outline" className="w-full justify-start">
                        <IconStack2 className="h-4 w-4 ml-2" />
                        إدارة المستودعات
                      </Button>
                    </Link>
                    <Link href="/dashboard/inventory/counts/new">
                      <Button variant="outline" className="w-full justify-start">
                        <IconClipboardCheck className="h-4 w-4 ml-2" />
                        جرد المخزون
                      </Button>
                    </Link>
                    <Link href="/dashboard/inventory/transactions">
                      <Button variant="outline" className="w-full justify-start">
                        <IconTruckDelivery className="h-4 w-4 ml-2" />
                        حركات المخزون
                      </Button>
                    </Link>
                    <Link href="/dashboard/inventory">
                      <Button variant="outline" className="w-full justify-start">
                        <IconSettings className="h-4 w-4 ml-2" />
                        إعدادات المنتجات
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="السيولة النقدية"
                value="125,000 ج.م"
                description="في الحسابات البنكية"
                icon={<IconCreditCard className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="المستحقات"
                value="45,000 ج.م"
                description="من العملاء"
                icon={<IconReceipt className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="المصروفات الشهرية"
                value="75,000 ج.م"
                description="تشغيلية"
                icon={<IconTrendingDown className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="صافي الربح"
                value="150,000 ج.م"
                description="هذا الشهر"
                icon={<IconTrendingUp className="h-4 w-4 text-muted-foreground" />}
                color="green"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>الحسابات العامة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/accounts">
                      <Button variant="outline" className="w-full justify-start">
                        <IconCalculator className="h-4 w-4 ml-2" />
                        الحسابات العامة
                      </Button>
                    </Link>
                    <Link href="/dashboard/accounting/trial-balance">
                      <Button variant="outline" className="w-full justify-start">
                        <IconScale className="h-4 w-4 ml-2" />
                        ميزان المراجعة
                      </Button>
                    </Link>
                    <Link href="/dashboard/accounting/general-ledger">
                      <Button variant="outline" className="w-full justify-start">
                        <IconBook className="h-4 w-4 ml-2" />
                        دفتر الاستاذ
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الخزينة والنقدية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/wallet">
                      <Button variant="outline" className="w-full justify-start">
                        <IconBuildingWarehouse className="h-4 w-4 ml-2" />
                        الخزن
                      </Button>
                    </Link>
                    <Link href="/dashboard/finance/daily-collections">
                      <Button variant="outline" className="w-full justify-start">
                        <IconCreditCard className="h-4 w-4 ml-2" />
                        التحصيلات اليومية
                      </Button>
                    </Link>
                    <Link href="/dashboard/finance/checks-book">
                      <Button variant="outline" className="w-full justify-start">
                        <IconClipboardList className="h-4 w-4 ml-2" />
                        دفتر الشيكات
                      </Button>
                    </Link>
                    <Link href="/dashboard/finance/operational-expenses">
                      <Button variant="outline" className="w-full justify-start">
                        <IconReceipt className="h-4 w-4 ml-2" />
                        المصروفات التشغيلية
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* قسم الأسئلة الشائعة */}
      <Card>
        <CardHeader>
          <CardTitle>هل لديك سؤال؟</CardTitle>
          <CardDescription>الأسئلة الشائعة والدعم الفني</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/settings">
              <Button variant="outline" className="flex flex-col h-auto py-4 w-full">
                <IconSettings className="h-6 w-6 mb-2" />
                <span>دليل المستخدم</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="flex flex-col h-auto py-4 w-full">
                <IconUserShield className="h-6 w-6 mb-2" />
                <span>الدعم الفني</span>
              </Button>
            </Link>
            <Link href="/dashboard/sales/reports">
              <Button variant="outline" className="flex flex-col h-auto py-4 w-full">
                <IconReportAnalytics className="h-6 w-6 mb-2" />
                <span>تقارير توضيحية</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="flex flex-col h-auto py-4 w-full">
                <IconBell className="h-6 w-6 mb-2" />
                <span>التحديثات والأخبار</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}