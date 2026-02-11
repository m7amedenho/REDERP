// src/app/finance/checks-book/page.tsx
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
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Printer,
  BarChart3,
  Calendar,
  DollarSign,
  Banknote,
  CalendarDays,
  Receipt,
  Copy,
  ScanLine,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface Check {
  id: string;
  checkNumber: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  beneficiary: string;
  beneficiaryType: "مورد" | "عميل" | "موظف" | "أخرى";
  purpose: string;
  status: "قيد الصرف" | "مصرف" | "مرتجع" | "ملغي" | "متأخر";
  clearedDate?: string;
  returnReason?: string;
  notes?: string;
}

interface BankSummary {
  bankName: string;
  totalChecks: number;
  totalAmount: number;
  pendingChecks: number;
  clearedChecks: number;
  returnedChecks: number;
}

// بيانات ثابتة
const checksData: Check[] = [
  {
    id: "1",
    checkNumber: "CHK-001234",
    bankName: "البنك الأهلي المصري",
    bankBranch: "فرع القاهرة الجديدة",
    accountNumber: "12345678901234",
    amount: 25000,
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    beneficiary: "شركة النور للتجارة",
    beneficiaryType: "مورد",
    purpose: "دفعة مقابل بضاعة",
    status: "مصرف",
    clearedDate: "2024-01-20",
  },
  {
    id: "2",
    checkNumber: "CHK-001235",
    bankName: "بنك مصر",
    bankBranch: "فرع المهندسين",
    accountNumber: "98765432109876",
    amount: 15000,
    issueDate: "2024-01-15",
    dueDate: "2024-01-30",
    beneficiary: "أحمد محمد",
    beneficiaryType: "عميل",
    purpose: "استرداد دفعة",
    status: "قيد الصرف",
  },
  {
    id: "3",
    checkNumber: "CHK-001236",
    bankName: "البنك التجاري الدولي",
    bankBranch: "فرع مدينة نصر",
    accountNumber: "55556666777788",
    amount: 50000,
    issueDate: "2024-01-05",
    dueDate: "2024-01-20",
    beneficiary: "مؤسسة المستقبل",
    beneficiaryType: "مورد",
    purpose: "دفعة مقدم عقد",
    status: "مرتجع",
    returnReason: "رصيد غير كاف",
    clearedDate: "2024-01-18",
  },
  {
    id: "4",
    checkNumber: "CHK-001237",
    bankName: "البنك الأهلي المصري",
    bankBranch: "فرع القاهرة الجديدة",
    accountNumber: "12345678901234",
    amount: 10000,
    issueDate: "2024-01-18",
    dueDate: "2024-02-02",
    beneficiary: "فاطمة علي",
    beneficiaryType: "موظف",
    purpose: "راتب شهر يناير",
    status: "قيد الصرف",
  },
  {
    id: "5",
    checkNumber: "CHK-001238",
    bankName: "بنك القاهرة",
    bankBranch: "فرع الدقي",
    accountNumber: "33334444555566",
    amount: 30000,
    issueDate: "2024-01-12",
    dueDate: "2024-01-27",
    beneficiary: "شركة الأمل للزراعة",
    beneficiaryType: "عميل",
    purpose: "دفعة مقابل منتجات",
    status: "متأخر",
  },
  {
    id: "6",
    checkNumber: "CHK-001239",
    bankName: "البنك الأهلي المصري",
    bankBranch: "فرع القاهرة الجديدة",
    accountNumber: "12345678901234",
    amount: 7500,
    issueDate: "2024-01-20",
    dueDate: "2024-02-04",
    beneficiary: "مشتل الورود",
    beneficiaryType: "مورد",
    purpose: "دفعة بذور",
    status: "ملغي",
  },
];

