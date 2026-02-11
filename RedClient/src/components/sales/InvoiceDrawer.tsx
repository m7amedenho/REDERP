/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Invoice, InvoiceItem, Customer } from "@/lib/types/sales";
import { toast } from "sonner";

interface InvoiceDrawerProps {
  open: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  customers?: Customer[];
  products?: any[];
  onSave: (invoice: Partial<Invoice>) => Promise<void>;
}

export function InvoiceDrawer({
  open,
  onClose,
  invoice,
  customers = [],
  products = [],
  onSave,
}: InvoiceDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceType: "cash" as "cash" | "credit",
    responsibility: "company" as "salesman" | "company",
    dueDate: "",
    notes: "",
  });
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId,
        invoiceType: invoice.invoiceType,
        responsibility: invoice.responsibility,
        dueDate: invoice.dueDate || "",
        notes: invoice.notes || "",
      });
      setItems(invoice.items);
    } else {
      resetForm();
    }
  }, [invoice, open]);

  const resetForm = () => {
    setFormData({
      customerId: "",
      invoiceType: "cash",
      responsibility: "company",
      dueDate: "",
      notes: "",
    });
    setItems([]);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}`,
        productId: "",
        productName: "",
        productCode: "",
        quantity: 1,
        unit: "",
        unitPrice: 0,
        discount: 0,
        discountType: "fixed",
        tax: 0,
        taxRate: 0.15,
        total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.productCode = product.code;
        item.unit = product.unit;
        item.unitPrice = product.retailPrice || product.price || 0;
      }
    } else {
      (item as any)[field] = value;
    }

    // حساب الإجمالي
    if (item.quantity && item.unitPrice !== undefined) {
      const subtotal = item.quantity * item.unitPrice;
      const discountAmount =
        item.discountType === "percentage"
          ? subtotal * ((item.discount || 0) / 100)
          : item.discount || 0;
      const afterDiscount = subtotal - discountAmount;
      item.tax = afterDiscount * (item.taxRate || 0);
      item.total = afterDiscount + item.tax;
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0);

    const discountAmount = items.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      return (
        sum +
        (item.discountType === "percentage"
          ? itemSubtotal * ((item.discount || 0) / 100)
          : item.discount || 0)
      );
    }, 0);

    const taxAmount = items.reduce((sum, item) => sum + (item.tax || 0), 0);
    const total = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast.error("يرجى اختيار العميل");
      return;
    }

    if (items.length === 0) {
      toast.error("يرجى إضافة منتجات للفاتورة");
      return;
    }

    if (formData.invoiceType === "credit" && !formData.dueDate) {
      toast.error("يرجى تحديد تاريخ الاستحقاق للفاتورة الآجلة");
      return;
    }

    const { total } = calculateTotals();
    const customer = customers.find((c) => c.id === formData.customerId);

    try {
      setLoading(true);
      await onSave({
        ...formData,
        customerName: customer?.name || "",
        customerPhone: customer?.phone || "",
        items: items as InvoiceItem[],
        totalAmount: total,
        paidAmount: formData.invoiceType === "cash" ? total : 0,
        remainingAmount: formData.invoiceType === "cash" ? 0 : total,
        paymentStatus: formData.invoiceType === "cash" ? "paid" : "unpaid",
        invoiceDate: new Date().toISOString(),
        status: "confirmed",
      });
      toast.success("تم حفظ الفاتورة بنجاح");
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حفظ الفاتورة");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="overflow-scroll" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>
              {invoice ? "تعديل فاتورة" : "إنشاء فاتورة جديدة"}
            </DrawerTitle>
            <DrawerDescription>
              أدخل معلومات الفاتورة والمنتجات
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="overflow-y-auto px-6" dir="rtl">
            <div className="space-y-6 pb-6">
              {/* معلومات الفاتورة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">العميل *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customerId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{customer.name}</span>
                            {customer.currentBalance > 0 && (
                              <Badge variant="secondary" className="mr-2">
                                {customer.currentBalance.toLocaleString()} ج.م
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceType">نوع الفاتورة *</Label>
                  <Select
                    value={formData.invoiceType}
                    onValueChange={(value: "cash" | "credit") =>
                      setFormData({ ...formData, invoiceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقدي</SelectItem>
                      <SelectItem value="credit">آجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.invoiceType === "credit" && (
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">تاريخ الاستحقاق *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="responsibility">المسؤولية</Label>
                  <Select
                    value={formData.responsibility}
                    onValueChange={(value: "salesman" | "company") =>
                      setFormData({ ...formData, responsibility: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">نظام الشركة</SelectItem>
                      <SelectItem value="salesman">
                        على مسؤولية مندوب
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* جدول المنتجات */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">المنتجات</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة منتج
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>المنتج</TableCell>
                        <TableCell>الكمية</TableCell>
                        <TableCell>السعر</TableCell>
                        <TableCell>الخصم</TableCell>
                        <TableCell>الضريبة</TableCell>
                        <TableCell>الإجمالي</TableCell>
                        <TableCell className="w-[50px]"></TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="min-w-[200px]">
                            <Select
                              value={item.productId}
                              onValueChange={(value) =>
                                updateItem(index, "productId", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المنتج" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.name} - {product.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20"
                              min="1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unitPrice || ""}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "unitPrice",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.discount || ""}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "discount",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.tax?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.total?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد منتجات. اضغط "إضافة منتج" لبدء الإضافة
                    </div>
                  )}
                </div>
              </div>

              {/* حسابات الفاتورة */}
              {items.length > 0 && (
                <div className="flex justify-end">
                  <div className="w-full md:w-1/2 space-y-3 p-4 border rounded-lg bg-muted">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        المجموع الفرعي:
                      </span>
                      <span className="font-medium">
                        {subtotal.toLocaleString()} ج.م
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم:</span>
                        <span className="font-medium">
                          - {discountAmount.toLocaleString()} ج.م
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        الضريبة (15%):
                      </span>
                      <span className="font-medium">
                        {taxAmount.toLocaleString()} ج.م
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>الإجمالي:</span>
                      <span className="text-primary">
                        {total.toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
          </ScrollArea>

          <DrawerFooter className="flex-row justify-end gap-2 border-t">
            <DrawerClose asChild>
              <Button variant="outline" type="button" className="gap-2">
                <X className="h-4 w-4" />
                إلغاء
              </Button>
            </DrawerClose>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "جاري الحفظ..." : "حفظ الفاتورة"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
