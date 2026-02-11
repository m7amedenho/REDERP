// src/app/finance/operational-expenses/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Printer,
  BarChart3,
  AlertTriangle,
  Target,
  FileText,
  ShieldAlert,
  Home,
  Car,
  Wifi,
  Users,
  Building,
  CheckCircle,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface OperationalExpense {
  id: string;
  expenseNumber: string;
  expenseDate: string;
  category: "رواتب" | "إيجارات" | "مرافق" | "صيانة" | "نقل" | "إعلان" | "مصروفات مكتب" | "تأمين" | "أخرى";
  description: string;
  amount: number;
  vendorName?: string;
  paymentMethod: "نقدي" | "شيك" | "تحويل" | "آجل";
  paidBy: string;
  receiptNumber?: string;
  status: "مدفوع" | "معلق" | "ملغي";
  budgetedAmount?: number;
  notes?: string;
}

interface ExpenseCategory {
  name: string;
  budget: number;
  actual: number;
  variance: number;
  percentage: number;
}

// بيانات ثابتة
const expensesData: OperationalExpense[] = [
  {
    id: "1",
    expenseNumber: "EXP-2024-001",
    expenseDate: "2024-01-05",
    category: "رواتب",
    description: "رواتب شهر يناير للموظفين",
    amount: 80000,
    paymentMethod: "تحويل",
    paidBy: "أحمد محمود",
    status: "مدفوع",
    budgetedAmount: 85000,
  },
  {
    id: "2",
    expenseNumber: "EXP-2024-002",
    expenseDate: "2024-01-10",
    category: "إيجارات",
    description: "إيجار المقر الرئيسي",
    amount: 20000,
    vendorName: "شركة العقارات المتحدة",
    paymentMethod: "شيك",
    paidBy: "فاطمة أحمد",
    receiptNumber: "RCP-001",
    status: "مدفوع",
    budgetedAmount: 20000,
  },
  {
    id: "3",
    expenseNumber: "EXP-2024-003",
    expenseDate: "2024-01-12",
    category: "مرافق",
    description: "فاتورة الكهرباء",
    amount: 5000,
    vendorName: "شركة الكهرباء",
    paymentMethod: "تحويل",
    paidBy: "محمد علي",
    status: "مدفوع",
    budgetedAmount: 6000,
  },
  {
    id: "4",
    expenseNumber: "EXP-2024-004",
    expenseDate: "2024-01-15",
    category: "صيانة",
    description: "صيانة سيارات الشركة",
    amount: 12000,
    vendorName: "مركز الصيانة المتكامل",
    paymentMethod: "نقدي",
    paidBy: "خالد سعيد",
    receiptNumber: "RCP-002",
    status: "معلق",
    budgetedAmount: 10000,
  },
  {
    id: "5",
    expenseNumber: "EXP-2024-005",
    expenseDate: "2024-01-18",
    category: "نقل",
    description: "وقود سيارات الشركة",
    amount: 8000,
    vendorName: "محطة الوقود",
    paymentMethod: "نقدي",
    paidBy: "أحمد محمود",
    status: "مدفوع",
    budgetedAmount: 7500,
  },
  {
    id: "6",
    expenseNumber: "EXP-2024-006",
    expenseDate: "2024-01-22",
    category: "إعلان",
    description: "حملة إعلانية على مواقع التواصل",
    amount: 15000,
    vendorName: "وكالة الإعلان الرقمي",
    paymentMethod: "تحويل",
    paidBy: "فاطمة أحمد",
    status: "مدفوع",
    budgetedAmount: 20000,
  },
  {
    id: "7",
    expenseNumber: "EXP-2024-007",
    expenseDate: "2024-01-25",
    category: "تأمين",
    description: "تجديد بوليصة تأمين المبنى",
    amount: 10000,
    vendorName: "شركة التأمين الوطنية",
    paymentMethod: "شيك",
    paidBy: "محمد علي",
    status: "معلق",
    budgetedAmount: 12000,
  },
];

