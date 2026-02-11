// src/app/dashboard/accounting/general-ledger/page.tsx
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
  Book,
  FileText,
  Calculator,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Printer,
  Filter,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface LedgerAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "مدين" | "دائن" | "أصول" | "خصوم" | "إيرادات" | "مصروفات";
  openingBalance: number;
  closingBalance: number;
  debitTotal: number;
  creditTotal: number;
  level: number;
  parentAccount?: string;
}

interface LedgerTransaction {
  id: string;
  date: string;
  voucherNumber: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  reference: string;
  createdBy: string;
}

// بيانات ثابتة
const ledgerAccounts: LedgerAccount[] = [
  {
    id: "1",
    accountCode: "101",
    accountName: "البنك الأهلي",
    accountType: "أصول",
    openingBalance: 500000,
    closingBalance: 550000,
    debitTotal: 200000,
    creditTotal: 150000,
    level: 1,
  },
  {
    id: "2",
    accountCode: "10101",
    accountName: "البنك الأهلي - حساب جاري",
    accountType: "أصول",
    openingBalance: 300000,
    closingBalance: 350000,
    debitTotal: 150000,
    creditTotal: 100000,
    level: 2,
    parentAccount: "101",
  },
  {
    id: "3",
    accountCode: "10102",
    accountName: "البنك الأهلي - وديعة",
    accountType: "أصول",
    openingBalance: 200000,
    closingBalance: 200000,
    debitTotal: 50000,
    creditTotal: 50000,
    level: 2,
    parentAccount: "101",
  },
  {
    id: "4",
    accountCode: "102",
    accountName: "الخزينة",
    accountType: "أصول",
    openingBalance: 100000,
    closingBalance: 120000,
    debitTotal: 50000,
    creditTotal: 30000,
    level: 1,
  },
  {
    id: "5",
    accountCode: "201",
    accountName: "رأس المال",
    accountType: "خصوم",
    openingBalance: 600000,
    closingBalance: 750000,
    debitTotal: 0,
    creditTotal: 150000,
    level: 1,
  },
  {
    id: "6",
    accountCode: "301",
    accountName: "المبيعات",
    accountType: "إيرادات",
    openingBalance: 0,
    closingBalance: 850000,
    debitTotal: 0,
    creditTotal: 850000,
    level: 1,
  },
];

const accountTransactions: Record<string, LedgerTransaction[]> = {
  "101": [
    {
      id: "1",
      date: "2024-01-15",
      voucherNumber: "JRNL-001",
      description: "بيع بضاعة لشركة النور",
      debitAmount: 150000,
      creditAmount: 0,
      balance: 650000,
      reference: "فاتورة 001",
      createdBy: "أحمد محمود",
    },
    {
      id: "2",
      date: "2024-01-18",
      voucherNumber: "JRNL-002",
      description: "سحب نقدي",
      debitAmount: 0,
      creditAmount: 50000,
      balance: 600000,
      reference: "سحب نقدي",
      createdBy: "أحمد محمود",
    },
    {
      id: "3",
      date: "2024-01-20",
      voucherNumber: "JRNL-003",
      description: "إيداع نقدي",
      debitAmount: 100000,
      creditAmount: 0,
      balance: 700000,
      reference: "إيداع",
      createdBy: "محمد علي",
    },
    {
      id: "4",
      date: "2024-01-22",
      voucherNumber: "JRNL-004",
      description: "دفع مصروفات",
      debitAmount: 0,
      creditAmount: 150000,
      balance: 550000,
      reference: "مصروفات",
      createdBy: "فاطمة أحمد",
    },
  ],
};

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

