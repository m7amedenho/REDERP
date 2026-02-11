// types/purchase-invoice.ts
export type PurchaseInvoice = {
  id: string;
  invoiceNumber: string;
  employeeName: string;
  totalAmount: number;
  status: "قيد الطلب" | "موافق عليها" | "مرفوضة" | "ملغاة";
  dueDate: string;
  createdAt: string;
  itemsCount: number;
};

export type PurchaseInvoiceItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
};