"use client";

import { POSInterface } from "@/components/sales/POSInterface";
import { Customer, POSCart } from "@/lib/types/sales";
import { toast } from "sonner";

// بيانات تجريبية
const mockProducts = [
  {
    id: "1",
    name: "بذور طماطم هجين F1",
    code: "SEED-001",
    barcode: "1234567890123",
    category: "البذور والشتلات",
    unit: "كيلوجرام",
    price: 250,
    retailPrice: 250,
    currentStock: 150,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
  {
    id: "2",
    name: "مبيد كلوروبيرفوس 48%",
    code: "PEST-001",
    barcode: "2234567890123",
    category: "المبيدات",
    unit: "لتر",
    price: 450,
    retailPrice: 450,
    currentStock: 45,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
  {
    id: "3",
    name: "سماد NPK 20-20-20",
    code: "FERT-001",
    barcode: "3234567890123",
    category: "الأسمدة",
    unit: "كيلوجرام",
    price: 180,
    retailPrice: 180,
    currentStock: 320,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
  {
    id: "4",
    name: "شتلات فلفل ألوان",
    code: "SEED-002",
    barcode: "4234567890123",
    category: "البذور والشتلات",
    unit: "صينية",
    price: 75,
    retailPrice: 75,
    currentStock: 8,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
  {
    id: "5",
    name: "مضخة رش يدوية 16 لتر",
    code: "TOOL-001",
    barcode: "5234567890123",
    category: "الأدوات الزراعية",
    unit: "قطعة",
    price: 350,
    retailPrice: 350,
    currentStock: 25,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
  {
    id: "6",
    name: "خرطوم ري طول 50 متر",
    code: "TOOL-002",
    barcode: "6234567890123",
    category: "الأدوات الزراعية",
    unit: "متر",
    price: 15,
    retailPrice: 15,
    currentStock: 320,
    image:
      "https://alexasfor.com/wp-content/uploads/2023/03/%D8%B3%D9%85%D8%A7.png",
  },
];

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد الفلاح",
    email: "ahmed@example.com",
    phone: "01234567890",
    address: "القاهرة",
    creditLimit: 50000,
    currentBalance: 25000,
    paymentTerms: "30 يوم",
    customerType: "individual",
    customerCategory: "B",
    salesRepId: "rep1",
    status: "active",
    registrationDate: "2024-01-01",
    totalPurchases: 150000,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "شركة الزراعة الحديثة",
    email: "modern@agri.com",
    phone: "01098765432",
    address: "الجيزة",
    creditLimit: 100000,
    currentBalance: 45000,
    paymentTerms: "60 يوم",
    customerType: "company",
    customerCategory: "A",
    salesRepId: "rep1",
    status: "active",
    registrationDate: "2023-12-01",
    totalPurchases: 450000,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "3",
    name: "فاطمة السيد",
    email: "fatma@example.com",
    phone: "01555666777",
    address: "الإسكندرية",
    creditLimit: 30000,
    currentBalance: 35000,
    paymentTerms: "30 يوم",
    customerType: "individual",
    customerCategory: "C",
    salesRepId: "rep2",
    status: "active",
    registrationDate: "2024-01-10",
    totalPurchases: 65000,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
];

export default function POSPage() {
  const handleSaleComplete = async (cart: POSCart, payment: any) => {
    console.log("Sale completed:", cart, payment);

    // هنا يمكن إرسال البيانات إلى API
    // await fetch('/api/sales/invoices', {
    //   method: 'POST',
    //   body: JSON.stringify({ cart, payment })
    // });

    toast.success("تم إتمام البيع بنجاح! رقم الفاتورة: INV-" + Date.now());

    // يمكن فتح صفحة طباعة الفاتورة
    // router.push(`/dashboard/sales/invoices/${invoiceId}/print`);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">نقطة البيع (POS)</h1>
          <p className="text-muted-foreground">نظام البيع السريع والمتكامل</p>
        </div>
      </div>

      {/* واجهة POS */}
      <POSInterface
        products={mockProducts}
        customers={mockCustomers}
        onSaleComplete={handleSaleComplete}
      />
    </div>
  );
}
