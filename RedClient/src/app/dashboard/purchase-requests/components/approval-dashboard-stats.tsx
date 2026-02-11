// components/approval-dashboard-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "../types/approval";
import { IconTrendingUp, IconTrendingDown, IconClock, IconAlertCircle, IconSatellite } from "@tabler/icons-react";

interface ApprovalDashboardStatsProps {
  stats: DashboardStats;
}

export function ApprovalDashboardStats({ stats }: ApprovalDashboardStatsProps) {
  const statCards = [
    {
      title: "طلبات جديدة",
      value: stats.newRequests,
      icon: IconAlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "قيد المراجعة",
      value: stats.underReview,
      icon: IconClock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "معتمدة هذا الشهر",
      value: stats.approvedThisMonth,
      icon: IconTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "مرفوضة هذا الشهر",
      value: stats.rejectedThisMonth,
      icon: IconTrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "إجمالي المبالغ المطلوبة",
      value: `${(stats.totalAmountPending / 1000).toFixed(1)}K`,
      description: "ج.م",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <IconSatellite className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}