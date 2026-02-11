// components/approval-dialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequest } from "../types/approval";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: PurchaseRequest[];
  onApprove: (notes: string, conditions: string[]) => void;
}

export function ApprovalDialog({ open, onOpenChange, requests, onApprove }: ApprovalDialogProps) {
  const [notes, setNotes] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);

  const conditionOptions = [
    "الالتزام بموعد التسليم المتفق عليه",
    "تطبيق شروط الجودة المتفق عليها",
    "الالتزام بالأسعار المعتمدة",
    "توفير كافة المستندات المطلوبة",
    "الالتزام بسياسات الشراء المعتمدة",
  ];

  const toggleCondition = (condition: string) => {
    setConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleApprove = () => {
    onApprove(notes, conditions);
    setNotes("");
    setConditions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>اعتماد طلبات الشراء</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات الطلبات المحددة */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">الطلبات المحددة للاعتماد:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {requests.map(request => (
                <li key={request.id}>
                  {request.invoiceNumber} - {request.employeeName} -{" "}
                  {request.totalAmount.toLocaleString()} ج.م
                </li>
              ))}
            </ul>
          </div>

          {/* ملاحظات الاعتماد */}
          <div className="space-y-3">
            <Label htmlFor="approval-notes">ملاحظات الاعتماد</Label>
            <Textarea
              id="approval-notes"
              placeholder="أضف ملاحظاتك حول اعتماد هذه الطلبات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* شروط الاعتماد */}
          <div className="space-y-3">
            <Label>شروط الاعتماد</Label>
            <div className="space-y-2">
              {conditionOptions.map(condition => (
                <div key={condition} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={conditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <label
                    htmlFor={`condition-${condition}`}
                    className="text-sm leading-none"
                  >
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleApprove}>
            اعتماد الطلبات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}