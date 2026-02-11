"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  FileText,
  Printer,
  Tags,
  ChevronLeft,
  Settings,
  Layers,
  Download,
} from "lucide-react";
import Link from "next/link";

const printSections = [
  {
    id: "barcode",
    title: "طباعة الباركود",
    description: "إنشاء وطباعة باركود للمنتجات مع خيارات تخصيص متقدمة",
    icon: QrCode,
    color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600",
    link: "/dashboard/inventory/print/barcode",
  },
  {
    id: "transaction",
    title: "سندات الحركة",
    description: "طباعة سندات الإستلام والصرف والتحويل مع تخصيص كامل",
    icon: FileText,
    color: "bg-green-50 dark:bg-green-950/20 text-green-600",
    link: "/dashboard/inventory/print/transaction",
  },
  {
    id: "report",
    title: "التقارير",
    description: "طباعة تقارير المخزون المفصلة مع رسوم بيانية",
    icon: Printer,
    color: "bg-purple-50 dark:bg-purple-950/20 text-purple-600",
    link: "/dashboard/inventory/print/report",
  },
  {
    id: "labels",
    title: "اللاصقات المخصصة",
    description: "تصميم وطباعة لاصقات المنتجات بمقاسات متعددة",
    icon: Tags,
    color: "bg-orange-50 dark:bg-orange-950/20 text-orange-600",
    link: "/dashboard/inventory/print/labels",
  },
];

const features = [
  {
    title: "قوالب جاهزة",
    description: "مكتبة شاملة من القوالب الجاهزة للاستخدام الفوري",
    icon: Layers,
  },
  {
    title: "تخصيص كامل",
    description: "تحكم كامل في التصميم والألوان والخطوط",
    icon: Settings,
  },
  {
    title: "تصدير متعدد",
    description: "تصدير إلى PDF، صور، أو طباعة مباشرة",
    icon: Download,
  },
];

export default function PrintSystemPage() {
  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Printer className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">نظام الطباعة المخصص</h1>
            <p className="text-muted-foreground">حلول طباعة متكاملة للمخزون</p>
          </div>
        </div>
      </div>

      {/* أقسام الطباعة */}
      <div className="grid gap-4 md:grid-cols-2">
        {printSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Link key={section.id} href={section.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* الميزات */}
      <Card>
        <CardHeader>
          <CardTitle>ميزات نظام الطباعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">{feature.title}</div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* نصائح سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                استخدم القوالب الجاهزة لتوفير الوقت والحصول على نتائج احترافية
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>احفظ القوالب المخصصة لإعادة استخدامها في المستقبل</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                تأكد من إعدادات الطابعة قبل الطباعة للحصول على أفضل جودة
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>يمكنك تصدير التصاميم بصيغة PDF لمشاركتها أو حفظها</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
