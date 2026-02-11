"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  BarChart3,
  Package,
  TrendingUp,
} from "lucide-react";

export default function ReportPrintPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">طباعة التقارير</h1>
            <p className="text-muted-foreground">
              تقارير المخزون المفصلة والرسوم البيانية
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          إعدادات متقدمة
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اختر نوع التقرير</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { icon: Package, label: "جرد المخزون", value: "stock" },
                  {
                    icon: TrendingUp,
                    label: "حركة الوارد/الصادر",
                    value: "movement",
                  },
                  {
                    icon: BarChart3,
                    label: "تقرير الأداء",
                    value: "performance",
                  },
                  { icon: FileText, label: "تقرير مخصص", value: "custom" },
                ].map((report) => {
                  const IconComponent = report.icon;
                  return (
                    <Button
                      key={report.value}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <IconComponent className="w-6 h-6" />
                      <span>{report.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>خيارات التقرير</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>الفترة الزمنية</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">آخر أسبوع</SelectItem>
                      <SelectItem value="month">آخر شهر</SelectItem>
                      <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                      <SelectItem value="year">آخر سنة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المخزن</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المخازن</SelectItem>
                      <SelectItem value="w1">مخزن البذور</SelectItem>
                      <SelectItem value="w2">مخزن المبيدات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>محتويات التقرير</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="charts" defaultChecked />
                    <Label htmlFor="charts">الرسوم البيانية</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tables" defaultChecked />
                    <Label htmlFor="tables">الجداول التفصيلية</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="summary" defaultChecked />
                    <Label htmlFor="summary">الملخص التنفيذي</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="trends" />
                    <Label htmlFor="trends">تحليل الاتجاهات</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2">
                <Printer className="w-4 h-4" />
                طباعة التقرير
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                تحميل PDF
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                تصدير Excel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
