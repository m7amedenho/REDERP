// في ملف loading.tsx (بجانب ملف page.tsx)

import { Skeleton } from "@/components/ui/skeleton"; // افترض أنك تستخدم shadcn
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AccountingLoading() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">لوحة تحكم الحسابات (Accounting Dashboard)</h1>

      {/* هيكل التحميل لبطاقة التحليل */}
      <Card className="col-span-full">
        <CardHeader>
          {/* <CardTitle>تحليل الأداء المالي</CardTitle> */}
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      
      {/* هيكل التحميل للرسم البياني */}
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}