// src/app/customers/customers-debts/actions.ts
"use server";

import { CustomerDebt } from "./schema";

export async function getCustomerDebts(): Promise<CustomerDebt[]> {
    // دالة وهمية للحصول على مديونيات العملاء
    return [
        { id: "D001", customerName: "شركة الأمل", totalDebt: 75000, overdueAmount: 10000, region: "المنطقة أ", delegate: "أحمد", status: "متأخر" },
        { id: "D002", customerName: "مزرعة الهدى", totalDebt: 50000, overdueAmount: 0, region: "المنطقة ب", delegate: "فاطمة", status: "في الموعد" },
        { id: "D003", customerName: "مستلزمات الزراعة الحديثة", totalDebt: 5000, overdueAmount: 5000, region: "المنطقة ج", delegate: "أحمد", status: "متأخر جداً" },
    ];
}