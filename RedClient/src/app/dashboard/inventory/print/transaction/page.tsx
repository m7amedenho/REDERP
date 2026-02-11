"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Printer,
  Download,
  Settings,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";

const transactionTemplates = [
  {
    id: "receipt",
    name: "سند استلام",
    description: "قالب لطباعة سند استلام البضائع",
    icon: ArrowUpRight,
    color: "text-green-600",
  },
  {
    id: "issue",
    name: "سند صرف",
    description: "قالب لطباعة سند صرف البضائع",
    icon: ArrowDownLeft,
    color: "text-red-600",
  },
  {
    id: "transfer",
    name: "سند تحويل",
    description: "قالب لطباعة سند تحويل بين المخازن",
    icon: ArrowRightLeft,
    color: "text-blue-600",
  },
];

const recentTransactions = [
  {
    id: "TRX001",
    type: "استلام",
    date: "2024-01-15",
    warehouse: "مخزن البذور",
    status: "مطبوع",
  },
  {
    id: "TRX002",
    type: "صرف",
    date: "2024-01-16",
    warehouse: "مخزن المبيدات",
    status: "معلق",
  },
  {
    id: "TRX003",
    type: "تحويل",
    date: "2024-01-17",
    warehouse: "معرض الأدوات",
    status: "مطبوع",
  },
];

export default function TransactionPrintPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">طباعة سندات الحركة</h1>
            <p className="text-muted-foreground">
              سندات الاستلام والصرف والتحويل
            </p>
          </div>
        </div>
        <Link href="/dashboard/inventory/print/transaction/customize">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            تخصيص القوالب
          </Button>
        </Link>
      </div>

      {/* قوالب السندات */}
      <div className="grid gap-4 md:grid-cols-3">
        {transactionTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card
              key={template.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2`}
                >
                  <IconComponent className={`w-6 h-6 ${template.color}`} />
                </div>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* اختيار الحركة */}
      <Card>
        <CardHeader>
          <CardTitle>طباعة حركة محددة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الحركة</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر رقم الحركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trx1">TRX001</SelectItem>
                  <SelectItem value="trx2">TRX002</SelectItem>
                  <SelectItem value="trx3">TRX003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نوع القالب</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع القالب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receipt">سند استلام</SelectItem>
                  <SelectItem value="issue">سند صرف</SelectItem>
                  <SelectItem value="transfer">سند تحويل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              <Printer className="w-4 h-4" />
              طباعة
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              معاينة
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              تحميل PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* آخر الحركات المطبوعة */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الحركات المطبوعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{transaction.id}</Badge>
                  <div>
                    <div className="font-medium">{transaction.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.warehouse} • {transaction.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      transaction.status === "مطبوع" ? "default" : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    إعادة طباعة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
