"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, login } = useAuth(); // login هنا تستخدم لتحديث الستيت
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
    }
  }, [user, setValue]);

  // تحديث البيانات النصية
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put("/Users/update-profile", data);
    },
    onSuccess: () => {
      toast.success("تم تحديث البيانات بنجاح");
      // ملاحظة: يُفضل عمل endpoint لجلب بيانات اليوزر الحالي لتحديث الـ Context
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "فشل التحديث"),
  });

  // رفع الصورة
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/Users/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (res) => {
      toast.success("تم تغيير الصورة");
      if(user) login({ ...user, userData: { ...user, profilePictureUrl: res.data.url } } as any); // تحديث وهمي سريع
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadImageMutation.mutate(e.target.files[0]);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container max-w-2xl mx-auto py-10" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* تغيير الصورة */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              {/* <AvatarImage src={user.profilePictureUrl} /> */}
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    تغيير الصورة
                </Button>
                <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
          </div>

          {/* الفورم */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label>الاسم بالكامل</label>
              <Input {...register("fullName")} />
            </div>

            <div className="space-y-2">
              <label>كلمة المرور الجديدة (اختياري)</label>
              <Input type="password" {...register("newPassword")} placeholder="اتركها فارغة إذا لم ترد التغيير" />
            </div>

            <Button type="submit" disabled={updateMutation.isPending} className="w-full bg-green-700 hover:bg-green-600">
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}