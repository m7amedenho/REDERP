"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Plus } from "lucide-react";
import CreateUserForm from "./_components/create-user-form";
import EditUserForm from "./_components/edit-user-form";

// دالة مساعدة لإصلاح رابط الصورة (لو الباك إند بيرجع مسار نسبي)
const getImageUrl = (url: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url; // رابط كامل
  // لو رابط نسبي، ضيف الدومين الخاص بالباك إند
  const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://localhost:7000"; 
  return `${API_DOMAIN}${url}`;
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "profilePictureUrl",
    header: "الصورة",
    cell: ({ row }) => {
      const user = row.original;
      const finalUrl = getImageUrl(user.profilePictureUrl);

      return (
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={finalUrl} alt={user.fullName} className="object-cover" />
          <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "الاسم",
    cell: ({ row }) => <span className="font-medium">{row.getValue("fullName")}</span>
  },
  {
    accessorKey: "userName",
    header: "اسم المستخدم",
  },
  {
    accessorKey: "jobTitle",
    header: "الوظيفة",
  },
  {
    accessorKey: "department",
    header: "القسم",
  },
  {
    accessorKey: "isActive",
    header: "الحالة",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "destructive"} className="px-2">
          {isActive ? "نشط" : "موقوف"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [openEdit, setOpenEdit] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const queryClient = useQueryClient();
      const user = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const toggleActiveMutation = useMutation({
        mutationFn: async (checked: boolean) => {
          // البيانات يتم إرسالها كاملة الآن من الـ DTO الجديد
          const payload = {
            fullName: user.fullName,
            jobTitle: user.jobTitle,
            department: user.department,
            region: user.region || "",
            isActive: checked,
            role: user.role, // الرول جاي جاهز من الباك إند الآن
            managerId: user.managerId
          };
          return api.put(`/Users/admin-update-employee/${user.id}`, payload);
        },
        onSuccess: () => {
          toast.success("تم تحديث الحالة بنجاح");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error("فشل التحديث: تأكد من الصلاحيات");
        },
      });

      return (
        <div className="flex items-center gap-2">
          {/* Switch Direction LTR */}
          <div dir="ltr">
            <Switch
                checked={user.isActive}
                onCheckedChange={(checked) => toggleActiveMutation.mutate(checked)}
            />
          </div>

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>تعديل بيانات: {user.fullName}</DialogTitle>
              </DialogHeader>
              <EditUserForm 
                user={user} 
                onSuccess={() => setOpenEdit(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

export default function UsersManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // استدعاء الـ Endpoint الجديد
      const res = await api.get("/Users/get-all-users");
      return res.data;
    },
  });

  if (error) return <div className="p-10 text-center text-destructive">حدث خطأ في تحميل البيانات</div>;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">إدارة المستخدمين</h2>
            <p className="text-muted-foreground">عرض وإدارة جميع الموظفين في النظام</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" /> إضافة موظف
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-scroll min-y-xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة موظف جديد</DialogTitle>
            </DialogHeader>
            <CreateUserForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center h-40 items-center text-muted-foreground">جاري التحميل...</div>
      ) : (
        <DataTable
          columns={columns}
          data={users || []}
          title="قائمة الموظفين"
          searchPlaceholder="بحث..."
          rtl={true}
          showSearch={true}
        />
      )}
    </div>
  );
}