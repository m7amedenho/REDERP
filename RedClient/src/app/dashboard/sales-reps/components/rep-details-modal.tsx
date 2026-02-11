// components/rep-details-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { SalesRep } from "../types/sales-rep";
import {
  IconX,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconTrendingUp,
  IconUsers,
  IconCash,
  IconTarget,
  IconClock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import Image from "next/image";

interface RepDetailsModalProps {
  rep: SalesRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RepDetailsModal({ rep, open, onOpenChange }: RepDetailsModalProps) {
  if (!rep) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "نشط": return "default";
      case "غير نشط": return "secondary";
      case "إجازة": return "outline";
      default: return "secondary";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "بيع": return <IconTrendingUp className="h-4 w-4 text-green-600" />;
      case "متابعة": return <IconClock className="h-4 w-4 text-blue-600" />;
      case "زيارة": return <IconMapPin className="h-4 w-4 text-orange-600" />;
      case "تحصيل": return <IconCash className="h-4 w-4 text-purple-600" />;
      default: return <IconCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const stats = [
    {
      label: "إجمالي المبيعات",
      value: `${(rep.totalSales / 1000).toFixed(1)}K ج.م`,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>تفاصيل المندوب</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* الصورة والمعلومات الشخصية */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={rep.image || "/api/placeholder/150/150"}
                    alt={rep.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                  <Badge 
                    variant={getStatusVariant(rep.status)}
                    className="absolute bottom-2 right-2"
                  >
                    {rep.status}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold mt-4">{rep.name}</h2>
                <p className="text-muted-foreground">{rep.position}</p>
                
                <div className="mt-4 space-y-2 text-sm items-end">
                  <div className="flex items-center justify-start gap-2">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <span>{rep.email}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                    <span>{rep.phone}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{rep.department}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span>تاريخ التعيين: {rep.hireDate}</span>
                  </div>
                </div>

                {/* التقييم */}
                <div className="mt-4">
                  <StarRating rating={rep.rating} size={20} />
                </div>
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="p-4 border rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      <span className="text-lg font-bold">{stat.value}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* مؤشر الأداء */}
              <div className="mt-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">مؤشر الأداء الشامل</span>
                  <span className="font-bold text-lg">{rep.performanceScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      rep.performanceScore >= 80 ? "bg-green-600" :
                      rep.performanceScore >= 60 ? "bg-yellow-600" : "bg-red-600"
                    }`}
                    style={{ width: `${rep.performanceScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>ضعيف</span>
                  <span>مقبول</span>
                  <span>جيد</span>
                  <span>ممتاز</span>
                </div>
              </div>
            </div>
          </div>

          {/* الأداء الشهري */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">الأداء الشهري</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rep.monthlyPerformance.map((month, index) => (
                <div key={index} className="border rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-primary">{month.month}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>المبيعات:</span>
                      <span className="font-medium">{month.sales.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>العملاء:</span>
                      <span className="font-medium">{month.clients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التحصيل:</span>
                      <span className="font-medium">{month.collection}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* خط سير الأنشطة الحديثة */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">خط سير الأنشطة الحديثة</h3>
            <div className="space-y-4">
              {rep.recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  {/* الخط الزمني */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < rep.recentActivities.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                    )}
                  </div>

                  {/* محتوى النشاط */}
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{activity.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.type} • {activity.date}
                        </p>
                      </div>
                      {activity.amount && (
                        <span className="font-bold text-green-600">
                          {activity.amount.toLocaleString()} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ملخص الأداء */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">نقاط القوة</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-green-600">
                  <IconCheck className="h-4 w-4" />
                  <span>تحقيق الأهداف بانتظام</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <IconCheck className="h-4 w-4" />
                  <span>معدل تحصيل مرتفع</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <IconCheck className="h-4 w-4" />
                  <span>جذب عملاء جدد باستمرار</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">مجالات التحسين</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-orange-600">
                  <IconAlertCircle className="h-4 w-4" />
                  <span>تحسين متابعة العملاء المحتملين</span>
                </li>
                <li className="flex items-center gap-2 text-orange-600">
                  <IconAlertCircle className="h-4 w-4" />
                  <span>زيادة تنوع المنتجات المسوقة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}