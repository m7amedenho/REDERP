// src/app/customers/followup/actions.ts
"use server";

import { FollowupLog, followupLogSchema } from "./schema";

export async function logFollowup(formData: FormData) {
  const data = followupLogSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!data.success) {
    return { error: data.error.flatten() };
  }

  console.log("Logging new followup:", data.data);
  // منطق تسجيل المتابعة
  return { success: true };
}

export async function getFollowupLogs(): Promise<FollowupLog[]> {
    // دالة وهمية للحصول على سجلات المتابعة
    return [
        { id: "F001", customerId: "C101", customerName: "شركة الأمل", type: "زيارة", notes: "تم عرض المنتجات الجديدة.", followupDate: "2025-12-05", logDate: "2025-11-28", delegate: "أحمد" },
        { id: "F002", customerId: "C102", customerName: "مزرعة الهدى", type: "اتصال", notes: "العميل مهتم بالشتلات.", followupDate: "2025-12-10", logDate: "2025-11-27", delegate: "فاطمة" },
    ];
}