// src/app/dashboard/accounting/trial-balance/page.tsx
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
  Scale,
  Calculator,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  Download,
  Printer,
  Filter,
  Search,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface TrialBalanceEntry {
  id: string;
  accountCode: string;
  accountName: string;
  openingDebit: number;
  openingCredit: number;
  movementDebit: number;
  movementCredit: number;
  closingDebit: number;
  closingCredit: number;
  accountType: "أصول" | "خصوم" | "إيرادات" | "مصروفات";
  level: number;
}

interface TrialBalancePeriod {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalDebit: number;
  totalCredit: number;
  difference: number;
  status: "مكتمل" | "قيد المراجعة";
}

// بيانات ثابتة
const trialBalanceData: TrialBalanceEntry[] = [
  {
    id: "1",
    accountCode: "101",
    accountName: "البنك الأهلي",
    openingDebit: 500000,
    openingCredit: 0,
    movementDebit: 200000,
    movementCredit: 150000,
    closingDebit: 550000,
    closingCredit: 0,
    accountType: "أصول",
    level: 1,
  },
  {
    id: "2",
    accountCode: "102",
    accountName: "الخزينة",
    openingDebit: 100000,
    openingCredit: 0,
    movementDebit: 50000,
    movementCredit: 30000,
    closingDebit: 120000,
    closingCredit: 0,
    accountType: "أصول",
    level: 1,
  },
  {
    id: "3",
    accountCode: "201",
    accountName: "رأس المال",
    openingDebit: 0,
    openingCredit: 600000,
    movementDebit: 0,
    movementCredit: 150000,
    closingDebit: 0,
    closingCredit: 750000,
    accountType: "خصوم",
    level: 1,
  },
  {
    id: "4",
    accountCode: "301",
    accountName: "المبيعات",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 0,
    movementCredit: 850000,
    closingDebit: 0,
    closingCredit: 850000,
    accountType: "إيرادات",
    level: 1,
  },
  {
    id: "5",
    accountCode: "401",
    accountName: "المشتريات",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 450000,
    movementCredit: 0,
    closingDebit: 450000,
    closingCredit: 0,
    accountType: "مصروفات",
    level: 1,
  },
  {
    id: "6",
    accountCode: "501",
    accountName: "المصروفات العمومية",
    openingDebit: 0,
    openingCredit: 0,
    movementDebit: 120000,
    movementCredit: 0,
    closingDebit: 120000,
    closingCredit: 0,
    accountType: "مصروفات",
    level: 1,
  },
];

