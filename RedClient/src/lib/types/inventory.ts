// أنواع البيانات الأساسية لنظام المخزون

// الصنف الأساسي
export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  baseUnit: string;
  supportsBarcode: boolean;
  supportsExpiry: boolean;
  supportsLot: boolean;
  hasMultipleUnits: boolean;
  status: "نشط" | "غير نشط";
  currentStock: number;
  minStock: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
  units?: ItemUnit[];
}

// وحدة الصنف
export interface ItemUnit {
  unit: string;
  purchase: number;
  wholesale: number;
  half: number;
  retail: number;
  usd: number;
}

// المخزن
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  type: "رئيسي" | "فرعي" | "معرض" | "مرتجع";
  capacity: number;
  currentStock: number;
  utilization: number;
  itemCount: number;
  allowedUsers: string[];
  status: "نشط" | "غير نشط" | "صيانة";
  createdAt: string;
  updatedAt: string;
  sections?: WarehouseSection[];
}

// قسم المخزن
export interface WarehouseSection {
  id: string;
  name: string;
  capacity: number;
  currentStock: number;
  utilization: number;
}

// الحركة
export interface Transaction {
  id: string;
  type: "وارد" | "صادر" | "تحويل" | "تسوية";
  date: string;
  time: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
  userId: string;
  userName: string;
  status: "مكتمل" | "معلق" | "ملغي";
  createdAt: string;
}

