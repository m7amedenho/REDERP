"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { ApprovalRequest } from "@/lib/types/sales";
import { useState } from "react";
import { toast } from "sonner";

interface ApprovalWorkflowProps {
  approval: ApprovalRequest;
  currentUserRole?: string;
  onApprove?: (approvalId: string, notes?: string) => void;
  onReject?: (approvalId: string, notes?: string) => void;
  readonly?: boolean;
}

export function ApprovalWorkflow({
  approval,
  currentUserRole,
  onApprove,
  onReject,
  readonly = false,
}: ApprovalWorkflowProps) {
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const currentStep = approval.workflow.find(
    (step) => step.status === "pending"
  );
  const canApprove =
    !readonly && currentStep?.role === currentUserRole && onApprove && onReject;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(approval.id, notes);
      toast.success("تمت الموافقة بنجاح");
      setNotes("");
      setShowNotes(false);
    }
  };

  const handleReject = () => {
    if (!notes.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    if (onReject) {
      onReject(approval.id, notes);
      toast.error("تم رفض الطلب");
      setNotes("");
      setShowNotes(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "skipped":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            موافق
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "pending":
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case "cancelled":
        return <Badge variant="outline">ملغي</Badge>;
      default:
        return <Badge variant="secondary">قيد المراجعة</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "credit_limit_exceeded":
        return "تجاوز حد الائتمان";
      case "invoice_above_limit":
        return "فاتورة تتجاوز الحد";
      case "limit_adjustment":
        return "تعديل حد الائتمان";
      case "large_discount":
        return "خصم كبير";
      case "return_approval":
        return "موافقة مرتجع";
      default:
        return type;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "area_manager":
        return "مدير المنطقة";
      case "account_manager":
        return "مدير الحسابات";
      case "company_manager":
        return "مدير الشركة";
      case "finance_director":
        return "مدير المالية";
      default:
        return role;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <span>طلب موافقة #{approval.requestNumber}</span>
              {getStatusBadge(approval.status)}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge className={getPriorityColor(approval.priority)}>
                {approval.priority === "urgent"
                  ? "عاجل"
                  : approval.priority === "high"
                  ? "مرتفع"
                  : approval.priority === "medium"
                  ? "متوسط"
                  : "منخفض"}
              </Badge>
              <span>•</span>
              <span>{getTypeLabel(approval.type)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* معلومات الطلب */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground mb-1">العميل</div>
            <div className="font-medium">{approval.customerName}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">المبلغ</div>
            <div className="font-medium text-lg">
              {approval.amount.toLocaleString()} ج.م
            </div>
          </div>
          {approval.currentLimit !== undefined && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                الحد الحالي
              </div>
              <div className="font-medium">
                {approval.currentLimit.toLocaleString()} ج.م
              </div>
            </div>
          )}
          {approval.requestedLimit !== undefined && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                الحد المطلوب
              </div>
              <div className="font-medium text-primary">
                {approval.requestedLimit.toLocaleString()} ج.م
              </div>
            </div>
          )}
          <div className="col-span-2">
            <div className="text-sm text-muted-foreground mb-1">السبب</div>
            <div className="font-medium">{approval.reason}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              طالب الموافقة
            </div>
            <div className="font-medium">{approval.requestedBy}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              تاريخ الطلب
            </div>
            <div className="font-medium">
              {new Date(approval.requestedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* مسار الموافقة */}
        <div className="space-y-1">
          <h3 className="font-semibold mb-4">مسار الموافقة</h3>
          <div className="space-y-3">
            {approval.workflow.map((step, index) => (
              <div key={step.id}>
                <div
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    step.status === "pending"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                      : step.status === "approved"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : step.status === "rejected"
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : "border-gray-200 bg-gray-50 dark:bg-gray-900/20"
                  }`}
                >
                  <div className="mt-1">{getStatusIcon(step.status)}</div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>
                            {index + 1}. {getRoleLabel(step.role)}
                          </span>
                          {step.required && (
                            <Badge variant="outline" className="text-xs">
                              مطلوب
                            </Badge>
                          )}
                        </div>
                        {step.assignedTo && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            <span>{step.assignedTo}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        {step.status === "approved" && (
                          <Badge variant="default" className="bg-green-600">
                            موافق
                          </Badge>
                        )}
                        {step.status === "rejected" && (
                          <Badge variant="destructive">مرفوض</Badge>
                        )}
                        {step.status === "pending" && (
                          <Badge variant="secondary">قيد المراجعة</Badge>
                        )}
                        {step.status === "skipped" && (
                          <Badge variant="outline">تم التجاوز</Badge>
                        )}
                      </div>
                    </div>

                    {step.approvedBy && (
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>بواسطة: {step.approvedBy}</span>
                          <span>•</span>
                          <span>
                            {new Date(step.approvedAt!).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {(step.notes || step.rejectionReason) && (
                      <div className="flex items-start gap-2 p-2 bg-background rounded text-sm">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          {step.rejectionReason && (
                            <div className="text-red-600 font-medium mb-1">
                              سبب الرفض:
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            {step.rejectionReason || step.notes}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* أزرار الموافقة/الرفض */}
                    {step.status === "pending" && canApprove && (
                      <div className="space-y-3 pt-2">
                        {!showNotes ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleApprove}
                              className="gap-2"
                            >
                              <Check className="h-4 w-4" />
                              موافقة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowNotes(true)}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" />
                              رفض
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowNotes(!showNotes)}
                              className="gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              إضافة ملاحظة
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="أدخل ملاحظاتك أو سبب الرفض..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleApprove}
                                className="gap-2"
                              >
                                <Check className="h-4 w-4" />
                                موافقة مع ملاحظة
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleReject}
                                className="gap-2"
                              >
                                <X className="h-4 w-4" />
                                رفض
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowNotes(false);
                                  setNotes("");
                                }}
                              >
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {index < approval.workflow.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-4 bg-border"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ملاحظات إضافية */}
        {approval.notes && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">ملاحظات إضافية</h3>
              <div className="p-3 bg-muted rounded-lg text-sm">
                {approval.notes}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
