// types/sales-rep.ts
export type SalesRep = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  image: string;
  status: "نشط" | "غير نشط" | "إجازة";
  rating: number;
  totalSales: number;
  newClients: number;
  collectionRate: number;
  targetAchievement: number;
  performanceScore: number;
  monthlyPerformance: {
    month: string;
    sales: number;
    clients: number;
    collection: number;
  }[];
  recentActivities: {
    id: string;
    type: "بيع" | "متابعة" | "زيارة" | "تحصيل";
    description: string;
    date: string;
    amount?: number;
  }[];
};

export type PerformanceMetrics = {
  totalReps: number;
  activeReps: number;
  averageRating: number;
  totalSales: number;
  totalNewClients: number;
  averageCollectionRate: number;
};

export type DepartmentStats = {
  department: string;
  repsCount: number;
  totalSales: number;
  averageRating: number;
};