const periodsData: TrialBalancePeriod[] = [
  {
    id: "1",
    period: "يناير 2024",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalDebit: 1240000,
    totalCredit: 1240000,
    difference: 0,
    status: "مكتمل",
  },
  {
    id: "2",
    period: "فبراير 2024",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
    status: "قيد المراجعة",
  },
  {
    id: "3",
    period: "ديسمبر 2023",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    totalDebit: 1100000,
    totalCredit: 1100000,
    difference: 0,
    status: "مكتمل",
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// تعريف أعمدة جدول ميزان المراجعة
const trialBalanceColumns: ColumnDef<TrialBalanceEntry>[] = [
  {
    accessorKey: "accountCode",
    header: "رقم الحساب",
  },
  {
    accessorKey: "accountName",
    header: "اسم الحساب",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const level = row.original.level;
      return (
        <div style={{ paddingLeft: `${level * 20}px` }}>
          {row.original.accountName}
        </div>
      );
    },
  },
  {
    accessorKey: "openingDebit",
    header: "رصيد أول المدة مدين",
    cell: ({ row }) => {
      const amount = row.getValue("openingDebit") as number;
      return amount > 0 ? (
        <div className="text-green-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "openingCredit",
    header: "رصيد أول المدة دائن",
    cell: ({ row }) => {
      const amount = row.getValue("openingCredit") as number;
      return amount > 0 ? (
        <div className="text-red-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "movementDebit",
    header: "حركة الفترة مدين",
    cell: ({ row }) => {
      const amount = row.getValue("movementDebit") as number;
      return amount > 0 ? (
        <div className="text-green-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "movementCredit",
    header: "حركة الفترة دائن",
    cell: ({ row }) => {
      const amount = row.getValue("movementCredit") as number;
      return amount > 0 ? (
        <div className="text-red-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "closingDebit",
    header: "رصيد آخر المدة مدين",
    cell: ({ row }) => {
      const amount = row.getValue("closingDebit") as number;
      return amount > 0 ? (
        <div className="text-green-600 font-bold">
          {amount.toLocaleString()} ج.م
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "closingCredit",
    header: "رصيد آخر المدة دائن",
    cell: ({ row }) => {
      const amount = row.getValue("closingCredit") as number;
      return amount > 0 ? (
        <div className="text-red-600 font-bold">
          {amount.toLocaleString()} ج.م
        </div>
      ) : null;
    },
  },
];

// مودال إعداد ميزان المراجعة
function TrialBalanceSetupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    period: "",
    startDate: "",
    endDate: "",
    includeZeroBalances: true,
    accountLevel: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إعداد ميزان مراجعة:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            إعداد ميزان المراجعة
          </DialogTitle>
          <DialogDescription>
            إعداد معايير وعرض ميزان المراجعة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">الفترة الزمنية</Label>
            <Select
              value={formData.period}
              onValueChange={(value) =>
                setFormData({ ...formData, period: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="quarterly">ربع سنوي</SelectItem>
                <SelectItem value="yearly">سنوي</SelectItem>
                <SelectItem value="custom">مخصص</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountLevel">مستوى الحسابات</Label>
            <Select
              value={formData.accountLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, accountLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">الرئيسية فقط</SelectItem>
                <SelectItem value="2">الفرعية</SelectItem>
                <SelectItem value="3">التفصيلية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeZeroBalances"
              checked={formData.includeZeroBalances}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  includeZeroBalances: e.target.checked,
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="includeZeroBalances">
              تضمين الحسابات ذات الأرصدة الصفرية
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">عرض الميزان</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TrialBalancePage() {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");

  const stats = [
    {
      title: "إجمالي مدين",
      value: "1,240,000 ج.م",
      description: "مجموع الأرصدة المدينة",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "إجمالي دائن",
      value: "1,240,000 ج.م",
      description: "مجموع الأرصدة الدائنة",
      icon: <TrendingDown className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "الفرق",
      value: "0 ج.م",
      description: "الميزان متوازن",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "عدد الحسابات",
      value: trialBalanceData.length,
      description: "الحسابات المدرجة",
      icon: <Calculator className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const selectedPeriodData = periodsData.find(
    (p) => p.id === selectedPeriod
  );

  const totals = {
    openingDebit: trialBalanceData.reduce(
      (sum, item) => sum + item.openingDebit,
      0
    ),
    openingCredit: trialBalanceData.reduce(
      (sum, item) => sum + item.openingCredit,
      0
    ),
    movementDebit: trialBalanceData.reduce(
      (sum, item) => sum + item.movementDebit,
      0
    ),
    movementCredit: trialBalanceData.reduce(
      (sum, item) => sum + item.movementCredit,
      0
    ),
    closingDebit: trialBalanceData.reduce(
      (sum, item) => sum + item.closingDebit,
      0
    ),
    closingCredit: trialBalanceData.reduce(
      (sum, item) => sum + item.closingCredit,
      0
    ),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ميزان المراجعة</h1>
          <p className="text-muted-foreground mt-2">
            عرض وتدقيق ميزان المراجعة للحسابات
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsSetupModalOpen(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            إعداد الميزان
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            طباعة
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

      <Tabs defaultValue="balance" className="space-y-6" dir="rtl">
        <TabsList>
          <TabsTrigger value="balance" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            ميزان المراجعة
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            الفترات
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ميزان المراجعة</CardTitle>
                  <CardDescription>
                    {selectedPeriodData?.period} - من{" "}
                    {selectedPeriodData?.startDate} إلى{" "}
                    {selectedPeriodData?.endDate}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodsData.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={trialBalanceColumns}
                data={trialBalanceData}
                searchPlaceholder="ابحث في الحسابات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                filterOptions={[
                  {
                    column: "accountType",
                    options: ["أصول", "خصوم", "إيرادات", "مصروفات"],
                  },
                ]}
              />

              {/* الإجماليات */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-4 font-bold text-sm">
                    <div className="col-span-2 text-right">الإجمالي</div>
                    <div className="text-green-600 text-right">
                      {totals.openingDebit.toLocaleString()} ج.م
                    </div>
                    <div className="text-red-600 text-right">
                      {totals.openingCredit.toLocaleString()} ج.م
                    </div>
                    <div className="text-green-600 text-right">
                      {totals.movementDebit.toLocaleString()} ج.م
                    </div>
                    <div className="text-red-600 text-right">
                      {totals.movementCredit.toLocaleString()} ج.م
                    </div>
                    <div className="text-green-600 text-right">
                      {totals.closingDebit.toLocaleString()} ج.م
                    </div>
                    <div className="text-red-600 text-right">
                      {totals.closingCredit.toLocaleString()} ج.م
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            totals.closingDebit === totals.closingCredit
                              ? "default"
                              : "destructive"
                          }
                        >
                          {totals.closingDebit === totals.closingCredit
                            ? "متوازن"
                            : "غير متوازن"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          الفرق:{" "}
                          {Math.abs(
                            totals.closingDebit - totals.closingCredit
                          ).toLocaleString()}{" "}
                          ج.م
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">مجموع المدين:</span>{" "}
                        {totals.closingDebit.toLocaleString()} ج.م |{" "}
                        <span className="font-medium">مجموع الدائن:</span>{" "}
                        {totals.closingCredit.toLocaleString()} ج.م
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>الفترات الزمنية</CardTitle>
              <CardDescription>
                إدارة فترات ميزان المراجعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {periodsData.map((period) => (
                  <Card key={period.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{period.period}</div>
                          <div className="text-sm text-muted-foreground">
                            {period.startDate} - {period.endDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {period.totalDebit.toLocaleString()} ج.م
                            </div>
                            <div className="text-sm text-muted-foreground">
                              إجمالي مدين
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {period.totalCredit.toLocaleString()} ج.م
                            </div>
                            <div className="text-sm text-muted-foreground">
                              إجمالي دائن
                            </div>
                          </div>
                          <Badge
                            variant={
                              period.status === "مكتمل"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {period.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPeriod(period.id)}
                          >
                            عرض
                          </Button>
                        </div>
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
                <CardTitle>تحليل حسب نوع الحساب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["أصول", "خصوم", "إيرادات", "مصروفات"].map((type) => {
                    const accounts = trialBalanceData.filter(
                      (a) => a.accountType === type
                    );
                    const totalDebit = accounts.reduce(
                      (sum, a) => sum + a.closingDebit,
                      0
                    );
                    const totalCredit = accounts.reduce(
                      (sum, a) => sum + a.closingCredit,
                      0
                    );

                    return (
                      <div key={type}>
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{type}</div>
                          <div className="text-sm">
                            {accounts.length} حساب
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>مدين: {totalDebit.toLocaleString()} ج.م</span>
                          <span>دائن: {totalCredit.toLocaleString()} ج.م</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(accounts.length / trialBalanceData.length) * 100}%`,
                            }}
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
                <CardTitle>الاتجاهات الزمنية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  مخطط الاتجاهات الزمنية
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <TrialBalanceSetupModal
        open={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
    </div>
  );
}