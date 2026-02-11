/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/sales-reps/page.tsx
"use client";

import { useState } from "react";
import { SalesRepsTable } from "./components/sales-reps-table";
import { RepStatsCard } from "./components/rep-stats-card";
import { DepartmentStats } from "./components/department-stats";
import { PerformanceChart } from "./components/performance-chart";
import { RepDetailsModal } from "./components/rep-details-modal";
import {
  PerformanceMetrics,
  SalesRep,
  DepartmentStats as DeptStats,
} from "./types/sales-rep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconChartBar,
  IconUsers,
  IconTrendingUp,
  IconCash,
  IconStar,
} from "@tabler/icons-react";
import { BarChart } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { StarRating } from "./components/star-rating";
import Image from "next/image";

// بيانات تجريبية
const mockPerformanceMetrics: PerformanceMetrics = {
  totalReps: 24,
  activeReps: 18,
  averageRating: 4.2,
  totalSales: 1250000,
  totalNewClients: 156,
  averageCollectionRate: 78.5,
};

const mockDepartmentStats: DeptStats[] = [
  {
    department: "مبيعات",
    repsCount: 12,
    totalSales: 850000,
    averageRating: 4.3,
  },
  { department: "تسويق", repsCount: 6, totalSales: 250000, averageRating: 4.1 },
  {
    department: "خدمة عملاء",
    repsCount: 4,
    totalSales: 120000,
    averageRating: 4.4,
  },
  {
    department: "مشتريات",
    repsCount: 2,
    totalSales: 30000,
    averageRating: 4.0,
  },
];

const mockSalesReps: SalesRep[] = [
  {
    id: "1",
    name: "رشاد سعيد",
    email: "..",
    phone: "+20123456789",
    department: "وجه بحري",
    position: "الاسكندرية",
    hireDate: "2022-03-15",
    image: "/reps-rashad.png",
    status: "نشط",
    rating: 4.5,
    totalSales: 250000,
    newClients: 25,
    collectionRate: 85,
    targetAchievement: 95,
    performanceScore: 92,
    monthlyPerformance: [
      { month: "يناير", sales: 22000, clients: 18, collection: 80 },
      { month: "فبراير", sales: 24000, clients: 22, collection: 85 },
      { month: "مارس", sales: 28000, clients: 25, collection: 88 },
    ],
    recentActivities: [
      {
        id: "1",
        type: "بيع",
        description: "بيع منتجات زراعية لعملاء جدد",
        date: "2024-01-15",
        amount: 15000,
      },
      {
        id: "2",
        type: "متابعة",
        description: "متابعة عملاء محتملين في المنطقة",
        date: "2024-01-14",
      },
      {
        id: "3",
        type: "زيارة",
        description: "زيارة مزرعة جديدة في أبو الطامير",
        date: "2024-01-13",
      },
      {
        id: "4",
        type: "تحصيل",
        description: "تحصيل مستحقات من عميل رئيسي",
        date: "2024-01-12",
        amount: 8000,
      },
    ],
  },
  {
    id: "2",
    name: "هاني سعد",
    email: "hany@alex.com",
    phone: "+20123456788",
    department: "وجه قبلى",
    position: "بنى سويفs",
    hireDate: "2023-01-10",
    image: "/reps-hany.png",
    status: "نشط",
    rating: 4.2,
    totalSales: 180000,
    newClients: 32,
    collectionRate: 75,
    targetAchievement: 88,
    performanceScore: 85,
    monthlyPerformance: [
      { month: "يناير", sales: 15000, clients: 25, collection: 72 },
      { month: "فبراير", sales: 17000, clients: 28, collection: 76 },
      { month: "مارس", sales: 19000, clients: 32, collection: 78 },
    ],
    recentActivities: [
      {
        id: "1",
        type: "زيارة",
        description: "زيارة عملاء في بني سويف",
        date: "2024-01-15",
      },
      {
        id: "2",
        type: "تحصيل",
        description: "تحصيل مستحقات من عدة عملاء",
        date: "2024-01-14",
        amount: 12000,
      },
      {
        id: "3",
        type: "بيع",
        description: "توقيع عقد مع عميل جديد",
        date: "2024-01-13",
        amount: 9500,
      },
    ],
  },
];

export default function SalesRepsPage() {
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleView = (rep: SalesRep) => {
    setSelectedRep(rep);
    setModalOpen(true);
  };

  const handleEdit = (rep: SalesRep) => {
    console.log("تعديل المندوب:", rep);
  };

  const handlePerformance = (rep: SalesRep) => {
    console.log("عرض أداء المندوب:", rep);
  };

  const performanceData = selectedRep
    ? selectedRep.monthlyPerformance
    : mockSalesReps[0].monthlyPerformance;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* العنوان والإحصائيات السريعة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">إدارة المندوبين</h1>
          <p className="text-muted-foreground mt-2">
            تقييم ومتابعة أداء فريق المبيعات والتسويق
          </p>
        </div>
        <Button className="gap-2">
          <IconPlus className="h-4 w-4" />
          إضافة مندوب جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المندوبين
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPerformanceMetrics.totalReps}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockPerformanceMetrics.activeReps} نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المبيعات
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockPerformanceMetrics.totalSales / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">ج.م</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحصيل</CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPerformanceMetrics.averageCollectionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <IconStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPerformanceMetrics.averageRating}
            </div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <IconChartBar className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="reps" className="gap-2">
            <IconUsers className="h-4 w-4" />
            جميع المندوبين
          </TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          {/* بطاقات المندوبين */}
          <div dir="rtl">
            <h3 className="text-xl font-bold mb-4">فريق المندوبين</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSalesReps.map((rep) => (
                <RepStatsCard key={rep.id} rep={rep} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* جميع المندوبين */}
        <TabsContent value="reps">
          <div>
            <SalesRepsTable
              data={mockSalesReps}
              onView={handleView}
              onEdit={handleEdit}
              onPerformance={handlePerformance}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* مودال تفاصيل المندوب */}
      <RepDetailsModal
        rep={selectedRep}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}