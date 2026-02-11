// components/rep-stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "../components/star-rating";
import { SalesRep } from "../types/sales-rep";
import { 
  IconTrendingUp, 
  IconUsers, 
  IconCash, 
  IconTarget 
} from "@tabler/icons-react";
import Image from "next/image";

interface RepStatsCardProps {
  rep: SalesRep;
}

export function RepStatsCard({ rep }: RepStatsCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "نشط": return "default";
      case "غير نشط": return "secondary";
      case "إجازة": return "outline";
      default: return "secondary";
    }
  };

  const stats = [
    {
      label: "إجمالي المبيعات",
      value: `${(rep.totalSales / 1000).toFixed(1)}K`,
      icon: IconTrendingUp,
      color: "text-green-600",
    },
    {
      label: "عملاء جدد",
      value: rep.newClients.toString(),
      icon: IconUsers,
      color: "text-blue-600",
    },
    {
      label: "معدل التحصيل",
      value: `${rep.collectionRate}%`,
      icon: IconCash,
      color: "text-purple-600",
    },
    {
      label: "تحقيق الهدف",
      value: `${rep.targetAchievement}%`,
      icon: IconTarget,
      color: "text-orange-600",
    },
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={rep.image}
              alt={rep.name}
              className="w-12 h-12 rounded-full object-cover border"
              width={100}
              height={100}
            />
            <div>
              <CardTitle className="text-lg">{rep.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(rep.status)}>
                  {rep.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {rep.department}
                </span>
              </div>
            </div>
          </div>
          <StarRating rating={rep.rating} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* شريط تقدم الأداء */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>مؤشر الأداء</span>
            <span className="font-medium">{rep.performanceScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${rep.performanceScore}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}