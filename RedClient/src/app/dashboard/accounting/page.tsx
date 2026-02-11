import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyTransactions } from "@/lib/dummy-accounting-data";
import { getAccountingAnalysis } from "@/actions/accounting-ai";
import { AccountingChart } from "./accounting-chart";

export default async function AccountingPage() {
  const aiAnalysis = await getAccountingAnalysis(dummyTransactions);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">لوحة تحكم الحسابات (Accounting Dashboard)</h1>

      {/* AI Analysis Card */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>تحليل الأداء المالي</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-lg leading-relaxed" dir="rtl">
            {aiAnalysis}
          </p>
        </CardContent>
      </Card>
      <AccountingChart transactions={dummyTransactions} />
    </div>
  );
}