const expenseCategories: ExpenseCategory[] = [
  {
    name: "رواتب",
    budget: 85000,
    actual: 80000,
    variance: -5000,
    percentage: 94,
  },
  {
    name: "إيجارات",
    budget: 20000,
    actual: 20000,
    variance: 0,
    percentage: 100,
  },
  {
    name: "مرافق",
    budget: 6000,
    actual: 5000,
    variance: -1000,
    percentage: 83,
  },
  {
    name: "صيانة",
    budget: 10000,
    actual: 12000,
    variance: 2000,
    percentage: 120,
  },
  {
    name: "نقل",
    budget: 7500,
    actual: 8000,
    variance: 500,
    percentage: 107,
  },
  {
    name: "إعلان",
    budget: 20000,
    actual: 15000,
    variance: -5000,
    percentage: 75,
  },
  {
    name: "مصروفات مكتب",
    budget: 5000,
    actual: 3000,
    variance: -2000,
    percentage: 60,
  },
  {
    name: "تأمين",
    budget: 12000,
    actual: 10000,
    variance: -2000,
    percentage: 83,
  },
];

// المكونات UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// تعريف أعمدة جدول المصروفات
const expenseColumns: ColumnDef<OperationalExpense>[] = [
  {
    accessorKey: "expenseNumber",
    header: "رقم المصروف",
  },
  {
    accessorKey: "expenseDate",
    header: "التاريخ",
  },
  {
    accessorKey: "category",
    header: "الفئة",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const getIcon = () => {
        switch (category) {
          case "رواتب":
            return <Users className="h-3 w-3 inline mr-1" />;
          case "إيجارات":
            return <Home className="h-3 w-3 inline mr-1" />;
          case "نقل":
            return <Car className="h-3 w-3 inline mr-1" />;
          case "مرافق":
            return <Wifi className="h-3 w-3 inline mr-1" />;
          case "تأمين":
            return <ShieldAlert className="h-3 w-3 inline mr-1" />;
          default:
            return <FileText className="h-3 w-3 inline mr-1" />;
        }
      };

      return (
        <Badge variant="outline">
          {getIcon()} {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "الوصف",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "vendorName",
    header: "المورد",
    cell: ({ row }) => {
      const vendor = row.getValue("vendorName") as string;
      return vendor || <span className="text-muted-foreground">غير محدد</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const budgeted = row.original.budgetedAmount;
      const isOverBudget = budgeted && amount > budgeted;

      return (
        <div className={`font-medium ${isOverBudget ? "text-red-600" : "text-blue-600"}`}>
          {amount.toLocaleString()} ج.م
          {budgeted && (
            <div className="text-xs text-muted-foreground">
              الميزانية: {budgeted.toLocaleString()} ج.م
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <Badge variant="secondary">{method}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مدفوع"
          ? "default"
          : status === "معلق"
          ? "secondary"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// مودال إضافة مصروف
function AddExpenseModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split("T")[0],
    category: "مصروفات مكتب" as OperationalExpense["category"],
    description: "",
    amount: "",
    vendorName: "",
    paymentMethod: "نقدي" as OperationalExpense["paymentMethod"],
    receiptNumber: "",
    budgetedAmount: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إضافة مصروف جديد:", formData);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "رواتب":
        return <Users className="h-4 w-4" />;
      case "إيجارات":
        return <Home className="h-4 w-4" />;
      case "نقل":
        return <Car className="h-4 w-4" />;
      case "مرافق":
        return <Wifi className="h-4 w-4" />;
      case "تأمين":
        return <ShieldAlert className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة مصروف تشغيلي
          </DialogTitle>
          <DialogDescription>تسجيل مصروف تشغيلي جديد</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseDate">تاريخ المصروف *</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) =>
                  setFormData({ ...formData, expenseDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">فئة المصروف *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: OperationalExpense["category"]) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category.name)}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={2}
              placeholder="أدخل وصف تفصيلي للمصروف..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetedAmount">المبلغ الميزاني (اختياري)</Label>
              <Input
                id="budgetedAmount"
                type="number"
                value={formData.budgetedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, budgetedAmount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">المورد (اختياري)</Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) =>
                  setFormData({ ...formData, vendorName: e.target.value })
                }
                placeholder="اسم المورد أو الجهة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: OperationalExpense["paymentMethod"]) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقدي">نقدي</SelectItem>
                  <SelectItem value="شيك">شيك</SelectItem>
                  <SelectItem value="تحويل">تحويل بنكي</SelectItem>
                  <SelectItem value="آجل">آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiptNumber">رقم الإيصال (اختياري)</Label>
            <Input
              id="receiptNumber"
              value={formData.receiptNumber}
              onChange={(e) =>
                setFormData({ ...formData, receiptNumber: e.target.value })
              }
              placeholder="رقم الإيصال أو الفاتورة"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">حفظ المصروف</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function OperationalExpensesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("2024-01");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const stats = [
    {
      title: "إجمالي المصروفات",
      value: expensesData.reduce((sum, e) => sum + e.amount, 0).toLocaleString(),
      description: "ج.م لهذا الشهر",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "نسبة التنفيذ",
      value: "92%",
      description: "من الميزانية الشهرية",
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المدفوعة",
      value: expensesData.filter((e) => e.status === "مدفوع").length,
      description: "عملية دفع",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "تجاوز الميزانية",
      value: expenseCategories.filter((c) => c.variance > 0).length,
      description: "فئة",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const monthlyExpenses = expensesData.reduce((acc, expense) => {
    const month = expense.expenseDate.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const filteredExpenses =
    selectedCategory === "all"
      ? expensesData
      : expensesData.filter((e) => e.category === selectedCategory);

  const overBudgetCategories = expenseCategories.filter((c) => c.variance > 0);
  const pendingExpenses = expensesData.filter((e) => e.status === "معلق");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المصروفات التشغيلية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع المصروفات التشغيلية ومقارنتها مع الميزانية
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            مصروف جديد
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            تقرير المصروفات
          </Button>
        </div>
      </div>

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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تصفية البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الشهر</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">يناير 2024</SelectItem>
                  <SelectItem value="2023-12">ديسمبر 2023</SelectItem>
                  <SelectItem value="2023-11">نوفمبر 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفئة</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="opacity-0">بحث</Label>
              <Button className="w-full">تطبيق الفلاتر</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="expenses" className="space-y-6" dir="rtl">
        <TabsList>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            قائمة المصروفات
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            الميزانية
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>جميع المصروفات التشغيلية</CardTitle>
              <CardDescription>سجل كامل للمصروفات التشغيلية</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={expenseColumns}
                data={filteredExpenses}
                searchPlaceholder="ابحث في المصروفات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={(expense) => console.log("تعديل:", expense)}
                onDelete={(expenses) => {
                  if (confirm(`هل تريد حذف ${expenses.length} مصروف؟`)) {
                    console.log("حذف:", expenses);
                  }
                }}
                filterOptions={[
                  {
                    column: "category",
                    options: expenseCategories.map((c) => c.name),
                  },
                  {
                    column: "status",
                    options: ["مدفوع", "معلق", "ملغي"],
                  },
                  {
                    column: "paymentMethod",
                    options: ["نقدي", "شيك", "تحويل", "آجل"],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>الميزانية والتنفيذ</CardTitle>
              <CardDescription>مقارنة المصروفات الفعلية مع الميزانية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {expenseCategories.map((category) => (
                  <Card key={category.name}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            الفعلي: {category.actual.toLocaleString()} ج.م
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              category.variance > 0
                                ? "text-red-600"
                                : category.variance < 0
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          >
                            {category.variance > 0 ? "+" : ""}
                            {category.variance.toLocaleString()} ج.م
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {category.percentage}% من الميزانية
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            category.percentage > 100
                              ? "bg-red-500"
                              : category.percentage > 90
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0 ج.م</span>
                        <span>الميزانية: {category.budget.toLocaleString()} ج.م</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>توزيع المصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  مخطط دائري لتوزيع المصروفات
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الاتجاه الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(monthlyExpenses)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([month, amount]) => (
                      <div key={month} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {new Date(month + "-01").toLocaleDateString("ar-EG", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-sm font-medium">
                            {amount.toLocaleString()} ج.م
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${(amount / Math.max(...Object.values(monthlyExpenses))) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>المصروفات المتجاوزة للميزانية</CardTitle>
            <CardDescription>تحتاج مراجعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overBudgetCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-3 border border-red-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      تجاوز: +{category.variance.toLocaleString()} ج.م
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      {category.percentage}%
                    </div>
                    <Badge variant="destructive">تجاوز</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المصروفات المعلقة</CardTitle>
            <CardDescription>تحتاج دفع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {expense.amount.toLocaleString()} ج.م
                    </div>
                    <Button variant="outline" size="sm">
                      دفع
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة مصروف جديد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                تعديل الميزانية
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                تقرير التجاوزات
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingDown className="h-4 w-4 mr-2" />
                تحليل التخفيض
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddExpenseModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}