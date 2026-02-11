// src/app/customers/dashboard/actions.ts
"use server";

import { DashboardItem } from "./schema";

export async function getDashboardMetrics(): Promise<DashboardItem[]> {
  // دالة وهمية للحصول على مقاييس لوحة العملاء
  return [
    { id: "1", metric: "Total Customers", value: 1500 },
    { id: "2", metric: "Active Customers", value: 950 },
    { id: "3", metric: "Dormant Customers", value: 550 },
    { id: "4", metric: "Leads", value: 210 },
  ];
}