// app/purchase-invoices/[id]/print/page.tsx
"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconPrinter, IconDownload, IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PurchaseInvoicePrintPageProps {
  params: {
    id: string;
  };
}

export default function PurchaseInvoicePrintPage({
  params,
}: PurchaseInvoicePrintPageProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  // بيانات تجريبية لفاتورة المشتريات
  const invoice = {
    id: params.id,
    invoiceNumber: "PUR-2024-001",
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-15",
    employeeName: "أحمد محمد",
    status: "قيد الطلب",
    paymentMethod: "كاش",
    company: {
      name: "شركة أليكس للأدوات الزراعية",
      nameEnglish: "Alex for Agriculture Tools",
      phone: "+20 100 123 4567",
      email: "info@alexasfor.com",
      address: "القاهرة، مصر",
      taxNumber: "987-654-321",
      commercialRegister: "CR-12345",
      logo: "https://alexasfor.com/wp-content/uploads/2023/03/Alex.png",
    },
    supplier: {
      name: "مورد الأجهزة الإلكترونية",
      phone: "0123456789",
      address: "القاهرة، مصر الجديدة، شارع النزهة",
      taxNumber: "123-456-789",
    },
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
    subtotal: 15300,
    discount: 150,
    taxAmount: 2142,
    total: 17292,
    notes: "يجب تسليم البضاعة في مقر الشركة الرئيسي",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // في الإنتاج، استخدم مكتبة مثل jsPDF أو html2pdf
    alert("سيتم تنزيل الفاتورة بصيغة PDF");
  };

  return (
    <>
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <IconArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="gap-2"
          >
            <IconDownload className="h-4 w-4" />
            تحميل PDF
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <IconPrinter className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Invoice Print Layout */}
      <div
        ref={printRef}
        className="p-6 shadow-lg print:text-black print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-4">
          <div className="flex justify-between items-start">
            {/* Company Info */}
            <div className="flex-1">
              <Image
                src={invoice.company.logo}
                alt="Company Logo"
                width={100}
                height={100}
                className="h-12 mb-2"
              />
              <h1 className="text-sm font-bold">{invoice.company.name}</h1>
              <p className="text-xs">{invoice.company.nameEnglish}</p>
              <div className="mt-1 text-xs space-y-0.5">
                <p>{invoice.company.address}</p>
                <p>هاتف: {invoice.company.phone}</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="text-left">
              <div className="px-4 py-2 mb-2 rounded">
                <h2 className="text-lg font-bold">فاتورة مشتريات</h2>
                <p className="text-xs">PURCHASE INVOICE</p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-6">
                  <span className="font-semibold">رقم الفاتورة:</span>
                  <span className="font-mono">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="font-semibold">التاريخ:</span>
                  <span>{invoice.invoiceDate}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="font-semibold">تاريخ الاستحقاق:</span>
                  <span>{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="font-semibold">الحالة:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Supplier Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Supplier Info */}
          <div className="p-3 rounded text-xs border">
            <h3 className="font-bold mb-1">بيانات المورد</h3>
            <div className="space-y-1">
              <div>
                <span className="font-semibold">الاسم:</span>{" "}
                {invoice.supplier.name}
              </div>
              <div>
                <span className="font-semibold">الهاتف:</span>{" "}
                {invoice.supplier.phone}
              </div>
              <div>
                <span className="font-semibold">العنوان:</span>{" "}
                {invoice.supplier.address}
              </div>
              <div>
                <span className="font-semibold">الرقم الضريبي:</span>{" "}
                {invoice.supplier.taxNumber}
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="p-3 rounded text-xs border">
            <h3 className="font-bold mb-1">بيانات المندوب</h3>
            <div className="space-y-1">
              <div>
                <span className="font-semibold">اسم المندوب:</span>{" "}
                {invoice.employeeName}
              </div>
              <div>
                <span className="font-semibold">تاريخ الطلب:</span>{" "}
                {invoice.invoiceDate}
              </div>
              <div>
                <span className="font-semibold">تاريخ الاستحقاق:</span>{" "}
                {invoice.dueDate}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <table className="w-[100%] text-sm">
            <thead>
              <tr className="">
                <th className="text-center p-1 border w-4">#</th>
                <th className="text-right p-1 border w-18">الصنف</th>
                <th className="text-center p-1 border w-4">الكمية</th>
                <th className="text-center p-1 border w-12">سعر الوحدة</th>
                <th className="text-center p-1 border w-12">الخصم</th>
                <th className="text-center p-1 border w-12">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="text-center border">{index + 1}</td>
                  <td className="text-right p-1 border font-medium">
                    {item.productName}
                  </td>
                  <td className="text-center p-1 border">{item.quantity}</td>
                  <td className="text-center p-1 border">
                    {item.unitPrice} ج.م
                  </td>
                  <td className="text-center p-1 border">
                    {item.discount} ج.م
                  </td>
                  <td className="text-center p-1 border font-semibold">
                    {item.total} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Payment Info */}
          <div className="flex justify-between mb-4">
            {/* Totals */}
            <div className="w-80 mb-0">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="font-semibold">الإجمالي قبل الخصم:</span>
                  <span>{invoice.subtotal} ج.م</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between py-1 border-b text-red-600">
                    <span className="font-semibold">الخصم الإجمالي:</span>
                    <span>-{invoice.discount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b">
                  <span className="font-semibold">الضريبة:</span>
                  <span>+{invoice.taxAmount} ج.م</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-sm rounded">
                  <span>الإجمالي النهائي:</span>
                  <span>{invoice.total} ج.م</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-1 gap-2">
              {invoice.notes && (
                <div className="text-xs">
                  <span className="font-semibold">ملاحظات:</span>{" "}
                  {invoice.notes}
                </div>
              )}
              <div className="text-xs flex gap-2 items-center">
                <span className="font-semibold">طريقة الدفع:</span>{" "}
              <p className="text-black bg-gray-200 p-1 rounded">{invoice.paymentMethod}</p>
              </div>
            </div>
          </div>

        {/* Footer */}
        <footer className="text-xs">
          <div className="border-t border-gray-300 pt-3">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-3 md:mb-0">
                <div className="text-xs">
                  <span className="font-semibold">المندوب:</span>{" "}
                  {invoice.employeeName}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p className="font-semibold mb-1">شروط وأحكام الشراء:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>يجب فحص البضاعة عند الاستلام</li>
                  <li>يحق للشركة إرجاع البضاعة في حالة وجود عيوب</li>
                  <li>يجب الالتزام بمواعيد التسليم المتفق عليها</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        {/* Print Footer */}
        <div className="mt-4 text-center text-xs border-t pt-2">
          <p>هذه فاتورة مشتريات إلكترونية صالحة بدون توقيع</p>
          <p className="mt-1">
            تم الطباعة في: {new Date().toLocaleString("ar-EG")}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            font-size: 12px;
            font-color: black;
          }
          @page {
            size: A4;
            margin: 0.5cm;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
