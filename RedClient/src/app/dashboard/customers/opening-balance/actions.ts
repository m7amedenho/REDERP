// src/app/customers/opening-balance/actions.ts
"use server";

import { OpeningBalance, openingBalanceSchema } from "./schema";

export async function addOpeningBalance(formData: FormData) {
  const data = openingBalanceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!data.success) {
    return { error: data.error.flatten() };
  }

  console.log("Adding opening balance:", data.data);
  // منطق إضافة رصيد أول مدة
  return { success: true };
}

export async function getOpeningBalances(): Promise<OpeningBalance[]> {
    // دالة وهمية للحصول على أرصدة أول المدة
    return [
        { id: "OB001", customerId: "C101", customerName: "شركة الأمل", balanceAmount: 50000, entryDate: "2025-01-01" },
        { id: "OB002", customerId: "C102", customerName: "مزرعة الهدى", balanceAmount: -10000, entryDate: "2025-01-01" }, // دائن
        { id: "OB003", customerId: "C103", customerName: "مستلزمات الزراعة الحديثة", balanceAmount: 0, entryDate: "2025-01-01" },
    ];
}