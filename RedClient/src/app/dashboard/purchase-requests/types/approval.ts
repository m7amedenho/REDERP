// types/approval.ts
export type PurchaseRequestStatus = 
  | "بانتظار الاعتماد" 
  | "تحت المراجعة" 
  | "معتمدة" 
  | "مرفوضة" 
  | "معلقة";

export type PriorityLevel = "عادية" | "عاجلة" | "شديدة العجلة";

export type RejectionReason = 
  | "السعر أعلى من السوق"
  | "عدم توفر الميزانية"
  | "يحتاج موافقة إدارية أعلى"
  | "المعلومات ناقصة"
  | "مخالفة لسياسات الشراء"
  | "بدائل أفضل متوفرة"
  | "أخرى";

export interface PurchaseRequest {
  id: string;
  invoiceNumber: string;
  employeeName: string;
  employeeDepartment: string;
  supplierName: string;
  supplierCategory: string;
  supplierRating: number;
  totalAmount: number;
  status: PurchaseRequestStatus;
  priority: PriorityLevel;
  createdAt: string;
  dueDate: string;
  itemsCount: number;
  items: PurchaseItem[];
  attachments: Attachment[];
  notes?: string;
  urgencyAlert: boolean;
  approvalLevel: number;
  maxApprovalLevel: number;
}

export interface PurchaseItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  currentStock: number;
  suggestedAlternatives: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: "عرض سعر" | "مواصفات" | "صورة" | "مستند";
  url: string;
  uploadDate: string;
}

export interface ApprovalAction {
  id: string;
  requestId: string;
  action: "اعتماد" | "رفض" | "ارجاع" | "تعليق";
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  notes: string;
  rejectionReason?: RejectionReason;
}

export interface DashboardStats {
  newRequests: number;
  underReview: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  totalAmountPending: number;
}