// تعريف أعمدة جدول الحسابات
const ledgerColumns: ColumnDef<LedgerAccount>[] = [
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
      const hasChildren = ledgerAccounts.some(
        (a) => a.parentAccount === row.original.accountCode
      );
      return (
        <div className="flex items-center">
          <div style={{ paddingLeft: `${(level - 1) * 20}px` }}>
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 mr-1"
                onClick={() => console.log("Toggle")}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
            {row.original.accountName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "accountType",
    header: "نوع الحساب",
    cell: ({ row }) => {
      const type = row.getValue("accountType") as string;
      const variant =
        type === "أصول" || type === "مدين"
          ? "default"
          : type === "إيرادات"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{type}</Badge>;
    },
  },
  {
    accessorKey: "openingBalance",
    header: "رصيد أول المدة",
    cell: ({ row }) => {
      const amount = row.getValue("openingBalance") as number;
      const type = row.original.accountType;
      const isDebit = type === "أصول" || type === "مدين" || type === "مصروفات";
      return (
        <div className={isDebit ? "text-green-600" : "text-red-600"}>
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "debitTotal",
    header: "مجموع مدين",
    cell: ({ row }) => {
      const amount = row.getValue("debitTotal") as number;
      return amount > 0 ? (
        <div className="text-green-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "creditTotal",
    header: "مجموع دائن",
    cell: ({ row }) => {
      const amount = row.getValue("creditTotal") as number;
      return amount > 0 ? (
        <div className="text-red-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "closingBalance",
    header: "رصيد آخر المدة",
    cell: ({ row }) => {
      const amount = row.getValue("closingBalance") as number;
      const type = row.original.accountType;
      const isDebit = type === "أصول" || type === "مدين" || type === "مصروفات";
      return (
        <div
          className={`font-bold ${
            isDebit ? "text-green-600" : "text-red-600"
          }`}
        >
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
];

// تعريف أعمدة جدول الحركات
const transactionColumns: ColumnDef<LedgerTransaction>[] = [
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    accessorKey: "voucherNumber",
    header: "رقم السند",
  },
  {
    accessorKey: "description",
    header: "الوصف",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "debitAmount",
    header: "مدين",
    cell: ({ row }) => {
      const amount = row.getValue("debitAmount") as number;
      return amount > 0 ? (
        <div className="text-green-600 font-medium">
          {amount.toLocaleString()} ج.م
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "creditAmount",
    header: "دائن",
    cell: ({ row }) => {
      const amount = row.getValue("creditAmount") as number;
      return amount > 0 ? (
        <div className="text-red-600 font-medium">
          {amount.toLocaleString()} ج.م
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "balance",
    header: "الرصيد",
    cell: ({ row }) => {
      const amount = row.getValue("balance") as number;
      return (
        <div className="font-bold">{amount.toLocaleString()} ج.م</div>
      );
    },
  },
  {
    accessorKey: "reference",
    header: "المرجع",
  },
  {
    accessorKey: "createdBy",
    header: "تم بواسطة",
  },
];

// مودال حركات الحساب
function AccountTransactionsModal({
  account,
  open,
  onClose,
}: {
  account: LedgerAccount | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!account) return null;

  const transactions = accountTransactions[account.accountCode] || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            حركات الحساب: {account.accountName}
          </DialogTitle>
          <DialogDescription>
            كشف حساب مفصل لجميع الحركات
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">رقم الحساب</div>
                  <div className="font-medium">{account.accountCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">رصيد أول المدة</div>
                  <div className="font-medium text-green-600">
                    {account.openingBalance.toLocaleString()} ج.م
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">رصيد آخر المدة</div>
                  <div className="font-medium text-green-600">
                    {account.closingBalance.toLocaleString()} ج.م
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">نوع الحساب</div>
                  <Badge variant="default">{account.accountType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>حركات الحساب</CardTitle>
              <CardDescription>سجل كامل للحركات المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={transactionColumns}
                data={transactions}
                searchPlaceholder="ابحث في الحركات..."
                rtl={true}
                showExport={true}
                showSearch={true}
                showFilters={true}
                filterOptions={[
                  {
                    column: "createdBy",
                    options: ["أحمد محمود", "محمد علي", "فاطمة أحمد"],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GeneralLedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState<LedgerAccount | null>(null);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    accountType: "",
    startDate: "",
    endDate: "",
  });

  const stats = [
    {
      title: "عدد الحسابات",
      value: ledgerAccounts.length,
      description: "إجمالي الحسابات",
      icon: <Book className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "الحسابات المدينة",
      value: ledgerAccounts.filter(
        (a) => a.accountType === "أصول" || a.accountType === "مدين"
      ).length,
      description: "أصول ومدين",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "الحسابات الدائنة",
      value: ledgerAccounts.filter(
        (a) => a.accountType === "خصوم" || a.accountType === "دائن"
      ).length,
      description: "خصوم ودائن",
      icon: <TrendingDown className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "إجمالي الأرصدة",
      value: "2,270,000 ج.م",
      description: "مجموع أرصدة الحسابات",
      icon: <Calculator className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const handleViewTransactions = (account: LedgerAccount) => {
    setSelectedAccount(account);
    setIsTransactionsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">دفتر الاستاذ</h1>
          <p className="text-muted-foreground mt-2">
            كشف حسابات تفصيلي لجميع الحسابات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            طباعة الدفتر
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير
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
          <CardTitle>تصفية البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <Select
                value={searchParams.accountType}
                onValueChange={(value) =>
                  setSearchParams({ ...searchParams, accountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأنواع</SelectItem>
                  <SelectItem value="أصول">أصول</SelectItem>
                  <SelectItem value="خصوم">خصوم</SelectItem>
                  <SelectItem value="إيرادات">إيرادات</SelectItem>
                  <SelectItem value="مصروفات">مصروفات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Input
                type="date"
                value={searchParams.startDate}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Input
                type="date"
                value={searchParams.endDate}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, endDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="opacity-0">بحث</Label>
              <Button className="w-full">تطبيق الفلاتر</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>دفتر الاستاذ العام</CardTitle>
          <CardDescription>جميع الحسابات مع أرصدتها</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={ledgerColumns}
            data={ledgerAccounts.filter(
              (account) =>
                !searchParams.accountType ||
                account.accountType === searchParams.accountType
            )}
            searchPlaceholder="ابحث في الحسابات..."
            rtl={true}
            showExport={true}
            showSelection={true}
            showSearch={true}
            showFilters={true}
            onView={handleViewTransactions}
            filterOptions={[
              {
                column: "accountType",
                options: ["أصول", "خصوم", "إيرادات", "مصروفات"],
              },
              {
                column: "level",
                options: ["1", "2"],
              },
            ]}
            rowActions={[
              {
                label: "عرض الحركات",
                icon: Eye,
                onClick: handleViewTransactions,
                variant: "outline" as const,
              },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>إجماليات حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["أصول", "خصوم", "إيرادات", "مصروفات"].map((type) => {
                const accounts = ledgerAccounts.filter(
                  (a) => a.accountType === type
                );
                const totalDebit = accounts.reduce(
                  (sum, a) => sum + a.debitTotal,
                  0
                );
                const totalCredit = accounts.reduce(
                  (sum, a) => sum + a.creditTotal,
                  0
                );
                const totalClosing = accounts.reduce(
                  (sum, a) => sum + a.closingBalance,
                  0
                );

                return (
                  <div key={type} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{type}</div>
                      <Badge variant="outline">{accounts.length} حساب</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">مدين</div>
                        <div className="font-medium text-green-600">
                          {totalDebit.toLocaleString()} ج.م
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">دائن</div>
                        <div className="font-medium text-red-600">
                          {totalCredit.toLocaleString()} ج.م
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">الرصيد</div>
                        <div className="font-medium">
                          {totalClosing.toLocaleString()} ج.م
                        </div>
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
            <CardTitle>الحسابات الأكثر نشاطاً</CardTitle>
            <CardDescription>الحسابات ذات أكبر عدد حركات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ledgerAccounts.slice(0, 5).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{account.accountName}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.accountCode}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">
                        {(account.debitTotal + account.creditTotal).toLocaleString()} ج.م
                      </div>
                      <div className="text-xs text-muted-foreground">
                        حجم الحركات
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTransactions(account)}
                    >
                      عرض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AccountTransactionsModal
        account={selectedAccount}
        open={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
      />
    </div>
  );
}