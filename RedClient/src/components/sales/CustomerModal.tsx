"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { Customer } from "@/lib/types/sales";
import { toast } from "sonner";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: (customer: Partial<Customer>) => Promise<void>;
}

export function CustomerModal({
  open,
  onClose,
  customer,
  onSave,
}: CustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    creditLimit: 0,
    paymentTerms: "30",
    customerType: "individual" as "individual" | "company",
    customerCategory: "B" as "A" | "B" | "C",
    taxNumber: "",
    commercialRegister: "",
    notes: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address,
        creditLimit: customer.creditLimit,
        paymentTerms: customer.paymentTerms,
        customerType: customer.customerType,
        customerCategory: customer.customerCategory,
        taxNumber: customer.taxNumber || "",
        commercialRegister: customer.commercialRegister || "",
        notes: customer.notes || "",
      });
    } else {
      resetForm();
    }
  }, [customer, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      creditLimit: 0,
      paymentTerms: "30",
      customerType: "individual",
      customerCategory: "B",
      taxNumber: "",
      commercialRegister: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم العميل");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      toast.success(
        customer ? "تم تحديث بيانات العميل بنجاح" : "تم إضافة العميل بنجاح"
      );
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حفظ بيانات العميل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {customer ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات العميل الأساسية وإعدادات الائتمان
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <h3 className="font-semibold">المعلومات الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="أدخل اسم العميل"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="مثال: 01234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerType">نوع العميل *</Label>
                  <Select
                    value={formData.customerType}
                    onValueChange={(value: "individual" | "company") =>
                      setFormData({ ...formData, customerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فردي</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="أدخل عنوان العميل"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* معلومات الائتمان */}
            <div className="space-y-4">
              <h3 className="font-semibold">معلومات الائتمان</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">حد الائتمان (ج.م)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditLimit: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">فترة السداد (يوم)</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentTerms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="7">7 أيام</SelectItem>
                      <SelectItem value="15">15 يوم</SelectItem>
                      <SelectItem value="30">30 يوم</SelectItem>
                      <SelectItem value="60">60 يوم</SelectItem>
                      <SelectItem value="90">90 يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCategory">فئة العميل</Label>
                  <Select
                    value={formData.customerCategory}
                    onValueChange={(value: "A" | "B" | "C") =>
                      setFormData({ ...formData, customerCategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - VIP</SelectItem>
                      <SelectItem value="B">B - عادي</SelectItem>
                      <SelectItem value="C">C - جديد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* معلومات الشركات فقط */}
            {formData.customerType === "company" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">معلومات الشركة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                      <Input
                        id="taxNumber"
                        value={formData.taxNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            taxNumber: e.target.value,
                          })
                        }
                        placeholder="أدخل الرقم الضريبي"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commercialRegister">السجل التجاري</Label>
                      <Input
                        id="commercialRegister"
                        value={formData.commercialRegister}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            commercialRegister: e.target.value,
                          })
                        }
                        placeholder="أدخل رقم السجل التجاري"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* ملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="أدخل أي ملاحظات إضافية..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
