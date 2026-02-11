// صفحة الاستخدام example-page.tsx
"use client";

import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// تعريف نوع البيانات
export type User = {
  id: string;
  name: string;
  email: string;
  status: "نشط" | "غير نشط" | "موقوف";
  role: string;
  joinDate: string;
};

// بيانات المثال
const data: User[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "نشط",
    role: "مدير",
    joinDate: "2023-01-15",
  },
  
];

// تعريف الأعمدة فقط بدون إجراءات (سيتم إضافتها تلقائياً)
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "نشط"
          ? "default"
          : status === "غير نشط"
          ? "secondary"
          : "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "role",
    header: "الدور",
  },
  {
    accessorKey: "joinDate",
    header: "تاريخ الانضمام",
  },
];

// صفحة المكون
export default function UsersPage() {
  const handleEdit = (user: User) => {
    console.log("تعديل المستخدم:", user);
    // افتح نموذج التعديل هنا
  };

  const handleDelete = (users: User[]) => {
    console.log("حذف المستخدمين:", users);
    // تأكيد الحذف وتنفيذه
    if (confirm(`هل تريد حقاً حذف ${users.length} مستخدم؟`)) {
      // تنفيذ الحذف
    }
  };

  const handleView = (user: User) => {
    console.log("عرض المستخدم:", user);
    // الانتقال إلى صفحة التفاصيل
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        title="إدارة المستخدمين"
        searchPlaceholder="ابحث بالمستخدمين..."
        rtl={true}
        showExport={false}
        showSelection={false}
        showSearch={true}
        showFilters={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        filterOptions={[
          {
            column: "status",
            options: ["نشط", "غير نشط", "موقوف"],
          },
          {
            column: "role",
            options: ["مدير", "مشرف", "مستخدم"],
          },
        ]}
      />
    </div>
  );
}
