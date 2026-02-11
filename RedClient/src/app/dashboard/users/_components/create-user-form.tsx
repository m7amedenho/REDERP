"use client";

import { useEffect, useMemo } from "react"; // [!code highlight]
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
import { ROLE_OPTIONS, ROLE_PERMISSIONS_PRESETS, HIERARCHY_MAPPING } from "@/lib/constants"; // [!code highlight]
import { PermissionsSelector } from "@/components/blocks/permissions-selector";

interface CreateUserDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  jobTitle: string;
  department: string;
  region?: string;
  role: string;
  managerId?: string; // [!code highlight]
  permissions: string[];
}

interface CreateUserFormProps {
  onSuccess: () => void;
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const queryClient = useQueryClient();

  // 1. جلب قائمة الموظفين عشان نختار المدير منهم
  const { data: allUsers } = useQuery({
    queryKey: ["users-list-for-manager"],
    queryFn: async () => {
      const res = await api.get("/Users/get-all-users"); // Endpoint اللي بيرجع الـ Role
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserDto>({
    defaultValues: {
      role: "", 
      permissions: [],
      department: "",
    },
  });

  const selectedRole = watch("role");
  const selectedPermissions = watch("permissions");

  // 2. تطبيق القوالب (Templates)
  useEffect(() => {
    if (selectedRole && ROLE_PERMISSIONS_PRESETS[selectedRole]) {
      // أول ما يختار رول، نحط الصلاحيات الخاصة بيها أوتوماتيك
      setValue("permissions", ROLE_PERMISSIONS_PRESETS[selectedRole]);
      
      // كمان ممكن نحط القسم تلقائي (اختياري)
      if(selectedRole.includes("Sales")) setValue("department", "Sales");
      if(selectedRole.includes("Account")) setValue("department", "Accounts");
      if(selectedRole === "Hr") setValue("department", "HR");
    }
  }, [selectedRole, setValue]);

  // 3. فلترة المديرين بناءً على الهرم الإداري
  const availableManagers = useMemo(() => {
    if (!allUsers || !selectedRole) return [];
    
    // مين الرولز المسموح تكون مدير للرول المختارة؟
    const allowedManagerRoles = HIERARCHY_MAPPING[selectedRole];
    
    if (!allowedManagerRoles) return allUsers; // لو مش محددين، اظهر الكل

    return allUsers.filter((u: any) => allowedManagerRoles.includes(u.role));
  }, [allUsers, selectedRole]);


  const mutation = useMutation({
    mutationFn: async (data: CreateUserDto) => {
      return api.post("/Users/create-employee", data);
    },
    onSuccess: () => {
      toast.success("تم إنشاء الموظف وتعيين الصلاحيات");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "حدث خطأ";
      toast.error(msg);
    },
  });

  const onSubmit = (data: CreateUserDto) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ... (حقول الاسم، اليوزرنيم، الايميل، الباسورد زي ما هما) ... */}
        
        <div className="space-y-2">
          <Label>الاسم بالكامل</Label>
          <Input {...register("fullName", { required: "مطلوب" })} />
        </div>
        <div className="space-y-2">
           <Label>اسم المستخدم</Label>
           <Input {...register("username", { required: "مطلوب" })} className="text-right" dir="ltr" />
        </div>
        <div className="space-y-2">
           <Label>البريد الإلكتروني</Label>
           <Input {...register("email", { required: "مطلوب" })} className="text-right" dir="ltr" />
        </div>
        <div className="space-y-2">
           <Label>كلمة المرور</Label>
           <Input type="password" {...register("password", { required: "مطلوب" })} />
        </div>

        {/* اختيار الوظيفة (الرول) */}
        <div className="space-y-2">
          <Label className="text-blue-600 font-bold">نوع الوظيفة (Role)</Label>
          <Select onValueChange={(val) => setValue("role", val)}>
            <SelectTrigger className="border-blue-200 bg-blue-50/50">
              <SelectValue placeholder="اختر الدور الوظيفي" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* اختيار المدير المباشر (ذكي) */}
        <div className="space-y-2">
          <Label>المدير المباشر</Label>
          <Select 
            onValueChange={(val) => setValue("managerId", val)} 
            disabled={!selectedRole || availableManagers.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedRole ? "اختر المدير المسؤول" : "اختر الوظيفة أولاً"} />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {availableManagers.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.fullName} - <span className="text-xs text-muted-foreground">({m.jobTitle})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRole && availableManagers.length === 0 && (
             <p className="text-xs text-yellow-600">لا يوجد مديرين متاحين لهذا المستوى الوظيفي</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>المسمى الوظيفي</Label>
          <Input {...register("jobTitle", { required: "مطلوب" })} />
        </div>

        <div className="space-y-2">
          <Label>القسم</Label>
          <Input {...register("department", { required: "مطلوب" })} />
        </div>

        <div className="space-y-2">
          <Label>المنطقة</Label>
          <Input {...register("region")} />
        </div>
      </div>

      {/* قسم الصلاحيات */}
      <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
        <PermissionsSelector
          selectedPermissions={selectedPermissions || []}
          onChange={(perms) => setValue("permissions", perms)}
        />
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button type="button" variant="ghost" onClick={onSuccess}>إلغاء</Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "حفظ وإنشاء"}
        </Button>
      </div>
    </form>
  );
}