// src/app/customers/behavior/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconChartHistogram, IconBolt, IconMessageReport } from "@tabler/icons-react";
import { RFMMetric } from "./schema";
import { getRFMAnalysis } from "./actions";
import { useEffect, useState } from "react";

// صفحة المكون
export default function CustomerBehaviorAnalyticsPage() {
  const [data, setData] = useState<RFMMetric[]>([]);

  useEffect(() => {
    // دالة للحصول على البيانات في الـ client
    const loadAnalysis = async () => {
      const metrics = await getRFMAnalysis();
      setData(metrics);
    };

    loadAnalysis();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">تحليل سلوك العملاء (Customer Behavior Analytics)</h1>
      <p className="text-sm text-muted-foreground">صفحة ذكاء صناعي ظريفة (RFM).</p>
      
      {/* Graph لتحليل Frequency, Recency, Monetary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconChartHistogram className="h-5 w-5 ml-2" />
            تحليل RFM (Recency, Frequency, Monetary)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
            Graph Area (Charts Placeholder)
          </div>
        </CardContent>
      </Card>

      {/* توقع حركة العميل وتوصيات مندوبين */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconBolt className="h-5 w-5 ml-2" />
            توقعات وتوصيات
          </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>العميل</TableHead>
                        <TableHead>الـ Recency (الأيام)</TableHead>
                        <TableHead>الـ Frequency (العدد)</TableHead>
                        <TableHead>الـ Monetary (القيمة)</TableHead>
                        <TableHead>التوقع</TableHead>
                        <TableHead>توصيات مندوبين</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.customerId}>
                            <TableCell className="font-medium">{item.customerName}</TableCell>
                            <TableCell>{item.Recency}</TableCell>
                            <TableCell>{item.Frequency}</TableCell>
                            <TableCell>{item.Monetary.toLocaleString()}</TableCell>
                            <TableCell>{item.prediction}</TableCell>
                            <TableCell>{item.recommendation}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      {/* Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>مخططات تحليلية أخرى</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
            Additional Charts Area
          </div>
        </CardContent>
      </Card>
    </div>
  );
}