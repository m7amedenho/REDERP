"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  Printer,
  BarChart3,
  PieChart,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const reportTypes = [
  {
    id: "sales",
    title: "تقرير المبيعات",
    description: "تحليل شامل للمبيعات حسب الفترة والمنتجات والعملاء",
    icon: TrendingUp,
    color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600",
    link: "/dashboard/sales/reports/sales-report",
  },
  {
    id: "customers",
    title: "تقرير العملاء",
    description: "تحليل أداء العملاء ومشترياتهم ومديونياتهم",
    icon: Users,
    color: "bg-green-50 dark:bg-green-950/20 text-green-600",
    link: "/dashboard/sales/reports/customer-report",
  },
  {
    id: "debt",
    title: "تقرير المديونيات",
    description: "متابعة المديونيات والفواتير المتأخرة وتحليل التحصيل",
    icon: DollarSign,
    color: "bg-red-50 dark:bg-red-950/20 text-red-600",
    link: "/dashboard/sales/reports/debt-report",
  },
  {
    id: "returns",
    title: "تقرير المرتجعات",
    description: "تحليل المرتجعات وأسبابها ونسبتها من المبيعات",
    icon: Package,
    color: "bg-orange-50 dark:bg-orange-950/20 text-orange-600",
    link: "/dashboard/sales/reports/returns-report",
  },
];

const quickReports = [
  {
    title: "مبيعات اليوم",
    value: "125,750 ج.م",
    change: "+12.5%",
    icon: Calendar,
  },
  {
    title: "مبيعات الشهر",
    value: "3,250,000 ج.م",
    change: "+8.2%",
    icon: TrendingUp,
  },
  {
    title: "أعلى منتج مبيعاً",
    value: "بذور طماطم",
    change: "500 وحدة",
    icon: Package,
  },
  {
    title: "أعلى عميل",
    value: "شركة الزراعة",
    change: "235,000 ج.م",
    icon: Users,
  },
];

export default function SalesReportsPage() {
  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تقارير المبيعات</h1>
            <p className="text-muted-foreground">
              تقارير تحليلية شاملة للمبيعات والعملاء
            </p>
          </div>
        </div>
      </div>

      {/* ملخص سريع */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickReports.map((report, index) => {
          const IconComponent = report.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* أنواع التقارير */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Link key={report.id} href={report.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{report.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Printer className="w-4 h-4" />
                      طباعة
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      تصدير
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* التقارير المخصصة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            إنشاء تقرير مخصص
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              قريباً - محرر التقارير المخصصة
            </h3>
            <p className="text-muted-foreground mb-4">
              قم بإنشاء تقاريرك الخاصة باختيار الحقول والفلاتر المناسبة
            </p>
            <Button variant="outline" disabled>
              إنشاء تقرير مخصص
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نصائح سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح لاستخدام التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                استخدم فلاتر التاريخ لتحديد الفترة الزمنية المطلوبة للتقرير
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                يمكنك تصدير التقارير بصيغة Excel أو PDF للمشاركة مع الفريق
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>استخدم تقرير المديونيات بشكل دوري لمتابعة المستحقات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>راجع تقرير المرتجعات لتحسين جودة المنتجات والخدمات</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
