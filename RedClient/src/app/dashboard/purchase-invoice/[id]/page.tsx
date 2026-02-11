// app/purchase-invoices/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight, IconPrinter, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

// بيانات تجريبية
const invoiceData = {
  id: "1",
  invoiceNumber: "PUR-2024-001",
  employeeName: "أحمد محمد",
  totalAmount: 15000,
  status: "قيد الطلب",
  dueDate: "2024-02-15",
  createdAt: "2024-01-15",
  notes: "يجب تسليم البضاعة في مقر الشركة الرئيسي",
  items: [
    {
      id: "1",
      productName: "شاشات كمبيوتر 24 بوصة",
      quantity: 10,
      unitPrice: 1200,
      discount: 0,
      total: 12000,
    },
    {
      id: "2",
      productName: "لوحات مفاتيح",
      quantity: 15,
      unitPrice: 150,
      discount: 100,
      total: 2150,
    },
    {
      id: "3",
      productName: "فأرة كمبيوتر",
      quantity: 15,
      unitPrice: 80,
      discount: 50,
      total: 1150,
    },
  ],
};

export default function PurchaseInvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const invoice = invoiceData;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "موافق عليها": return "default";
      case "قيد الطلب": return "secondary";
      case "مرفوضة": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <IconArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <IconEdit className="h-4 w-4" />
            تعديل
          </Button>
          <Button variant="outline" className="gap-2 text-red-600">
            <IconTrash className="h-4 w-4" />
            حذف
          </Button>
          <Button 
            onClick={() => router.push(`/dashboard/purchase-invoice/${params.id}/print`)}
            className="gap-2"
          >
            <IconPrinter className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      {/* معلومات الفاتورة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* المعلومات الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">معلومات الفاتورة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">رقم الفاتورة</label>
                <p className="font-semibold">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">الحالة</label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">اسم المندوب</label>
                <p className="font-semibold">{invoice.employeeName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</label>
                <p className="font-semibold">{invoice.createdAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">تاريخ استحقاق البضاعة</label>
                <p className="font-semibold">{invoice.dueDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">المبلغ الإجمالي</label>
                <p className="font-semibold text-lg">{invoice.totalAmount.toLocaleString()} ج.م</p>
              </div>
            </div>
          </div>

          {/* الملاحظات */}
          {invoice.notes && (
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-bold mb-4">ملاحظات</h2>
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* الإجراءات السريعة */}
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-4">الإجراءات</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                تغيير الحالة
              </Button>
              <Button variant="outline" className="w-full justify-start">
                إضافة ملاحظة
              </Button>
              <Button variant="outline" className="w-full justify-start">
                إرسال إشعار
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* جدول الأصناف */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">الأصناف المطلوبة</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-4">اسم الصنف</th>
              <th className="text-center p-4">الكمية</th>
              <th className="text-center p-4">سعر الوحدة</th>
              <th className="text-center p-4">الخصم</th>
              <th className="text-center p-4">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-medium">{item.productName}</td>
                <td className="p-4 text-center">{item.quantity}</td>
                <td className="p-4 text-center">{item.unitPrice.toLocaleString()} ج.م</td>
                <td className="p-4 text-center">{item.discount.toLocaleString()} ج.م</td>
                <td className="p-4 text-center font-semibold">
                  {item.total.toLocaleString()} ج.م
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50">
              <td colSpan={4} className="p-4 text-left font-bold">
                الإجمالي الكلي
              </td>
              <td className="p-4 text-center font-bold text-lg">
                {invoice.totalAmount.toLocaleString()} ج.م
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}