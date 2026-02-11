// types/rep-debts-reports.ts
export type RepDebt = {
  id: string;
  repId: string;
  repName: string;
  repImage: string;
  department: string;
  totalDebt: number;
  currentMonthDebt: number;
  overdueDebt: number;
  lastCollectionDate: string;
  debtAge: number; // عدد الأيام منذ آخر تحصيل
  status: "منخفض" | "متوسط" | "مرتفع" | "حرج";
  clients: ClientDebt[];
};

export type ClientDebt = {
  id: string;
  clientName: string;
  clientPhone: string;
  totalDebt: number;
  currentDebt: number;
  overdueAmount: number;
  lastPaymentDate: string;
  debtAge: number;
  paymentHistory: PaymentRecord[];
};

export type PaymentRecord = {
  id: string;
  date: string;
  amount: number;
  type: "تحصيل" | "خصم" | "تسوية";
  notes?: string;
};


export type ProductSales = {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  percentage: number;
};

export type DailyActivity = {
  date: string;
  sales: number;
  collections: number;
  visits: number;
  newClients: number;
};

// types/rep-debts-reports.ts
export type RepReport = {
  id: string;
  repId: string;
  repName: string;
  repImage: string;
  period: "يومي" | "أسبوعي" | "شهري" | "سنوي";
  startDate: string;
  endDate: string;
  totalSales: number;
  totalCollections: number;
  totalExpenses: number;
  netIncome: number;
  newClients: number;
  visitsCount: number;
  ordersCount: number;
  performanceScore: number;
  debtStatus: {
    initialDebt: number;
    currentDebt: number;
    collectedAmount: number;
  };
  salesByProduct: ProductSales[];
  dailyActivities: DailyActivity[];
  // البيانات الجديدة
  customerReviews: CustomerReview[];
  gifts: Gift[];
  returns: ReturnItem[];
  problems: Problem[];
};

export type CustomerReview = {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  type: "إيجابي" | "سلبي" | "مقترح";
  repResponse?: string;
};

export type Gift = {
  id: string;
  clientName: string;
  giftType: string;
  value: number;
  date: string;
  reason: string;
  approved: boolean;
};

export type ReturnItem = {
  id: string;
  productName: string;
  clientName: string;
  quantity: number;
  amount: number;
  date: string;
  reason: string;
  status: "معلق" | "معتمد" | "مرفوض";
};

export type Problem = {
  id: string;
  type: "تأخير" | "جودة" | "خدمة" | "سعر" | "أخرى";
  description: string;
  clientName: string;
  date: string;
  status: "مفتوح" | "معلق" | "مغلق";
  solution?: string;
};