const bankSummaries: BankSummary[] = [
  {
    bankName: "البنك الأهلي المصري",
    totalChecks: 3,
    totalAmount: 42500,
    pendingChecks: 1,
    clearedChecks: 1,
    returnedChecks: 0,
  },
  {
    bankName: "بنك مصر",
    totalChecks: 1,
    totalAmount: 15000,
    pendingChecks: 1,
    clearedChecks: 0,
    returnedChecks: 0,
  },
  {
    bankName: "البنك التجاري الدولي",
    totalChecks: 1,
    totalAmount: 50000,
    pendingChecks: 0,
    clearedChecks: 0,
    returnedChecks: 1,
  },
  {
    bankName: "بنك القاهرة",
    totalChecks: 1,
    totalAmount: 30000,
    pendingChecks: 0,
    clearedChecks: 0,
    returnedChecks: 0,
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

// تعريف أعمدة جدول الشيكات
const checkColumns: ColumnDef<Check>[] = [
  {
    accessorKey: "checkNumber",
    header: "رقم الشيك",
  },
  {
    accessorKey: "bankName",
    header: "البنك",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "beneficiary",
    header: "المستفيد",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "beneficiaryType",
    header: "نوع المستفيد",
    cell: ({ row }) => {
      const type = row.getValue("beneficiaryType") as string;
      return <Badge variant="outline">{type}</Badge>;
    },
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
    accessorKey: "issueDate",
    header: "تاريخ الإصدار",
  },
  {
    accessorKey: "dueDate",
    header: "تاريخ الاستحقاق",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string;
      const status = row.original.status;
      const isOverdue = status === "متأخر";
      return (
        <div className={isOverdue ? "text-red-600 font-bold" : ""}>
          {dueDate}
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
        status === "مصرف"
          ? "default"
          : status === "قيد الصرف"
          ? "secondary"
          : status === "متأخر"
          ? "destructive"
          : status === "مرتجع"
          ? "outline"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "purpose",
    header: "الغرض",
    cell: ({ row }) => {
      const purpose = row.getValue("purpose") as string;
      return (
        <div className="max-w-xs truncate" title={purpose}>
          {purpose}
        </div>
      );
    },
  },
];

// مودال إضافة شيك
function AddCheckModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    checkNumber: "",
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    amount: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    beneficiary: "",
    beneficiaryType: "مورد" as "مورد" | "عميل" | "موظف" | "أخرى",
    purpose: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إضافة شيك جديد:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة شيك جديد
          </DialogTitle>
          <DialogDescription>تسجيل شيك جديد في الدفتر</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkNumber">رقم الشيك *</Label>
              <Input
                id="checkNumber"
                value={formData.checkNumber}
                onChange={(e) =>
                  setFormData({ ...formData, checkNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">البنك *</Label>
              <Select
                value={formData.bankName}
                onValueChange={(value) =>
                  setFormData({ ...formData, bankName: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر البنك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="البنك الأهلي المصري">
                    البنك الأهلي المصري
                  </SelectItem>
                  <SelectItem value="بنك مصر">بنك مصر</SelectItem>
                  <SelectItem value="البنك التجاري الدولي">
                    البنك التجاري الدولي
                  </SelectItem>
                  <SelectItem value="بنك القاهرة">بنك القاهرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankBranch">الفرع</Label>
              <Input
                id="bankBranch"
                value={formData.bankBranch}
                onChange={(e) =>
                  setFormData({ ...formData, bankBranch: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">رقم الحساب</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>
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
              <Label htmlFor="beneficiaryType">نوع المستفيد</Label>
              <Select
                value={formData.beneficiaryType}
                onValueChange={(value: "مورد" | "عميل" | "موظف" | "أخرى") =>
                  setFormData({ ...formData, beneficiaryType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مورد">مورد</SelectItem>
                  <SelectItem value="عميل">عميل</SelectItem>
                  <SelectItem value="موظف">موظف</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">تاريخ الإصدار *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">تاريخ الاستحقاق *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary">المستفيد *</Label>
            <Input
              id="beneficiary"
              value={formData.beneficiary}
              onChange={(e) =>
                setFormData({ ...formData, beneficiary: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">الغرض</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              rows={2}
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
            <Button type="submit">حفظ الشيك</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// مودال تحديث حالة الشيك
function UpdateCheckStatusModal({
  check,
  open,
  onClose,
}: {
  check: Check | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!check) return null;

  const [status, setStatus] = useState<Check["status"]>(check.status);
  const [returnReason, setReturnReason] = useState(check.returnReason || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("تحديث حالة الشيك:", check.checkNumber, { status, returnReason });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تحديث حالة الشيك
          </DialogTitle>
          <DialogDescription>
            تحديث حالة الشيك رقم: {check.checkNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>الشيك</Label>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">{check.beneficiary}</div>
              <div className="text-sm text-muted-foreground">
                المبلغ: {check.amount.toLocaleString()} ج.م
              </div>
              <div className="text-sm text-muted-foreground">
                الاستحقاق: {check.dueDate}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">الحالة الجديدة *</Label>
            <Select value={status} onValueChange={(value: Check["status"]) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="قيد الصرف">قيد الصرف</SelectItem>
                <SelectItem value="مصرف">مصرف</SelectItem>
                <SelectItem value="مرتجع">مرتجع</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
                <SelectItem value="متأخر">متأخر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "مرتجع" && (
            <div className="space-y-2">
              <Label htmlFor="returnReason">سبب الإرجاع</Label>
              <Textarea
                id="returnReason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
                placeholder="أدخل سبب إرجاع الشيك..."
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">تحديث الحالة</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ChecksBookPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const stats = [
    {
      title: "إجمالي الشيكات",
      value: checksData.length,
      description: "شيك",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "قيمة الشيكات",
      value: checksData.reduce((sum, c) => sum + c.amount, 0).toLocaleString(),
      description: "ج.م",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "قيد الصرف",
      value: checksData.filter((c) => c.status === "قيد الصرف").length,
      description: "شيك معلق",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "متأخر",
      value: checksData.filter((c) => c.status === "متأخر").length,
      description: "شيك متأخر",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const upcomingChecks = checksData
    .filter((c) => c.status === "قيد الصرف")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const handleUpdateStatus = (check: Check) => {
    setSelectedCheck(check);
    setIsStatusModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">دفتر الشيكات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع الشيكات الصادرة
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            شيك جديد
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            طباعة الدفتر
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

      <Tabs defaultValue="all" className="space-y-6" dir="rtl">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            جميع الشيكات
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            قيد الصرف
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            قادمة الاستحقاق
          </TabsTrigger>
          <TabsTrigger value="banks" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            حسب البنك
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع الشيكات</CardTitle>
              <CardDescription>سجل كامل لجميع الشيكات الصادرة</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={checkColumns}
                data={checksData}
                searchPlaceholder="ابحث في الشيكات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={(check) => console.log("تعديل:", check)}
                onDelete={(checks) => {
                  if (confirm(`هل تريد حذف ${checks.length} شيك؟`)) {
                    console.log("حذف:", checks);
                  }
                }}
                rowActions={[
                  {
                    label: "تحديث الحالة",
                    icon: Edit,
                    onClick: handleUpdateStatus,
                    variant: "outline" as const,
                  },
                  {
                    label: "نسخ رقم الشيك",
                    icon: Copy,
                    onClick: (check) => {
                      navigator.clipboard.writeText(check.checkNumber);
                      console.log("تم نسخ رقم الشيك:", check.checkNumber);
                    },
                    variant: "ghost" as const,
                  },
                ]}
                filterOptions={[
                  {
                    column: "status",
                    options: ["قيد الصرف", "مصرف", "مرتجع", "ملغي", "متأخر"],
                  },
                  {
                    column: "beneficiaryType",
                    options: ["مورد", "عميل", "موظف", "أخرى"],
                  },
                  {
                    column: "bankName",
                    options: Array.from(new Set(checksData.map((c) => c.bankName))),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>الشيكات قيد الصرف</CardTitle>
              <CardDescription>الشيكات التي لم يتم صرفها بعد</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={checkColumns}
                data={checksData.filter((c) => c.status === "قيد الصرف")}
                searchPlaceholder="ابحث في الشيكات المعلقة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>الشيكات القادمة الاستحقاق</CardTitle>
              <CardDescription>الشيكات التي ستستحق خلال 7 أيام</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={checkColumns}
                data={upcomingChecks}
                searchPlaceholder="ابحث في الشيكات القادمة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks">
          <Card>
            <CardHeader>
              <CardTitle>الشيكات حسب البنك</CardTitle>
              <CardDescription>توزيع الشيكات والحالة حسب البنك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankSummaries.map((bank) => (
                  <Card key={bank.bankName}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-medium">{bank.bankName}</div>
                          <div className="text-sm text-muted-foreground">
                            {bank.totalChecks} شيك
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {bank.totalAmount.toLocaleString()} ج.م
                          </div>
                          <div className="text-sm text-muted-foreground">
                            إجمالي المبلغ
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <Badge variant="secondary" className="mb-1">
                            {bank.pendingChecks}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            قيد الصرف
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant="default" className="mb-1">
                            {bank.clearedChecks}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            مصرف
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="mb-1">
                            {bank.returnedChecks}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            مرتجع
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>الشيكات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["قيد الصرف", "مصرف", "مرتجع", "ملغي", "متأخر"].map((status) => {
                const count = checksData.filter((c) => c.status === status).length;
                const totalAmount = checksData
                  .filter((c) => c.status === status)
                  .reduce((sum, c) => sum + c.amount, 0);
                const percentage = (count / checksData.length) * 100;

                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            status === "مصرف"
                              ? "default"
                              : status === "قيد الصرف"
                              ? "secondary"
                              : status === "متأخر"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {status}
                        </Badge>
                        <span className="text-sm">{count} شيك</span>
                      </div>
                      <div className="text-sm font-medium">
                        {totalAmount.toLocaleString()} ج.م
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الشيكات القادمة الاستحقاق</CardTitle>
            <CardDescription>خلال 7 أيام القادمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingChecks.map((check) => {
                const daysUntilDue = Math.ceil(
                  (new Date(check.dueDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={check.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{check.beneficiary}</div>
                      <div className="text-sm text-muted-foreground">
                        {check.checkNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          daysUntilDue <= 2
                            ? "text-red-600"
                            : daysUntilDue <= 5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {check.amount.toLocaleString()} ج.م
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {daysUntilDue} يوم متبقي
                      </div>
                    </div>
                  </div>
                );
              })}
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
                إضافة شيك جديد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ScanLine className="h-4 w-4 mr-2" />
                مسح شيك وارد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                طباعة كشف الشيكات
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                تنبيهات الاستحقاق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddCheckModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <UpdateCheckStatusModal
        check={selectedCheck}
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}