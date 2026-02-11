// =============================================
// أنواع البيانات الشاملة لموديول المبيعات
// =============================================

// =============================================
// العملاء
// =============================================

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string; // مثلاً: "30 يوم", "نقدي"
  customerType: "individual" | "company";
  customerCategory: "A" | "B" | "C";
  salesRepId: string;
  salesRepName?: string;
  status: "active" | "suspended" | "blocked";
  registrationDate: string;
  lastPurchaseDate?: string;
  totalPurchases: number;
  notes?: string;
  taxNumber?: string;
  commercialRegister?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================
// الفواتير
// =============================================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  invoiceType: "cash" | "credit";
  responsibility: "salesman" | "company";
  dueDate?: string;
  salesRepId: string;
  salesRepName: string;
  warehouseId: string;
  warehouseName: string;
  invoiceDate: string;
  createdAt: string;
  items: InvoiceItem[];
  payments: Payment[];
  discounts: Discount[];
  taxes: Tax[];
  notes?: string;
  printCount: number;
  status: "draft" | "confirmed" | "cancelled";
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  barcode?: string;
  lotNumber?: string;
  expiryDate?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: "percentage" | "fixed";
  tax: number;
  taxRate: number;
  total: number;
  warehouseId: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: "cash" | "card" | "transfer" | "check" | "credit";
  paymentDate: string;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  appliedTo: "total" | "item";
  itemId?: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  amount: number;
  appliedTo: "total" | "item";
  itemId?: string;
}

// =============================================
// المرتجعات
// =============================================

