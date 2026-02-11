"use client";

import { useState } from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { CustomerModal } from "@/components/sales/CustomerModal";
import { Customer } from "@/lib/types/sales";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// نوع بيانات العميل للجدول
export type CustomerRow = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  customerType: "individual" | "company";
  customerCategory: "A" | "B" | "C";
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  status: "active" | "suspended" | "blocked";
  registrationDate: string;
  totalPurchases: number;
};

// بيانات تجريبية للعملاء
const mockCustomers: CustomerRow[] = [
  {
    id: "1",
    name: "أحمد محمد الفلاح",
    email: "ahmed@example.com",
    phone: "01234567890",
    customerType: "individual",
    customerCategory: "B",
    creditLimit: 50000,
    currentBalance: 25000,
    availableCredit: 25000,
    status: "active",
    registrationDate: "2024-01-01",
    totalPurchases: 150000,
  },
  {
    id: "2",
    name: "شركة الزراعة الحديثة",
    email: "modern@agri.com",
    phone: "01098765432",
    customerType: "company",
    customerCategory: "A",
    creditLimit: 100000,
    currentBalance: 45000,
    availableCredit: 55000,
    status: "active",
    registrationDate: "2023-12-01",
    totalPurchases: 450000,
  },
  {
    id: "3",
    name: "فاطمة السيد",
    email: "fatma@example.com",
    phone: "01555666777",
    customerType: "individual",
    customerCategory: "C",
    creditLimit: 30000,
    currentBalance: 35000,
    availableCredit: -5000,
    status: "suspended",
    registrationDate: "2024-01-10",
    totalPurchases: 65000,
  },
  {
    id: "4",
    name: "مؤسسة النخيل الزراعية",
    email: "nakeel@agri.com",
    phone: "01234555666",
    customerType: "company",
    customerCategory: "A",
    creditLimit: 150000,
    currentBalance: 0,
    availableCredit: 150000,
    status: "active",
    registrationDate: "2023-10-15",
    totalPurchases: 850000,
  },
  {
    id: "5",
    name: "حسن عبد الله",
    email: "hassan@example.com",
    phone: "01777888999",
    customerType: "individual",
    customerCategory: "B",
    creditLimit: 40000,
    currentBalance: 15000,
    availableCredit: 25000,
    status: "active",
    registrationDate: "2023-11-20",
    totalPurchases: 220000,
  },
];

// تعريف الأعمدة
export const columns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "name",
    header: "اسم العميل",
    enableGlobalFilter: true,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{row.original.phone}</span>
          <Badge variant="outline" className="text-xs">
            {row.original.customerType === "company" ? "شركة" : "فردي"}
          </Badge>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined;
      return email ? (
        <span className="text-sm">{email}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    accessorKey: "customerCategory",
    header: "الفئة",
    cell: ({ row }) => {
      const category = row.getValue("customerCategory") as string;
      const variant =
        category === "A"
          ? "default"
          : category === "B"
          ? "secondary"
          : "outline";
      return (
        <Badge variant={variant}>
          {category === "A" ? "VIP" : category === "B" ? "عادي" : "جديد"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "creditLimit",
    header: "حد الائتمان",
    cell: ({ row }) => {
      const amount = row.getValue("creditLimit") as number;
      return <span className="font-medium">{amount.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "currentBalance",
    header: "الرصيد الحالي",
    cell: ({ row }) => {
      const balance = row.getValue("currentBalance") as number;
      const limit = row.original.creditLimit;
      const percentage = (balance / limit) * 100;

      let variant: "default" | "secondary" | "destructive" = "secondary";
      if (balance > limit) variant = "destructive";
      else if (percentage >= 80) variant = "secondary";

      return (
        <div className="flex items-center gap-2">
          <span className={balance > limit ? "text-red-600 font-bold" : ""}>
            {balance.toLocaleString()} ج.م
          </span>
          {balance > limit && (
            <Badge variant="destructive" className="text-xs">
              تجاوز
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "availableCredit",
    header: "الائتمان المتاح",
    cell: ({ row }) => {
      const available = row.getValue("availableCredit") as number;
      return (
        <span
          className={`font-medium ${
            available < 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {available.toLocaleString()} ج.م
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "active"
          ? "default"
          : status === "suspended"
          ? "secondary"
          : "destructive";

      const text =
        status === "active"
          ? "نشط"
          : status === "suspended"
          ? "موقوف"
          : "محظور";

      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "totalPurchases",
    header: "إجمالي المشتريات",
    cell: ({ row }) => {
      const amount = row.getValue("totalPurchases") as number;
      return <span className="font-medium">{amount.toLocaleString()} ج.م</span>;
    },
  },
  {
    accessorKey: "registrationDate",
    header: "تاريخ التسجيل",
    cell: ({ row }) => {
      const date = new Date(row.getValue("registrationDate"));
      return (
        <span className="text-sm">{date.toLocaleDateString("ar-EG")}</span>
      );
    },
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(
    null
  );

  const handleEdit = (customer: CustomerRow) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = (customers: CustomerRow[]) => {
    console.log("حذف العملاء:", customers);
    if (confirm(`هل تريد حقاً حذف ${customers.length} عميل؟`)) {
      toast.success(`تم حذف ${customers.length} عميل`);
    }
  };

  const handleView = (customer: CustomerRow) => {
    router.push(`/dashboard/sales/customers/${customer.id}`);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleSave = async (customerData: Partial<Customer>) => {
    console.log("حفظ العميل:", customerData);
    // هنا يتم إرسال البيانات إلى API
    // await api.saveCustomer(customerData);
  };

  // إحصائيات سريعة
  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter((c) => c.status === "active").length,
    suspended: mockCustomers.filter((c) => c.status === "suspended").length,
    exceeded: mockCustomers.filter((c) => c.currentBalance > c.creditLimit)
      .length,
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">إدارة العملاء</h1>
            <p className="text-muted-foreground">
              إدارة وتتبع جميع عملاء المبيعات
            </p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي العملاء
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء نشطون</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء موقوفون</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.suspended}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تجاوز الائتمان
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.exceeded}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول العملاء */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockCustomers}
            searchPlaceholder="ابحث بالعملاء..."
            rtl={true}
            showExport={true}
            showSelection={true}
            showSearch={true}
            showFilters={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            filterOptions={[
              {
                column: "status",
                options: ["نشط", "موقوف", "محظور"],
              },
              {
                column: "customerType",
                options: ["فردي", "شركة"],
              },
              {
                column: "customerCategory",
                options: ["VIP", "عادي", "جديد"],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Modal لإضافة/تعديل العميل */}
      <CustomerModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer as any}
        onSave={handleSave}
      />
    </div>
  );
}
