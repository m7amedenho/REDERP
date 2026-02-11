"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { ApprovalWorkflow } from "@/components/sales/ApprovalWorkflow";
import { ApprovalRequest } from "@/lib/types/sales";
import { toast } from "sonner";

// بيانات تجريبية لطلبات الموافقة
const mockApprovals: ApprovalRequest[] = [
  {
    id: "1",
    requestNumber: "APR-001",
    type: "credit_limit_exceeded",
    customerId: "1",
    customerName: "فاطمة السيد",
    amount: 35000,
    currentLimit: 30000,
    reason: "طلب شراء كبير - فاتورة INV-003",
    priority: "urgent",
    status: "pending",
    workflow: [
      {
        id: "1",
        stepNumber: 1,
        role: "area_manager",
        roleName: "مدير المنطقة",
        status: "pending",
        assignedTo: "أحمد محمود",
        required: true,
      },
      {
        id: "2",
        stepNumber: 2,
        role: "account_manager",
        roleName: "مدير الحسابات",
        status: "pending",
        required: true,
      },
      {
        id: "3",
        stepNumber: 3,
        role: "company_manager",
        roleName: "مدير الشركة",
        status: "pending",
        required: false,
      },
    ],
    requestedBy: "علي حسن",
    requestedAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    requestNumber: "APR-002",
    type: "limit_adjustment",
    customerId: "2",
    customerName: "شركة الزراعة الحديثة",
    amount: 100000,
    currentLimit: 100000,
    requestedLimit: 150000,
    reason: "زيادة حجم المشتريات - عميل VIP",
    priority: "high",
    status: "approved",
    workflow: [
      {
        id: "1",
        stepNumber: 1,
        role: "area_manager",
        roleName: "مدير المنطقة",
        status: "approved",
        assignedTo: "أحمد محمود",
        approvedBy: "أحمد محمود",
        approvedAt: "2024-01-14T11:00:00",
        notes: "موافق - عميل ممتاز بتاريخ سداد جيد",
        required: true,
      },
      {
        id: "2",
        stepNumber: 2,
        role: "account_manager",
        roleName: "مدير الحسابات",
        status: "approved",
        assignedTo: "سارة أحمد",
        approvedBy: "سارة أحمد",
        approvedAt: "2024-01-14T14:30:00",
        notes: "موافق - التدفق النقدي ممتاز",
        required: true,
      },
      {
        id: "3",
        stepNumber: 3,
        role: "company_manager",
        roleName: "مدير الشركة",
        status: "approved",
        approvedBy: "محمد الشريف",
        approvedAt: "2024-01-14T16:00:00",
        required: false,
      },
    ],
    requestedBy: "علي حسن",
    requestedAt: "2024-01-14T09:00:00",
    completedAt: "2024-01-14T16:00:00",
  },
  {
    id: "3",
    requestNumber: "APR-003",
    type: "large_discount",
    customerId: "4",
    customerName: "مؤسسة النخيل الزراعية",
    amount: 50000,
    reason: "خصم 15% على طلبية كبيرة - 500 كيس سماد",
    priority: "medium",
    status: "rejected",
    workflow: [
      {
        id: "1",
        stepNumber: 1,
        role: "area_manager",
        roleName: "مدير المنطقة",
        status: "approved",
        assignedTo: "أحمد محمود",
        approvedBy: "أحمد محمود",
        approvedAt: "2024-01-13T10:00:00",
        required: true,
      },
      {
        id: "2",
        stepNumber: 2,
        role: "account_manager",
        roleName: "مدير الحسابات",
        status: "rejected",
        assignedTo: "سارة أحمد",
        approvedBy: "سارة أحمد",
        approvedAt: "2024-01-13T15:00:00",
        rejectionReason: "نسبة الخصم أعلى من المسموح - الحد الأقصى 10%",
        required: true,
      },
    ],
    requestedBy: "علي حسن",
    requestedAt: "2024-01-13T09:00:00",
    completedAt: "2024-01-13T15:00:00",
  },
  {
    id: "4",
    requestNumber: "APR-004",
    type: "invoice_above_limit",
    customerId: "5",
    customerName: "حسن عبد الله",
    amount: 42000,
    currentLimit: 40000,
    reason: "فاتورة INV-005 - تجاوز بسيط",
    priority: "medium",
    status: "pending",
    workflow: [
      {
        id: "1",
        stepNumber: 1,
        role: "area_manager",
        roleName: "مدير المنطقة",
        status: "pending",
        assignedTo: "أحمد محمود",
        required: true,
      },
    ],
    requestedBy: "محمد أحمد",
    requestedAt: "2024-01-15T14:00:00",
  },
];

export default function ApprovalsPage() {
  const [currentUserRole] = useState<string>("area_manager"); // محاكاة دور المستخدم الحالي
  const [selectedTab, setSelectedTab] = useState<string>("pending");

  const handleApprove = (approvalId: string, notes?: string) => {
    console.log("Approve:", approvalId, notes);
    toast.success("تمت الموافقة على الطلب");
    // هنا يتم إرسال الموافقة إلى API
  };

  const handleReject = (approvalId: string, notes?: string) => {
    console.log("Reject:", approvalId, notes);
    toast.error("تم رفض الطلب");
    // هنا يتم إرسال الرفض إلى API
  };

  // فلترة الطلبات حسب التبويب
  const filteredApprovals = mockApprovals.filter((approval) => {
    if (selectedTab === "pending") return approval.status === "pending";
    if (selectedTab === "approved") return approval.status === "approved";
    if (selectedTab === "rejected") return approval.status === "rejected";
    return true;
  });

  // إحصائيات
  const stats = {
    pending: mockApprovals.filter((a) => a.status === "pending").length,
    approved: mockApprovals.filter((a) => a.status === "approved").length,
    rejected: mockApprovals.filter((a) => a.status === "rejected").length,
    urgent: mockApprovals.filter((a) => a.priority === "urgent").length,
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">نظام الموافقات</h1>
            <p className="text-muted-foreground">
              إدارة ومتابعة طلبات الموافقات
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              طلبات تنتظر الموافقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الموافقة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              طلبات موافق عليها
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الرفض</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <p className="text-xs text-muted-foreground mt-1">طلبات مرفوضة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات عاجلة</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.urgent}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              تحتاج اهتمام فوري
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تبويبات الطلبات */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            الكل
            <Badge variant="secondary">{mockApprovals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            قيد المراجعة
            <Badge variant="secondary">{stats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            موافق عليها
            <Badge variant="secondary">{stats.approved}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            مرفوضة
            <Badge variant="secondary">{stats.rejected}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {filteredApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Filter className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                <p className="text-lg text-muted-foreground">
                  لا توجد طلبات في هذه الفئة
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApprovals.map((approval) => (
              <ApprovalWorkflow
                key={approval.id}
                approval={approval}
                currentUserRole={currentUserRole}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
