// src/app/customers/leads/actions.ts
"use server";

import { Lead, leadSchema } from "./schema";

export async function createLead(formData: FormData) {
  const data = leadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!data.success) {
    return { error: data.error.flatten() };
  }

  console.log("Creating new lead:", data.data);
  // منطق إنشاء العميل المحتمل
  return { success: true };
}

export async function getLeads(): Promise<Lead[]> {
    // دالة وهمية للحصول على قائمة العملاء المحتملين
    return [
        { id: "L001", name: "شركة الأمل", phone: "01012345678", region: "المنطقة أ", delegate: "أحمد", lastContact: "2025-11-20", interestLevel: "مرتفع", status: "جديد" },
        { id: "L002", name: "مزرعة الهدى", phone: "01198765432", region: "المنطقة ب", delegate: "فاطمة", lastContact: "2025-11-25", interestLevel: "متوسط", status: "تم التواصل" },
        { id: "L003", name: "مستلزمات الزراعة الحديثة", phone: "01255554444", region: "المنطقة ج", delegate: "أحمد", lastContact: "2025-10-01", interestLevel: "منخفض", status: "غير مؤهل" },
    ];
}

export async function convertLeadToCustomer(leadId: string) {
    console.log(`Converting lead ${leadId} to customer...`);
    // منطق تحويل العميل المحتمل إلى عميل
    return { success: true, message: "تم التحويل بنجاح" };
}