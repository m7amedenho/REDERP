// src/app/customers/guarantees/actions.ts
"use server";

import { Guarantee, guaranteeSchema } from "./schema";

export async function createGuarantee(formData: FormData) {
  const data = guaranteeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!data.success) {
    return { error: data.error.flatten() };
  }

  console.log("Creating new guarantee:", data.data);
  // منطق إنشاء الضمان
  return { success: true };
}

export async function getGuarantees(): Promise<Guarantee[]> {
    // دالة وهمية للحصول على قائمة الضمانات
    return [
        { id: "G001", customerId: "C101", customerName: "شركة الأمل", type: "شيك", documentNumber: "CHK12345", value: 50000, dueDate: "2026-03-01", status: "فعال" },
        { id: "G002", customerId: "C102", customerName: "مزرعة الهدى", type: "إيصال أمانة", documentNumber: "RPT98765", value: 15000, dueDate: "2025-12-31", status: "منتهي" },
        { id: "G003", customerId: "C103", customerName: "مستلزمات الزراعة الحديثة", type: "شيك", documentNumber: "CHK11111", value: 20000, dueDate: "2026-01-15", status: "مرتجع" },
    ];
}