"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Plus,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  QrCode,
  Send,
  Receipt,
  Shield,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات للخزنة/المحفظة
interface WalletBalance {
  id: string;
  type: "نقدي" | "بنكي" | "إلكتروني" | "استثماري";
  name: string;
  balance: number;
  currency: "EGP" | "USD" | "EUR";
  lastTransaction: string;
  status: "نشط" | "معلق" | "مغلق";
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: "إيداع" | "سحب" | "تحويل" | "دفع" | "قبض";
  amount: number;
  currency: string;
  fromTo: string;
  description: string;
  paymentMethod: "نقدي" | "بطاقة" | "تحويل بنكي" | "محفظة إلكترونية";
  status: "مكتمل" | "معلق" | "ملغي" | "فاشل";
  reference: string;
}

interface BankTransfer {
  id: string;
  date: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  status: "مكتمل" | "قيد التنفيذ" | "مرفوض";
  reference: string;
}

// بيانات ثابتة
const walletBalances: WalletBalance[] = [
  {
    id: "1",
    type: "نقدي",
    name: "الخزنة الرئيسية",
    balance: 150000,
    currency: "EGP",
    lastTransaction: "2024-01-18",
    status: "نشط",
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    id: "2",
    type: "بنكي",
    name: "البنك الأهلي - الحساب الجاري",
    balance: 750000,
    currency: "EGP",
    lastTransaction: "2024-01-18",
    status: "نشط",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "3",
    type: "بنكي",
    name: "QNB - حساب التوفير",
    balance: 1200000,
    currency: "EGP",
    lastTransaction: "2024-01-17",
    status: "نشط",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "4",
    type: "إلكتروني",
    name: "فودافون كاش",
    balance: 50000,
    currency: "EGP",
    lastTransaction: "2024-01-18",
    status: "نشط",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    id: "5",
    type: "إلكتروني",
    name: "محفظة أورانج",
    balance: 25000,
    currency: "EGP",
    lastTransaction: "2024-01-17",
    status: "نشط",
    icon: <Wallet className="h-5 w-5" />,
  },
];

const transactionsData: Transaction[] = [
  {
    id: "1",
    date: "2024-01-18",
    time: "10:30",
    type: "إيداع",
    amount: 50000,
    currency: "EGP",
    fromTo: "عميل - أحمد محمد",
    description: "دفعة مشروع زراعي",
    paymentMethod: "نقدي",
    status: "مكتمل",
    reference: "TRX-001234",
  },
  {
    id: "2",
    date: "2024-01-18",
    time: "09:15",
    type: "سحب",
    amount: 20000,
    currency: "EGP",
    fromTo: "بنك الأهلي",
    description: "سحب نقدي للمصروفات",
    paymentMethod: "بطاقة",
    status: "مكتمل",
    reference: "TRX-001233",
  },
  {
    id: "3",
    date: "2024-01-17",
    time: "14:45",
    type: "تحويل",
    amount: 15000,
    currency: "EGP",
    fromTo: "محفظة فودافون كاش",
    description: "تحويل لمورد البذور",
    paymentMethod: "محفظة إلكترونية",
    status: "مكتمل",
    reference: "TRX-001232",
  },
  {
    id: "4",
    date: "2024-01-17",
    time: "11:20",
    type: "دفع",
    amount: 30000,
    currency: "EGP",
    fromTo: "شركة الأسمدة المتحدة",
    description: "فاتورة أسمدة",
    paymentMethod: "تحويل بنكي",
    status: "مكتمل",
    reference: "TRX-001231",
  },
  {
    id: "5",
    date: "2024-01-16",
    time: "16:10",
    type: "قبض",
    amount: 45000,
    currency: "EGP",
    fromTo: "مزرعة النخيل",
    description: "دفعة محصول القمح",
    paymentMethod: "نقدي",
    status: "مكتمل",
    reference: "TRX-001230",
  },
];

const bankTransfersData: BankTransfer[] = [
  {
    id: "1",
    date: "2024-01-18",
    bankName: "البنك الأهلي المصري",
    accountNumber: "1234567890",
    accountName: "الشركة الزراعية الحديثة",
    amount: 50000,
    status: "مكتمل",
    reference: "BTR-001",
  },
  {
    id: "2",
    date: "2024-01-17",
    bankName: "بنك QNB الأهلي",
    accountNumber: "0987654321",
    accountName: "مورد البذور الدولي",
    amount: 30000,
    status: "مكتمل",
    reference: "BTR-002",
  },
  {
    id: "3",
    date: "2024-01-16",
    bankName: "بنك مصر",
    accountNumber: "1122334455",
    accountName: "شركة المبيدات الزراعية",
    amount: 25000,
    status: "قيد التنفيذ",
    reference: "BTR-003",
  },
];

