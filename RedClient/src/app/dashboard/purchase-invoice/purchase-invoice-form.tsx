/* eslint-disable @typescript-eslint/no-unused-vars */
// components/purchase-invoice-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type PurchaseInvoiceItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
};

export function PurchaseInvoiceForm() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PurchaseInvoiceItem[]>([
    {
      id: "1",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // حساب الإجمالي تلقائياً
          if (
            field === "quantity" ||
            field === "unitPrice" ||
            field === "discount"
          ) {
            const quantity = field === "quantity" ? value : item.quantity;
            const unitPrice = field === "unitPrice" ? value : item.unitPrice;
            const discount = field === "discount" ? value : item.discount;

            updatedItem.total = quantity * unitPrice - discount;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      employeeName: formData.get("employeeName"),
      dueDate: formData.get("dueDate"),
      notes: formData.get("notes"),
      items: items,
      totalAmount: calculateTotal(),
    };
    console.log("بيانات الفاتورة:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <IconPlus className="h-4 w-4" />
          إضافة فاتورة شراء
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1200px] w-[90vw] overflow-y-scroll max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>إنشاء فاتورة شراء جديدة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="employeeName">اسم المندوب / الموظف</Label>
              <Input
                id="employeeName"
                name="employeeName"
                placeholder="أدخل اسم المندوب"
                required
                readOnly
              />
            </div>

            <div className="space-y-2" dir="rtl">
              <Label htmlFor="dueDate">تاريخ استحقاق البضاعة</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                className="justify-center"
              />
            </div>
          </div>

          {/* جدول الأصناف */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>الأصناف المطلوبة</Label>
              <Button
                type="button"
                onClick={addItem}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <IconPlus className="h-4 w-4" />
                إضافة صنف
              </Button>
            </div>

            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">اسم الصنف</th>
                    <th className="text-center p-3">الكمية</th>
                    <th className="text-center p-3">سعر الوحدة</th>
                    <th className="text-center p-3">الخصم</th>
                    <th className="text-center p-3">الإجمالي</th>
                    <th className="text-center p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <Input
                          value={item.productName}
                          onChange={(e) =>
                            updateItem(item.id, "productName", e.target.value)
                          }
                          placeholder="اسم الصنف"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "discount",
                              Number(e.target.value)
                            )
                          }
                          className="text-center"
                        />
                      </td>
                      <td className="p-2 text-center font-semibold">
                        {item.total.toFixed(2)} ج.م
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <IconTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={4} className="p-3 text-left font-bold">
                      الإجمالي الكلي
                    </td>
                    <td
                      colSpan={2}
                      className="p-3 text-center font-bold text-lg"
                    >
                      {calculateTotal().toFixed(2)} ج.م
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* الملاحظات */}
          <div className="space-y-2">
            <Label htmlFor="notes">طريقة الدفع</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="طريقة الدفع..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="أي ملاحظات إضافية حول الطلب..."
              rows={3}
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">حفظ الفاتورة</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
