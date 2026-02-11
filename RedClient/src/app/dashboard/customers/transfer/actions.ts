// src/app/customers/transfer/actions.ts
"use server";

import { CustomerTransfer } from "./schema";

export async function transferCustomers(customerIds: string[], newDelegateId: string) {
  console.log(`Transferring ${customerIds.length} customers to delegate ${newDelegateId}`);
  // منطق تحويل العملاء
  return { success: true, message: "تم تحويل العملاء بنجاح" };
}

export async function getTransferLog(): Promise<CustomerTransfer[]> {
    // دالة وهمية للحصول على سجل التحويلات
    return [
        { customerId: "C105", customerName: "شركة النيل", currentDelegateId: "D001", newDelegateId: "D002", transferDate: "2025-11-20" },
        { customerId: "C106", customerName: "مؤسسة الضياء", currentDelegateId: "D003", newDelegateId: "D001", transferDate: "2025-10-15" },
    ];
}