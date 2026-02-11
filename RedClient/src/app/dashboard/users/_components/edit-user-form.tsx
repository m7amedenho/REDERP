"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ROLE_OPTIONS, ROLE_PERMISSIONS_PRESETS, HIERARCHY_MAPPING } from "@/lib/constants";
import { PermissionsSelector } from "@/components/blocks/permissions-selector"; // استدعاء مكون الصلاحيات

// ... (Interface AdminUpdateUserDto نفس القديم) ...
interface AdminUpdateUserDto {
  fullName: string;
  jobTitle: string;
  department: string;
  region?: string;
  isActive: boolean;
  role: string;
  managerId?: string | null;
  permissions?: string[]; // [!code highlight]
}

interface EditUserFormProps {
  user: any;
  onSuccess: () => void;
}

export default function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const queryClient = useQueryClient();
  const currentRole = user.role || "User";

  // جلب المديرين
  const { data: allUsers } = useQuery({
    queryKey: ["users-list-for-manager"],
    queryFn: async () => {
      const res = await api.get("/Users/get-all-users");
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<AdminUpdateUserDto>({
    defaultValues: {
      fullName: user.fullName,
      jobTitle: user.jobTitle,
      department: user.department,
      region: user.region || "",
      isActive: user.isActive,
      role: currentRole,
      managerId: user.managerId || null,
      // نفترض أن اليوزر الجاي من الباك إند فيه مصفوفة permissions
      // لو الباك إند مش بيبعت الصلاحيات في الـ UserListDto، لازم تعدل الـ Controller
      // permissions: user.permissions || [], 
    },
  });

  const isActive = watch("isActive");
  const selectedRole = watch("role");
  // const selectedPermissions = watch("permissions"); // لو فعلت الصلاحيات في التعديل

  // فلترة المديرين
  const availableManagers = useMemo(() => {
    if (!allUsers || !selectedRole) return [];
    const allowedManagerRoles = HIERARCHY_MAPPING[selectedRole];
    if (!allowedManagerRoles) return allUsers;
    // استبعاد المستخدم نفسه من قائمة مديرينه
    return allUsers.filter((u: any) => allowedManagerRoles.includes(u.role) && u.id !== user.id);
  }, [allUsers, selectedRole, user.id]);

  const mutation = useMutation({
    mutationFn: async (data: AdminUpdateUserDto) => {
      return api.put(`/Users/admin-update-employee/${user.id}`, data);
    },
    onSuccess: () => {
      toast.success("تم تحديث البيانات");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess();
    },
    onError: (err: any) => toast.error("خطأ في التحديث"),
  });

  const onSubmit = (data: AdminUpdateUserDto) => {
    // لو حبيت تغير الصلاحيات بناءً على تغيير الرول هنا
    if (data.role !== currentRole && ROLE_PERMISSIONS_PRESETS[data.role]) {
       // ممكن تبعت الصلاحيات الجديدة هنا لو الـ API بيدعم تعديل الصلاحيات في نفس الـ Endpoint
       // data.permissions = ROLE_PERMISSIONS_PRESETS[data.role];
    }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الاسم بالكامل</Label>
          <Input {...register("fullName", { required: "مطلوب" })} />
        </div>

        <div className="space-y-2">
          <Label>المسمى الوظيفي</Label>
          <Input {...register("jobTitle")} />
        </div>

        {/* الرول */}
        <div className="space-y-2">
          <Label>نوع الصلاحية</Label>
          <Select 
             defaultValue={currentRole} 
             onValueChange={(val) => setValue("role", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {ROLE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* المدير */}
        <div className="space-y-2">
          <Label>المدير المباشر</Label>
          <Select 
            defaultValue={user.managerId || "none"}
            onValueChange={(val) => setValue("managerId", val === "none" ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="بدون مدير" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="none">-- بدون مدير --</SelectItem>
              {availableManagers.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* الحالة */}
        <div className="space-y-2 flex flex-col justify-end">
             <div className="flex items-center gap-3 border p-2 rounded-md" dir="ltr">
                <Switch 
                    checked={isActive}
                    onCheckedChange={(val) => setValue("isActive", val)}
                />
                <span className={isActive ? "text-green-600 font-bold" : "text-red-500"}>
                    {isActive ? "Account Active" : "Account Suspended"}
                </span>
             </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button type="button" variant="ghost" onClick={onSuccess}>إلغاء</Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "حفظ التعديلات"}
        </Button>
      </div>
    </form>
  );
}