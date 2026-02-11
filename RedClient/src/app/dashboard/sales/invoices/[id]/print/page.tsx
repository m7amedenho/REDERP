// print page example

"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconPrinter, IconDownload, IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface InvoicePrintPageProps {
  params: {
    id: string;
  };
}

export default function InvoicePrintPage({ params }: InvoicePrintPageProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  // بيانات تجريبية للفاتورة مع 10 أصناف
  const invoice = {
    id: params.id,
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-15",
    invoiceType: "credit",
    customer: {
      name: "أحمد محمد علي",
      phone: "0123456789",
      address: "القاهرة، مصر الجديدة، شارع النزهة",
      taxNumber: "123-456-789",
    },
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
    items: [
      {
        id: "1",
        name: "منتج 1",
        quantity: 2,
        unitPrice: 150,
        discount: 10,
        total: 280,
        taxRate: 14,
      },
      {
        id: "2",
        name: "منتج 2",
        quantity: 1,
        unitPrice: 200,
        discount: 0,
        total: 200,
        taxRate: 14,
      },
      {
        id: "3",
        name: "منتج 3",
        quantity: 3,
        unitPrice: 100,
        discount: 5,
        total: 285,
        taxRate: 14,
      },
      {
        id: "4",
        name: "منتج 4",
        quantity: 1,
        unitPrice: 300,
        discount: 15,
        total: 285,
        taxRate: 14,
      },
      {
        id: "5",
        name: "منتج 5",
        quantity: 4,
        unitPrice: 75,
        discount: 0,
        total: 300,
        taxRate: 14,
      },
      {
        id: "6",
        name: "منتج 6",
        quantity: 2,
        unitPrice: 180,
        discount: 10,
        total: 324,
        taxRate: 14,
      },
      {
        id: "7",
        name: "منتج 7",
        quantity: 1,
        unitPrice: 250,
        discount: 0,
        total: 250,
        taxRate: 14,
      },
      {
        id: "8",
        name: "منتج 8",
        quantity: 3,
        unitPrice: 120,
        discount: 5,
        total: 342,
        taxRate: 14,
      },
      {
        id: "9",
        name: "منتج 9",
        quantity: 2,
        unitPrice: 90,
        discount: 0,
        total: 180,
        taxRate: 14,
      },
      {
        id: "10",
        name: "منتج 10",
        quantity: 1,
        unitPrice: 400,
        discount: 20,
        total: 320,
        taxRate: 14,
      },
    ],
    subtotal: 2766,
    discount: 65,
    taxAmount: 378,
    total: 3079,
    paid: 2000,
    remaining: 1079,
    notes: "شكراً لتعاملكم معنا",
    salesRep: "محمد أحمد",
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
      <div ref={printRef} className="p-6 shadow-lg print:text-black print:shadow-none print:p-0">
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
                <h2 className="text-lg font-bold">فاتورة مبيعات</h2>
                <p className="text-xs">SALES INVOICE</p>
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
                {invoice.invoiceType === "credit" && (
                  <div className="flex justify-between gap-6">
                    <span className="font-semibold">تاريخ الاستحقاق:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                )}
                <div className="flex justify-between gap-6">
                  <span className="font-semibold">النوع:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                    {invoice.invoiceType === "cash" ? "نقدي" : "آجل"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 p-3 rounded text-xs">
          <h3 className="font-bold mb-1">بيانات العميل</h3>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            <div>
              <span className="font-semibold">الاسم:</span>{" "}
              {invoice.customer.name}
            </div>
            <div>
              <span className="font-semibold">الهاتف:</span>{" "}
              {invoice.customer.phone}
            </div>
            <div>
              <span className="font-semibold">العنوان:</span>{" "}
              {invoice.customer.address}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="">
                <th className="text-center p-1 border w-8">#</th>
                <th className="text-right p-1 border">الصنف</th>
                <th className="text-center p-1 border w-12">الكمية</th>
                <th className="text-center p-1 border w-16">السعر</th>
                <th className="text-center p-1 border w-16">الخصم</th>
                <th className="text-center p-1 border w-16">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="text-center border">{index + 1}</td>
                  <td className="text-right p-1 border font-medium">
                    {item.name}
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
        <div className="flex flex-col md:flex-row justify-between mb-4">
          {/* Totals */}
          <div className="w-full md:w-80 mb-4 md:mb-0">
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

              {invoice.invoiceType === "credit" && (
                <>
                  <div className="flex justify-between py-1 border-b text-green-600">
                    <span className="font-semibold">المدفوع:</span>
                    <span>{invoice.paid} ج.م</span>
                  </div>
                  <div className="flex justify-between py-1 border-b text-red-600">
                    <span className="font-semibold">المتبقي:</span>
                    <span>{invoice.remaining} ج.م</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2 font-bold text-sm px-2 rounded">
                <span>الإجمالي النهائي:</span>
                <span>{invoice.total} ج.م</span>
              </div>
            </div>
          </div>

          {/* QR Code and Additional Info */}
          {/* <div className="flex flex-col items-center justify-center space-y-2">
            <div className="border p-2 rounded">
              <QRCodeSVG
                value={`Invoice: ${invoice.invoiceNumber}\nTotal: ${invoice.total} EGP`}
                size={80}
              />
            </div>
            <div className="text-xs text-center">
              <p>رمز الاستجابة السريعة للفاتورة</p>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-3">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-3 md:mb-0 print:flex print:justify-between">
              {invoice.notes && (
                <div className="text-xs mb-1">
                  <span className="font-semibold">ملاحظات:</span>{" "}
                  {invoice.notes}
                </div>
              )}
              <div className="text-xs">
                <span className="font-semibold">المندوب:</span>{" "}
                {invoice.salesRep}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p className="font-semibold mb-1">شروط وأحكام البيع:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>البضاعة المباعة لا ترد ولا تستبدل إلا بعيب صناعي</li>
                <li>يجب فحص البضاعة عند الاستلام</li>
                <li>يحق للشركة استرداد البضاعة في حالة عدم السداد</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="mt-4 text-center text-xs border-t pt-2">
          <p>هذه فاتورة إلكترونية صالحة بدون توقيع</p>
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
