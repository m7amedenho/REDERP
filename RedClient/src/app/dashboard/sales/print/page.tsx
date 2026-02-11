"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconPrinter,
  IconReceipt,
  IconFileInvoice,
  IconReportMoney,
  IconBarcode,
} from "@tabler/icons-react";
import Link from "next/link";

export default function SalesPrintPage() {
  const printOptions = [
    {
      title: "طباعة الفواتير",
      description: "طباعة فواتير المبيعات النقدية والآجلة",
      icon: IconFileInvoice,
      href: "/dashboard/sales/print/invoice",
      color: "bg-blue-500",
    },
    {
      title: "طباعة الإيصالات",
      description: "طباعة إيصالات الدفع والتحصيل",
      icon: IconReceipt,
      href: "/dashboard/sales/print/receipt",
      color: "bg-green-500",
    },
    {
      title: "طباعة كشف حساب",
      description: "طباعة كشوف حسابات العملاء",
      icon: IconReportMoney,
      href: "/dashboard/sales/print/statement",
      color: "bg-purple-500",
    },
    {
      title: "طباعة باركود",
      description: "طباعة باركود المنتجات",
      icon: IconBarcode,
      href: "/dashboard/sales/print/barcode",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">طباعة المستندات</h1>
          <p className="text-muted-foreground mt-1">
            اختر نوع المستند الذي تريد طباعته
          </p>
        </div>
        <IconPrinter className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Print Options Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {printOptions.map((option) => (
          <Link key={option.href} href={option.href}>
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardHeader className="pb-3">
                <div
                  className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-3`}
                >
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Prints */}
      <Card>
        <CardHeader>
          <CardTitle>المستندات المطبوعة مؤخراً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "فاتورة",
                number: "INV-2024-001",
                customer: "أحمد محمد",
                date: "2024-01-15",
              },
              {
                type: "إيصال",
                number: "REC-2024-045",
                customer: "شركة النور",
                date: "2024-01-15",
              },
              {
                type: "كشف حساب",
                number: "ST-2024-012",
                customer: "محمد علي",
                date: "2024-01-14",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <IconPrinter className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {item.type} - {item.number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {item.date}
                  </span>
                  <Button variant="ghost" size="sm">
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