export interface SalesReturn {
  id: string;
  returnNumber: string;
  originalInvoiceId: string;
  originalInvoiceNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  refundAmount: number;
  returnReason: string;
  returnType: "replacement" | "refund" | "credit";
  status: "completed" | "pending" | "rejected";
  returnDate: string;
  approvedBy?: string;
  approvedAt?: string;
  items: ReturnItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ReturnItem {
  id: string;
  invoiceItemId: string;
  productId: string;
  productName: string;
  productCode: string;
  lotNumber?: string;
  quantity: number;
  returnedQuantity: number;
  unitPrice: number;
  reason: string;
  condition: "excellent" | "good" | "damaged" | "expired";
  action: "restock" | "dispose" | "repair";
}

// =============================================
// الضمانات
// =============================================

export interface Warranty {
  id: string;
  warrantyNumber: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: "active" | "expired" | "used" | "cancelled";
  terms: string;
  coverage: string[];
  exclusions?: string[];
  maintenanceSchedule?: MaintenanceSchedule[];
  serviceHistory: ServiceRecord[];
  createdAt: string;
}

export interface MaintenanceSchedule {
  id: string;
  dueDate: string;
  type: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface ServiceRecord {
  id: string;
  warrantyId: string;
  serviceDate: string;
  serviceType: string;
  description: string;
  technician: string;
  cost: number;
  coveredByWarranty: boolean;
  parts?: string[];
  notes?: string;
}

// =============================================
// نظام الائتمان
// =============================================

export interface CreditLimit {
  id: string;
  customerId: string;
  customerName: string;
  currentLimit: number;
  usedLimit: number;
  availableLimit: number;
  overdueDays: number;
  overdueAmount: number;
  paymentTerms: string;
  creditScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  lastReviewDate: string;
  nextReviewDate: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  history: CreditLimitHistory[];
}

export interface CreditLimitHistory {
  id: string;
  customerId: string;
  previousLimit: number;
  newLimit: number;
  changeReason: string;
  changedBy: string;
  changedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface CustomerDebt {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueDays: number;
  status: "current" | "overdue" | "critical";
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentPlan?: PaymentPlan;
}

export interface PaymentPlan {
  id: string;
  debtId: string;
  installments: Installment[];
  totalInstallments: number;
  paidInstallments: number;
  status: "active" | "completed" | "defaulted";
}

export interface Installment {
  id: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "paid" | "overdue";
  paidAt?: string;
}

// =============================================
// نظام الموافقات
// =============================================

export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  type:
    | "credit_limit_exceeded"
    | "invoice_above_limit"
    | "limit_adjustment"
    | "large_discount"
    | "return_approval";
  customerId: string;
  customerName: string;
  amount: number;
  currentLimit?: number;
  requestedLimit?: number;
  reason: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "rejected" | "cancelled";
  workflow: ApprovalStep[];
  metadata?: any;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  role:
    | "area_manager"
    | "account_manager"
    | "company_manager"
    | "finance_director";
  roleName: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  assignedTo?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
  required: boolean;
}

// =============================================
// نظام نقاط البيع (POS)
// =============================================

export interface POSSession {
  id: string;
  sessionNumber: string;
  salesRepId: string;
  salesRepName: string;
  warehouseId: string;
  warehouseName: string;
  startTime: string;
  endTime?: string;
  openingBalance: number;
  closingBalance?: number;
  expectedBalance?: number;
  difference?: number;
  totalSales: number;
  totalReturns: number;
  totalInvoices: number;
  cashAmount: number;
  cardAmount: number;
  transferAmount: number;
  creditAmount: number;
  status: "active" | "closed" | "reconciled";
  reconciliationNotes?: string;
  closedBy?: string;
  closedAt?: string;
}

export interface POSCart {
  id: string;
  sessionId?: string;
  customerId?: string;
  customerName?: string;
  items: POSItem[];
  subtotal: number;
  discounts: Discount[];
  discountAmount: number;
  taxes: Tax[];
  taxAmount: number;
  totalAmount: number;
  paymentMethod?: "cash" | "card" | "transfer" | "check" | "credit";
  paidAmount?: number;
  changeAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface POSItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  barcode?: string;
  category: string;
  image?: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  unitPrice: number;
  originalPrice: number;
  discount: number;
  discountType: "percentage" | "fixed";
  tax: number;
  taxRate: number;
  total: number;
  lotNumber?: string;
  expiryDate?: string;
  warehouseId: string;
  notes?: string;
}

export interface QuickSale {
  barcode: string;
  quantity: number;
  customerId?: string;
  paymentMethod: "cash" | "card";
  cashReceived?: number;
}

// =============================================
// التقارير
// =============================================

export interface SalesReport {
  id: string;
  reportType: "daily" | "weekly" | "monthly" | "custom";
  startDate: string;
  endDate: string;
  totalSales: number;
  totalInvoices: number;
  averageInvoiceValue: number;
  totalReturns: number;
  netSales: number;
  cashSales: number;
  creditSales: number;
  salesByCategory: CategorySales[];
  salesByProduct: ProductSales[];
  salesByCustomer: CustomerSales[];
  salesByRep: RepSales[];
  topProducts: ProductSales[];
  topCustomers: CustomerSales[];
  generatedAt: string;
  generatedBy: string;
}

export interface CategorySales {
  categoryId: string;
  categoryName: string;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
  percentage: number;
}

export interface ProductSales {
  productId: string;
  productName: string;
  productCode: string;
  category: string;
  totalSales: number;
  totalQuantity: number;
  averagePrice: number;
  invoiceCount: number;
  profit?: number;
}

export interface CustomerSales {
  customerId: string;
  customerName: string;
  customerType: string;
  totalSales: number;
  invoiceCount: number;
  averageInvoice: number;
  lastPurchaseDate: string;
  totalDebt: number;
}

export interface RepSales {
  salesRepId: string;
  salesRepName: string;
  totalSales: number;
  invoiceCount: number;
  averageInvoice: number;
  target?: number;
  achievement?: number;
}

export interface DebtReport {
  totalDebt: number;
  currentDebt: number;
  overdueDebt: number;
  criticalDebt: number;
  customerCount: number;
  overdueCustomers: number;
  averageOverdueDays: number;
  expectedCollections: ExpectedCollection[];
  agingAnalysis: AgingBucket[];
  topDebtors: CustomerDebt[];
}

export interface ExpectedCollection {
  date: string;
  amount: number;
  invoiceCount: number;
}

export interface AgingBucket {
  range: string; // "0-30", "31-60", "61-90", "90+"
  count: number;
  amount: number;
  percentage: number;
}

// =============================================
// نظام الطباعة
// =============================================

export interface InvoicePrintTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  companyInfo: {
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
    taxNumber?: string;
    website?: string;
  };
  headerSettings: {
    showLogo: boolean;
    showCompanyInfo: boolean;
    showDate: boolean;
    showInvoiceNumber: boolean;
  };
  itemsSettings: {
    showBarcode: boolean;
    showProductCode: boolean;
    showLotNumber: boolean;
    showDiscount: boolean;
    showTax: boolean;
  };
  footerSettings: {
    showTerms: boolean;
    showSignature: boolean;
    showNotes: boolean;
    showQRCode: boolean;
  };
  customFields: CustomField[];
  termsAndConditions?: string;
  notes?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  position: "header" | "footer" | "items";
  order: number;
}

// =============================================
// الإحصائيات
// =============================================

export interface SalesDashboardStats {
  today: {
    sales: number;
    invoices: number;
    returns: number;
    netSales: number;
  };
  thisWeek: {
    sales: number;
    invoices: number;
    averageInvoice: number;
    growth: number;
  };
  thisMonth: {
    sales: number;
    invoices: number;
    target: number;
    achievement: number;
  };
  topProducts: ProductSales[];
  topCustomers: CustomerSales[];
  pendingApprovals: number;
  criticalDebts: number;
  overdueInvoices: number;
  lowCreditCustomers: number;
}

// =============================================
// النشاط والسجلات
// =============================================

export interface SalesActivity {
  id: string;
  type:
    | "invoice_created"
    | "payment_received"
    | "return_processed"
    | "credit_approved"
    | "warranty_issued";
  userId: string;
  userName: string;
  entityId: string;
  entityType: "invoice" | "payment" | "return" | "customer" | "warranty";
  description: string;
  metadata?: any;
  timestamp: string;
}

// =============================================
// الإشعارات
// =============================================

export interface SalesNotification {
  id: string;
  type:
    | "payment_due"
    | "credit_limit_exceeded"
    | "approval_required"
    | "debt_overdue"
    | "warranty_expiring";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  customerId?: string;
  invoiceId?: string;
  approvalId?: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

// =============================================
// إعدادات المبيعات
// =============================================

export interface SalesSettings {
  id: string;
  invoicePrefix: string;
  invoiceStartNumber: number;
  returnPrefix: string;
  warrantyPrefix: string;
  defaultPaymentTerms: string;
  defaultCreditLimit: number;
  autoApprovalLimit: number;
  maxDiscountPercentage: number;
  taxRate: number;
  allowNegativeStock: boolean;
  requireLotNumber: boolean;
  printInvoiceAfterSale: boolean;
  sendEmailReceipt: boolean;
  defaultWarrantyMonths: number;
  creditScoreThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  approvalWorkflow: {
    creditLimitExceeded: string[];
    invoiceAboveLimit: string[];
    limitAdjustment: string[];
    largeDiscount: string[];
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
