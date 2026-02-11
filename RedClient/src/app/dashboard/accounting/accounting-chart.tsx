"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { AccountingTransaction } from "@/lib/dummy-accounting-data";

// Function to aggregate transactions by month
function aggregateMonthlyData(transactions: AccountingTransaction[]) {
  const monthlyMap = transactions.reduce((acc, transaction) => {
    const month = transaction.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  // Convert map to array and sort by month
  return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
}

const chartConfig = {
  income: {
    label: "الإيرادات (Income)",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "المصروفات (Expense)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AccountingChart({ transactions }: { transactions: AccountingTransaction[] }) {
  const chartData = aggregateMonthlyData(transactions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>الأداء المالي الشهري</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleString('ar-EG', { month: 'short', year: '2-digit' })}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const date = new Date(label);
                  const formattedLabel = date.toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-sm font-bold">{formattedLabel}</div>
                      {payload.map((item) => (
                        <div key={item.name} className="flex justify-between gap-4">
                          <span className="text-muted-foreground" style={{ color: item.color }}>
                            {chartConfig[item.dataKey as keyof typeof chartConfig]?.label}
                          </span>
                          <span className="font-bold">{item.value?.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}