// تعريف أعمدة جدول المعاملات
const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "التاريخ",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <div>{row.original.date}</div>
          <div className="text-xs text-muted-foreground">{row.original.time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "النوع",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isPositive = ["إيداع", "قبض"].includes(type);
      return (
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${isPositive ? "bg-green-100" : "bg-red-100"}`}>
            {isPositive ? (
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            )}
          </div>
          <Badge variant={isPositive ? "default" : "destructive"}>
            {type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const isPositive = ["إيداع", "قبض"].includes(row.original.type);
      return (
        <div className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : "-"} {amount.toLocaleString()} {row.original.currency}
        </div>
      );
    },
  },
  {
    accessorKey: "fromTo",
    header: "من / إلى",
  },
  {
    accessorKey: "description",
    header: "الوصف",
  },
  {
    accessorKey: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <Badge variant="outline">{method}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = 
        status === "مكتمل" ? "default" :
        status === "معلق" ? "secondary" :
        status === "فاشل" ? "destructive" : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// تعريف أعمدة جدول التحويلات البنكية
const bankTransferColumns: ColumnDef<BankTransfer>[] = [
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    accessorKey: "bankName",
    header: "اسم البنك",
  },
  {
    accessorKey: "accountNumber",
    header: "رقم الحساب",
  },
  {
    accessorKey: "accountName",
    header: "اسم الحساب",
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <div className="font-bold">{amount.toLocaleString()} EGP</div>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = 
        status === "مكتمل" ? "default" :
        status === "قيد التنفيذ" ? "secondary" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "reference",
    header: "رقم المرجع",
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBalance, setSelectedBalance] = useState<WalletBalance | null>(null);

  // حساب الإجماليات
  const totalBalance = walletBalances.reduce((sum, wallet) => sum + wallet.balance, 0);
  const cashBalance = walletBalances
    .filter(w => w.type === "نقدي")
    .reduce((sum, wallet) => sum + wallet.balance, 0);
  const bankBalance = walletBalances
    .filter(w => w.type === "بنكي")
    .reduce((sum, wallet) => sum + wallet.balance, 0);
  const digitalBalance = walletBalances
    .filter(w => w.type === "إلكتروني")
    .reduce((sum, wallet) => sum + wallet.balance, 0);

  const stats = [
    {
      title: "إجمالي الرصيد",
      value: `${totalBalance.toLocaleString()} ج.م`,
      description: "رصيد جميع الحسابات",
      icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
      trend: "+5.2%",
      trendUp: true,
    },
    {
      title: "الرصيد النقدي",
      value: `${cashBalance.toLocaleString()} ج.م`,
      description: "الخزنة الرئيسية والنقد",
      icon: <Banknote className="h-4 w-4 text-muted-foreground" />,
      trend: "+2.1%",
      trendUp: true,
    },
    {
      title: "الرصيد البنكي",
      value: `${bankBalance.toLocaleString()} ج.م`,
      description: "جميع الحسابات البنكية",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      trend: "+8.3%",
      trendUp: true,
    },
    {
      title: "المحافظ الإلكترونية",
      value: `${digitalBalance.toLocaleString()} ج.م`,
      description: "فودافون كاش وأورانج",
      icon: <QrCode className="h-4 w-4 text-muted-foreground" />,
      trend: "+12.5%",
      trendUp: true,
    },
  ];

  const quickActions = [
    { icon: <Plus />, label: "إيداع نقدي", variant: "default" as const },
    { icon: <ArrowUpRight />, label: "سحب نقدي", variant: "outline" as const },
    { icon: <Send />, label: "تحويل بنكي", variant: "outline" as const },
    { icon: <Receipt />, label: "دفع فاتورة", variant: "outline" as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">الخزنة والمحفظة المالية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة الرصيد النقدي، التحويلات البنكية، والمحافظ الإلكترونية
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            معاملة جديدة
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            كشف الحساب
          </Button>
        </div> */}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    stat.trendUp
                      ? "text-green-600 border-green-200"
                      : "text-red-600 border-red-200"
                  }`}
                >
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3 ml-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 ml-1" />
                  )}
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الإجراءات السريعة */}
      {/* <div className="grid gap-4 md:grid-cols-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-24 flex flex-col gap-2"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              {action.icon}
            </div>
            <span>{action.label}</span>
          </Button>
        ))}
      </div> */}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-6" dir="rtl" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            الحركات المالية
          </TabsTrigger>
          <TabsTrigger value="bank-transfers" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            التحويلات البنكية
          </TabsTrigger>
          <TabsTrigger value="cash-management" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            إدارة النقدية
          </TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* تفاصيل الحسابات */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>تفاصيل الحسابات والرصيد</CardTitle>
                <CardDescription>توزيع الرصيد حسب نوع الحساب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletBalances.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedBalance(wallet)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {wallet.icon}
                        </div>
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {wallet.type} • آخر حركة: {wallet.lastTransaction}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {wallet.balance.toLocaleString()} {wallet.currency}
                        </div>
                        <Badge variant="secondary">{wallet.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ملخص الرصيد */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الرصيد</CardTitle>
                <CardDescription>نسب الأرصدة حسب النوع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["بنكي", "نقدي", "إلكتروني"].map((type) => {
                    const typeBalances = walletBalances.filter(w => w.type === type);
                    const total = typeBalances.reduce((sum, w) => sum + w.balance, 0);
                    const percentage = total > 0 ? (total / totalBalance) * 100 : 0;
                    
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{type}</span>
                          <span className="text-sm font-bold">{total.toLocaleString()} ج.م</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              type === "بنكي" ? "bg-blue-500" :
                              type === "نقدي" ? "bg-green-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">إجمالي الرصيد:</span>
                      <span className="font-bold">{totalBalance.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">عدد الحسابات:</span>
                      <span className="font-bold">{walletBalances.length} حساب</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">متوسط الرصيد:</span>
                      <span className="font-bold">
                        {(totalBalance / walletBalances.length).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* الحركات المالية */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>الحركات المالية</CardTitle>
              <CardDescription>سجل كامل لجميع المعاملات المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={transactionColumns}
                data={transactionsData}
                searchPlaceholder="ابحث في الحركات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                filterOptions={[
                  {
                    column: "type",
                    options: ["إيداع", "سحب", "تحويل", "دفع", "قبض"],
                  },
                  {
                    column: "paymentMethod",
                    options: ["نقدي", "بطاقة", "تحويل بنكي", "محفظة إلكترونية"],
                  },
                  {
                    column: "status",
                    options: ["مكتمل", "معلق", "ملغي", "فاشل"],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحويلات البنكية */}
        <TabsContent value="bank-transfers">
          <Card>
            <CardHeader>
              <CardTitle>التحويلات البنكية</CardTitle>
              <CardDescription>سجل التحويلات بين الحسابات البنكية</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={bankTransferColumns}
                data={bankTransfersData}
                searchPlaceholder="ابحث في التحويلات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                filterOptions={[
                  {
                    column: "bankName",
                    options: Array.from(new Set(bankTransfersData.map(b => b.bankName))),
                  },
                  {
                    column: "status",
                    options: ["مكتمل", "قيد التنفيذ", "مرفوض"],
                  },
                ]}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    إجمالي التحويلات هذا الشهر
                  </div>
                  <div className="text-xl font-bold">
                    {bankTransfersData.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ج.م
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 ml-2" />
                  طلب تحويل بنكي جديد
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* إدارة النقدية */}
        <TabsContent value="cash-management">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* الخزينة النقدية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  الخزينة النقدية
                </CardTitle>
                <CardDescription>إدارة النقدية والمدفوعات النقدية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 border rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground">الرصيد النقدي المتاح</div>
                    <div className="text-4xl font-bold mt-2 text-green-600">
                      {cashBalance.toLocaleString()} ج.م
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      في الخزينة الرئيسية
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">إجمالي الإيداعات اليوم</span>
                      <span className="font-bold text-green-600">+25,000 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">إجمالي السحوبات اليوم</span>
                      <span className="font-bold text-red-600">-15,000 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm font-medium">صافي الحركة</span>
                      <span className="font-bold text-blue-600">+10,000 ج.م</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex flex-col h-20">
                      <Plus className="h-5 w-5 mb-1" />
                      <span>إيداع نقدي</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20">
                      <ArrowUpRight className="h-5 w-5 mb-1" />
                      <span>سحب نقدي</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* كشف حساب النقدية */}
            <Card>
              <CardHeader>
                <CardTitle>كشف النقدية اليومي</CardTitle>
                <CardDescription>حركات النقدية للخزينة الرئيسية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">رصيد أول المدة</div>
                      <div className="text-sm text-muted-foreground">بداية اليوم</div>
                    </div>
                    <div className="font-bold">140,000 ج.م</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">الإيداعات:</span>
                      <span className="font-bold">25,000 ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">السحوبات:</span>
                      <span className="font-bold">15,000 ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium">رصيد آخر المدة</div>
                      <div className="text-sm text-muted-foreground">نهاية اليوم المتوقع</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      150,000 ج.م
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">
                      ملاحظات الخزينة:
                    </div>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                      placeholder="أضف ملاحظات حول حركة النقدية اليوم..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Shield className="h-4 w-4 ml-2" />
                  إقفال الخزينة اليومي
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ملخص الحركات الأخيرة */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الحركات المالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionsData.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${
                    transaction.type === "إيداع" || transaction.type === "قبض"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}>
                    {transaction.type === "إيداع" || transaction.type === "قبض" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.fromTo} • {transaction.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.type === "إيداع" || transaction.type === "قبض"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {transaction.type === "إيداع" || transaction.type === "قبض" ? "+" : "-"}
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {transaction.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}