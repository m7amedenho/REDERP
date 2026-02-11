"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ShoppingCart,
  UserCheck,
  Calendar,
} from "lucide-react";
import Link from "next/link";

// بيانات تجريبية للإحصائيات
const statsData = {
  today: {
    sales: 125750,
    invoices: 45,
    returns: 3,
    netSales: 122250,
  },
  thisWeek: {
    sales: 875430,
    invoices: 312,
    averageInvoice: 2805,
    growth: 12.5,
  },
  thisMonth: {
    sales: 3250000,
    invoices: 1150,
    target: 4000000,
    achievement: 81.25,
  },
  pendingApprovals: 8,
  criticalDebts: 12,
  overdueInvoices: 23,
  lowCreditCustomers: 5,
};

const topProducts = [
  {
    id: "1",
    name: "بذور طماطم هجين F1",
    category: "البذور",
    sales: 125000,
    quantity: 500,
    invoices: 45,
  },
  {
    id: "2",
    name: "مبيد كلوروبيرفوس 48%",
    category: "المبيدات",
    sales: 98500,
    quantity: 320,
    invoices: 38,
  },
  {
    id: "3",
    name: "سماد NPK 20-20-20",
    category: "الأسمدة",
    sales: 76300,
    quantity: 280,
    invoices: 29,
  },
];

const topCustomers = [
  {
    id: "1",
    name: "شركة الزراعة الحديثة",
    type: "company",
    sales: 235000,
    invoices: 12,
    debt: 85000,
  },
  {
    id: "2",
    name: "محمد أحمد الفلاح",
    type: "individual",
    sales: 198500,
    invoices: 28,
    debt: 45000,
  },
  {
    id: "3",
    name: "مؤسسة النخيل الزراعية",
    type: "company",
    sales: 175300,
    invoices: 15,
    debt: 0,
  },
];

const recentInvoices = [
  {
    id: "INV-001",
    customer: "أحمد محمد",
    amount: 12500,
    status: "paid",
    date: "2024-01-15",
  },
  {
    id: "INV-002",
    customer: "شركة الخير",
    amount: 35000,
    status: "partial",
    date: "2024-01-15",
  },
  {
    id: "INV-003",
    customer: "فاطمة السيد",
    amount: 8900,
    status: "unpaid",
    date: "2024-01-14",
  },
];

export default function SalesDashboard() {
  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم المبيعات</h1>
            <p className="text-muted-foreground">
              إدارة شاملة للمبيعات والعملاء
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/sales/pos">
            <Button className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              نقطة بيع
            </Button>
          </Link>
          <Link href="/dashboard/sales/invoices">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              الفواتير
            </Button>
          </Link>
        </div>
      </div>

      {/* الإحصائيات الرئيسية - اليوم */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مبيعات اليوم</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.today.sales.toLocaleString()} ج.م
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />+{statsData.thisWeek.growth}%
              </span>
              عن الأمس
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير اليوم</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.today.invoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط الفاتورة:{" "}
              {(
                statsData.today.sales / statsData.today.invoices
              ).toLocaleString()}{" "}
              ج.م
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرتجعات اليوم</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsData.today.returns}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              نسبة المرتجعات:{" "}
              {(
                (statsData.today.returns / statsData.today.invoices) *
                100
              ).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي المبيعات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsData.today.netSales.toLocaleString()} ج.م
            </div>
            <p className="text-xs text-muted-foreground mt-1">بعد المرتجعات</p>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات الشهر */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مبيعات الشهر</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData.thisMonth.sales.toLocaleString()} ج.م
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>
                  الهدف: {statsData.thisMonth.target.toLocaleString()}
                </span>
                <span>{statsData.thisMonth.achievement.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${statsData.thisMonth.achievement}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              طلبات الموافقة
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsData.pendingApprovals}
            </div>
            <Link href="/dashboard/sales/credit/approvals">
              <Button variant="link" className="p-0 h-auto text-xs mt-1">
                عرض الطلبات
                <ArrowUpRight className="w-3 h-3 mr-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مديونيات حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsData.criticalDebts}
            </div>
            <Link href="/dashboard/sales/reports/debt-report">
              <Button variant="link" className="p-0 h-auto text-xs mt-1">
                عرض التفاصيل
                <ArrowUpRight className="w-3 h-3 mr-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير متأخرة</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statsData.overdueInvoices}
            </div>
            <Link href="/dashboard/sales/invoices?filter=overdue">
              <Button variant="link" className="p-0 h-auto text-xs mt-1">
                المتابعة
                <ArrowUpRight className="w-3 h-3 mr-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* أعلى المنتجات والعملاء */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* أعلى المنتجات مبيعاً */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              أعلى المنتجات مبيعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.category} • {product.quantity} وحدة •{" "}
                        {product.invoices} فاتورة
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {product.sales.toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* أعلى العملاء */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              أعلى العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {customer.name}
                        <Badge variant="outline" className="text-xs">
                          {customer.type === "company" ? "شركة" : "فردي"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.invoices} فاتورة
                        {customer.debt > 0 && (
                          <span className="text-red-600 mr-2">
                            • مديونية: {customer.debt.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {customer.sales.toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* آخر الفواتير */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              آخر الفواتير
            </CardTitle>
            <Link href="/dashboard/sales/invoices">
              <Button variant="outline" size="sm">
                عرض الكل
                <ArrowUpRight className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <Badge variant="outline">{invoice.id}</Badge>
                      <span>{invoice.customer}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold">
                      {invoice.amount.toLocaleString()} ج.م
                    </div>
                  </div>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "partial"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {invoice.status === "paid"
                      ? "مدفوع"
                      : invoice.status === "partial"
                      ? "جزئي"
                      : "غير مدفوع"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* روابط سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>روابط سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/sales/pos">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ShoppingCart className="w-6 h-6" />
                <span>نقطة بيع</span>
              </Button>
            </Link>

            <Link href="/dashboard/sales/customers">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>إدارة العملاء</span>
              </Button>
            </Link>

            <Link href="/dashboard/sales/returns">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Package className="w-6 h-6" />
                <span>المرتجعات</span>
              </Button>
            </Link>

            <Link href="/dashboard/sales/reports">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>التقارير</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
