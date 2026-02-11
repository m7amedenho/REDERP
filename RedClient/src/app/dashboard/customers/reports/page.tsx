// src/app/customers/reports/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IconReportAnalytics, IconFileText, IconFileSpreadsheet, IconSettings, IconFilter } from "@tabler/icons-react";
import { generateReport, exportReport } from "./actions";
import { useState } from "react";
import { ReportFilter } from "./schema";

// صفحة المكون
export default function CustomersReportsPage() {
  const [reportType, setReportType] = useState<ReportFilter['reportType']>("مديونية");
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerateReport = async () => {
    const filters: ReportFilter = {
        reportType,
        // يمكن إضافة المزيد من الفلاتر بناءً على الـ reportType
    };
    const result = await generateReport(filters);
    if (result.success) {
        setReportData(result.report);
    }
  };

  const handleExport = (format: "PDF" | "Excel") => {
    if (reportData) {
        exportReport(format, reportData);
        alert(`جاري تصدير التقرير ${reportData.title} بصيغة ${format}`);
    } else {
        alert("يرجى إنشاء التقرير أولاً.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">تقارير العملاء (Customers Reports)</h1>
      <p className="text-sm text-muted-foreground">صفحة لإنشاء وتصدير تقارير العملاء.</p>
      
      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconSettings className="h-5 w-5 ml-2" />
            Report Builder - مُنشئ التقارير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex space-x-4 items-end">
                {/* اختيار نوع التقرير */}
                <div className="flex-1">
                    <label className="text-sm font-medium">نوع التقرير</label>
                    <Select value={reportType} onValueChange={setReportType as (value: string) => void}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="اختر نوع التقرير" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="مديونية">تقرير مديونية</SelectItem>
                            <SelectItem value="بيع_حسب_العميل">تقرير البيع حسب العميل</SelectItem>
                            <SelectItem value="نشاط_شهري">تقرير النشاط الشهري</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* فلاتر إضافية (Placeholder) */}
                <div className="flex-1">
                    <label className="text-sm font-medium">العميل / المندوب / التاريخ (Filter)</label>
                    <Input placeholder="أدخل فلتر" className="mt-1" />
                </div>

                {/* زر إنشاء التقرير */}
                <Button onClick={handleGenerateReport} className="h-10">
                    <IconFilter className="h-4 w-4 ml-2" />
                    إنشاء التقرير
                </Button>
            </div>
            
            {/* أزرار التصدير */}
            <div className="flex space-x-2 pt-2">
                <Button 
                    variant="outline" 
                    onClick={() => handleExport("PDF")} 
                    disabled={!reportData}
                >
                    <IconFileText className="h-4 w-4 ml-2" />
                    تصدير PDF
                </Button>
                <Button 
                    variant="outline" 
                    onClick={() => handleExport("Excel")}
                    disabled={!reportData}
                >
                    <IconFileSpreadsheet className="h-4 w-4 ml-2" />
                    تصدير Excel
                </Button>
            </div>
        </CardContent>
      </Card>

      {/* منطقة عرض التقرير */}
      <Card>
        <CardHeader>
          <CardTitle>عرض التقرير - {reportData?.title || 'لا يوجد تقرير محدد'}</CardTitle>
        </CardHeader>
        <CardContent>
            {reportData ? (
                <div className="space-y-2">
                    {reportData.data.map((item: any) => (
                        <p key={item.id} className="text-sm">
                            {item.metric}: <span className="font-semibold">{item.value.toLocaleString()}</span>
                        </p>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    يرجى تحديد نوع التقرير والنقر على "إنشاء التقرير" لعرض البيانات هنا.
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}