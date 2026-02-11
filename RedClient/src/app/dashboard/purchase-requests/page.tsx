/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/approval/purchase-requests/page.tsx
"use client";

import { useState } from "react";
import { ApprovalDashboardStats } from "../purchase-requests/components/approval-dashboard-stats";
import { ApprovalFilters } from "../purchase-requests/components/approval-filters";
import { ApprovalDataTable } from "../purchase-requests/components/approval-data-table";
import { ApprovalDialog } from "../purchase-requests/components/approval-dialog";
import { PurchaseRequest, DashboardStats } from "../purchase-requests/types/approval";

// بيانات تجريبية
const mockStats: DashboardStats = {
  newRequests: 12,
  underReview: 8,
  approvedThisMonth: 45,
  rejectedThisMonth: 7,
  totalAmountPending: 1250000,
};

const mockData: PurchaseRequest[] = [
  {
    id: "1",
    invoiceNumber: "PUR-2024-001",
    employeeName: "أحمد محمد",
    employeeDepartment: "مبيعات",
    supplierName: "مورد الأجهزة الإلكترونية",
    supplierCategory: "إلكترونيات",
    supplierRating: 4.5,
    totalAmount: 15000,
    status: "بانتظار الاعتماد",
    priority: "عاجلة",
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
    itemsCount: 5,
    items: [],
    attachments: [],
    urgencyAlert: true,
    approvalLevel: 1,
    maxApprovalLevel: 3,
  },
  {
    id: "2",
    invoiceNumber: "PUR-2024-002",
    employeeName: "فاطمة علي",
    employeeDepartment: "مشتريات",
    supplierName: "شركة القرطاسية المتحدة",
    supplierCategory: "قرطاسية",
    supplierRating: 4.2,
    totalAmount: 8500,
    status: "تحت المراجعة",
    priority: "عادية",
    createdAt: "2024-01-16",
    dueDate: "2024-03-01",
    itemsCount: 3,
    items: [],
    attachments: [],
    urgencyAlert: false,
    approvalLevel: 2,
    maxApprovalLevel: 3,
  },
  {
    id: "3",
    invoiceNumber: "PUR-2024-003",
    employeeName: "محمد خالد",
    employeeDepartment: "تقنية المعلومات",
    supplierName: "شركة الأثاث الحديث",
    supplierCategory: "أثاث",
    supplierRating: 4.0,
    totalAmount: 25000,
    status: "مرفوضة",
    priority: "عادية",
    createdAt: "2024-01-17",
    dueDate: "2024-02-20",
    itemsCount: 7,
    items: [],
    attachments: [],
    urgencyAlert: false,
    approvalLevel: 1,
    maxApprovalLevel: 3,
  },
];

export default function PurchaseApprovalPage() {
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<PurchaseRequest[]>([]);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const handleView = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    // الانتقال لصفحة التفاصيل
  };

  const handleApprove = (requests: PurchaseRequest[]) => {
    setSelectedRequests(requests);
    setApprovalDialogOpen(true);
  };

  const handleReject = (requests: PurchaseRequest[]) => {
    setSelectedRequests(requests);
    setRejectionDialogOpen(true);
  };

  const handleReturn = (requests: PurchaseRequest[]) => {
    setSelectedRequests(requests);
    setReturnDialogOpen(true);
  };

  const handleAddNote = (request: PurchaseRequest) => {
    console.log("إضافة ملاحظة للطلب:", request);
  };

  const handleSendNotification = (request: PurchaseRequest) => {
    console.log("إرسال إشعار للطلب:", request);
  };

  const handlePrint = (request: PurchaseRequest) => {
    console.log("طباعة الطلب:", request);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // تطبيق الفلترات على البيانات
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* العنوان */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">اعتماد طلبات الشراء</h1>
          <p className="text-muted-foreground mt-2">
            إدارة ومراجعة طلبات الشراء المقدمة من المندوبين
          </p>
        </div>
      </div>

      {/* لوحة الإحصائيات */}
      <ApprovalDashboardStats stats={mockStats} />

      {/* الفلترات */}

      {/* جدول البيانات */}
      <ApprovalDataTable
        data={mockData}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onReturn={handleReturn}
        onAddNote={handleAddNote}
        onSendNotification={handleSendNotification}
        onPrint={handlePrint}
      />

      {/* Dialogs للعمليات */}
      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        requests={selectedRequests}
        onApprove={(notes, conditions) => {
          console.log("اعتماد الطلبات:", selectedRequests, notes, conditions);
          setApprovalDialogOpen(false);
        }}
      />

      
    </div>
  );
}