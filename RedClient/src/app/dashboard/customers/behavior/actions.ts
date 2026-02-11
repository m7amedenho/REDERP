// src/app/customers/behavior/actions.ts
"use server";

import { RFMMetric } from "./schema";

export async function getRFMAnalysis(): Promise<RFMMetric[]> {
    // دالة وهمية للحصول على تحليل RFM
    return [
        { customerId: "C101", customerName: "شركة الأمل", Recency: 15, Frequency: 12, Monetary: 150000, prediction: "نشط جداً", recommendation: "تقديم عروض خاصة" },
        { customerId: "C102", customerName: "مزرعة الهدى", Recency: 90, Frequency: 5, Monetary: 45000, prediction: "معرض للخسارة", recommendation: "متابعة شخصية من المندوب" },
        { customerId: "C103", customerName: "مستلزمات الزراعة الحديثة", Recency: 300, Frequency: 1, Monetary: 5000, prediction: "خامل", recommendation: "إعادة تنشيط عبر التسويق" },
    ];
}