// نظام التتبع المتقدم
export interface ProductTracking {
  id: string;
  productId: string;
  barcode: string;
  lotNumber?: string;
  currentLocation: {
    warehouseId: string;
    warehouseName: string;
    section?: string;
    shelf?: string;
    position?: string;
  };
  status: "في المخزن" | "في التوزيع" | "مباع" | "مرتجع" | "تالف";
  timeline: TrackingEvent[];
  performance: {
    storageDuration: number;
    turnoverRate: number;
    movementFrequency: number;
    utilizationRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

// حدث التتبع
export interface TrackingEvent {
  id: string;
  timestamp: string;
  type: "استلام" | "تحويل" | "بيع" | "مرتجع" | "تسوية" | "فحص";
  fromLocation?: string;
  toLocation?: string;
  quantity: number;
  unit: string;
  userId: string;
  userName: string;
  notes?: string;
  duration?: number; // مدة التخزين بالأيام
  condition?: "ممتاز" | "جيد" | "متوسط" | "سيء";
}

// اللوط
export interface Lot {
  id: string;
  lotNumber: string;
  itemId: string;
  itemName: string;
  productionDate: string;
  expiryDate: string;
  initialQuantity: number;
  currentQuantity: number;
  unit: string;
  supplier: string;
  batchNumber?: string;
  certificate?: string;
  status: "نشط" | "منتهي" | "مستنفد";
  location: {
    warehouseId: string;
    warehouseName: string;
    section?: string;
  };
  movements: LotMovement[];
  createdAt: string;
}

// حركة اللوط
export interface LotMovement {
  id: string;
  lotId: string;
  type: "وارد" | "صادر" | "تحويل";
  date: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  userId: string;
  notes?: string;
}

// نظام الطباعة
export interface PrintTemplate {
  id: string;
  name: string;
  type: "barcode" | "transaction" | "report" | "label";
  layout: PrintLayout;
  settings: PrintSettings;
  fields: PrintField[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// تخطيط الطباعة
export interface PrintLayout {
  pageSize: "A4" | "A5" | "label" | "custom";
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: PrintSection;
  footer: PrintSection;
  body: PrintSection;
  customSize?: {
    width: number;
    height: number;
  };
}

// قسم الطباعة
export interface PrintSection {
  enabled: boolean;
  height: number;
  content: PrintElement[];
}

// عنصر الطباعة
export interface PrintElement {
  id: string;
  type: "text" | "barcode" | "image" | "table" | "line" | "rectangle";
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content: any;
  style: PrintStyle;
}

// إعدادات الطباعة
export interface PrintSettings {
  copies: number;
  collate: boolean;
  duplex: boolean;
  color: boolean;
  quality: "draft" | "normal" | "high";
  paperSource: string;
  scale: number;
}

// أسلوب الطباعة
export interface PrintStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  color?: string;
  backgroundColor?: string;
  border?: {
    width: number;
    style: "solid" | "dashed" | "dotted";
    color: string;
  };
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
}

// حقل الطباعة
export interface PrintField {
  id: string;
  name: string;
  type: "text" | "barcode" | "image" | "table" | "chart";
  dataSource: string; // مسار البيانات في الكائن
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: PrintStyle;
  format?: string; // تنسيق خاص للبيانات
  barcodeType?: "code128" | "code39" | "ean13" | "qr";
}

// التقارير
export interface Report {
  id: string;
  name: string;
  type: "stock_balance" | "stock_movements" | "low_stock" | "expiry" | "custom";
  description: string;
  filters: ReportFilter[];
  columns: ReportColumn[];
  groupBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// فلتر التقرير
export interface ReportFilter {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "between"
    | "in";
  value: any;
  label: string;
}

// عمود التقرير
export interface ReportColumn {
  field: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: string;
  aggregate?: "sum" | "avg" | "count" | "min" | "max";
}

// إعدادات التقرير
export interface ReportSettings {
  title: string;
  subtitle?: string;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  pageOrientation: "portrait" | "landscape";
  pageSize: "A4" | "A5" | "letter";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// التنبيهات
export interface InventoryAlert {
  id: string;
  type: "low_stock" | "expiring" | "overstock" | "stalled" | "transfer_request";
  priority: "low" | "medium" | "high" | "critical";
  itemId?: string;
  itemName?: string;
  warehouseId?: string;
  warehouseName?: string;
  message: string;
  description?: string;
  threshold?: number;
  currentValue?: number;
  expiryDate?: string;
  daysRemaining?: number;
  suggestedAction?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

// إعدادات المخزون
export interface InventorySettings {
  id: string;
  lowStockThreshold: number; // نسبة مئوية
  expiryWarningDays: number;
  autoReorderEnabled: boolean;
  reorderPoint: number;
  maxStockLevel: number;
  defaultWarehouse: string;
  barcodePrefix: string;
  lotPrefix: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  currency: string;
  language: string;
}

// مورد
export interface Supplier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  categories: string[]; // فئات المنتجات التي يوفرها
  leadTime: number; // متوسط وقت التسليم بالأيام
  paymentTerms: string;
  creditLimit: number;
  rating: number; // من 1 إلى 5
  status: "نشط" | "غير نشط" | "محظور";
  contracts: SupplierContract[];
  createdAt: string;
  updatedAt: string;
}

// عقد المورد
export interface SupplierContract {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  items: ContractItem[];
  terms: string;
  status: "نشط" | "منتهي" | "ملغي";
}

// صنف في العقد
export interface ContractItem {
  itemId: string;
  itemName: string;
  unitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  leadTime: number;
}

// طلب توريد
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  orderDate: string;
  expectedDate: string;
  status: "مسودة" | "معتمد" | "مرسل" | "مستلم جزئياً" | "مستلم كاملاً" | "ملغي";
  totalValue: number;
  currency: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// صنف في طلب التوريد
export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  notes?: string;
}

// فاتورة شراء
export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  purchaseOrderId?: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseInvoiceItem[];
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "مسودة" | "معتمد" | "مدفوع" | "ملغي";
  paymentStatus: "غير مدفوع" | "مدفوع جزئياً" | "مدفوع كاملاً";
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// صنف في فاتورة الشراء
export interface PurchaseInvoiceItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
}

// عميل
export interface Customer {
  id: string;
  name: string;
  type: "فردي" | "شركة" | "مؤسسة";
  contact: {
    phone: string;
    email?: string;
    address: string;
  };
  creditLimit: number;
  paymentTerms: string;
  discountRate: number;
  status: "نشط" | "غير نشط" | "محظور";
  salesHistory: CustomerSalesHistory[];
  createdAt: string;
  updatedAt: string;
}

// تاريخ مبيعات العميل
export interface CustomerSalesHistory {
  year: number;
  month: number;
  totalSales: number;
  totalInvoices: number;
  averageOrder: number;
}

// فاتورة مبيعات
export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: SalesInvoiceItem[];
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "مسودة" | "معتمد" | "مرسل" | "مدفوع" | "ملغي";
  paymentStatus: "غير مدفوع" | "مدفوع جزئياً" | "مدفوع كاملاً";
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// صنف في فاتورة المبيعات
export interface SalesInvoiceItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
}

// إعدادات النظام
export interface SystemSettings {
  company: {
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    taxNumber?: string;
  };
  inventory: InventorySettings;
  notifications: {
    email: {
      enabled: boolean;
      smtp: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: "none" | "ssl" | "tls";
      };
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey?: string;
    };
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    sessionTimeout: number; // بالدقائق
    twoFactorAuth: boolean;
  };
  integrations: {
    odoo?: {
      enabled: boolean;
      url: string;
      database: string;
      username: string;
      password: string;
    };
    accounting?: {
      enabled: boolean;
      provider: string;
      apiKey?: string;
    };
  };
}

// إحصائيات لوحة التحكم
export interface DashboardStats {
  totalItems: number;
  totalWarehouses: number;
  totalValue: number;
  lowStockItems: number;
  expiringItems: number;
  monthlyInbound: number;
  monthlyOutbound: number;
  monthlyTurnover: number;
  activeTransactions: number;
  pendingTransfers: number;
  alertsCount: number;
}

// فلتر البحث المتقدم
export interface SearchFilter {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "between"
    | "in";
  value: any;
  label: string;
}

// نتيجة البحث
export interface SearchResult {
  total: number;
  page: number;
  pageSize: number;
  results: any[];
  facets?: {
    categories: { [key: string]: number };
    warehouses: { [key: string]: number };
    statuses: { [key: string]: number };
  };
}

// إعدادات التصدير
export interface ExportSettings {
  format: "excel" | "csv" | "pdf" | "json";
  columns: string[];
  filters?: SearchFilter[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeHeaders: boolean;
  filename?: string;
}

// مهمة التصدير
export interface ExportJob {
  id: string;
  type: "export" | "report" | "backup";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  settings: ExportSettings;
  result?: {
    url: string;
    size: number;
    expiresAt: string;
  };
  error?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

// نسخة احتياطية
export interface Backup {
  id: string;
  name: string;
  type: "full" | "incremental";
  status: "pending" | "running" | "completed" | "failed";
  size: number;
  filePath: string;
  checksum: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

// سجل النشاط
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// إعدادات المستخدم
export interface UserPreferences {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  dashboard: {
    defaultView: string;
    widgets: string[];
    layout: "grid" | "list";
  };
  notifications: {
    email: boolean;
    push: boolean;
    alerts: string[];
  };
  table: {
    pageSize: number;
    density: "compact" | "normal" | "comfortable";
  };
  updatedAt: string;
}

// أذونات المستخدم
export interface UserPermission {
  id: string;
  userId: string;
  resource: string;
  actions: string[];
  conditions?: any;
  createdAt: string;
  updatedAt: string;
}

// دور المستخدم
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// خطأ في النظام
export interface SystemError {
  id: string;
  type: "error" | "warning" | "info";
  code: string;
  message: string;
  details?: any;
  stackTrace?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}
