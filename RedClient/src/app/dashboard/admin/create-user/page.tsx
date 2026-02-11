"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "@/actions/create-user";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department: string;
  permissions: string[];
  warehouses: string[];
}

const permissionsList = [
  { label: "عرض البذور", value: "seeds.view" },
  { label: "إدارة العملاء", value: "crm.manage" },
  { label: "تقارير الحسابات", value: "accounts.reports" },
  { label: "فواتير المبيدات", value: "pesticides.invoices" },
];

const warehouseOptions = [
  { label: "مخزن البذور", value: "seed-warehouse" },
  { label: "مخزن المبيدات", value: "pesticide-warehouse" },
  { label: "مخزن الشتلات", value: "nursery-warehouse" },
];

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      department: "",
      permissions: [],
      warehouses: [],
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      await createUser(values);
      toast.success("تم إنشاء المستخدم بنجاح");
    } catch (error: any) {
      console.error(error);
      toast.error("فشل في إنشاء المستخدم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-6 py-6">
      <Card className="border rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-8">
          إنشاء مستخدم جديد
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* القسم الأول - المعلومات الأساسية */}
            <div className="space-y-6">
              {/* الاسم الأول والأخير */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: "يرجى إدخال الاسم الأول",
                    })}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: "يرجى إدخال الاسم الأخير",
                    })}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* البريد الإلكتروني وكلمة المرور */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "يرجى إدخال البريد الإلكتروني",
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "يرجى إدخال كلمة المرور",
                    })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* الدور الوظيفي والقسم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">الدور الوظيفي</Label>
                  <Input
                    id="role"
                    placeholder="مثلاً: مدير حسابات"
                    {...register("role", {
                      required: "يرجى إدخال الدور الوظيفي",
                    })}
                    className={errors.role ? "border-red-500" : ""}
                  />
                  {errors.role && (
                    <p className="text-sm text-red-500">
                      {errors.role.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    placeholder="مثلاً: الحسابات، المبيدات، المشتل..."
                    {...register("department", {
                      required: "يرجى إدخال القسم",
                    })}
                    className={errors.department ? "border-red-500" : ""}
                  />
                  {errors.department && (
                    <p className="text-sm text-red-500">
                      {errors.department.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* القسم الثاني - الصلاحيات والمخازن */}
            <div className="space-y-6">
              {/* الصلاحيات */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">الصلاحيات</Label>
                <div className="grid grid-cols-1 gap-2">
                  {permissionsList.map((permission) => (
                    <div
                      key={permission.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission.value}
                        onCheckedChange={(checked) => {
                          const current = watch("permissions") || [];
                          setValue(
                            "permissions",
                            checked
                              ? [...current, permission.value]
                              : current.filter(
                                  (value: string) => value !== permission.value
                                )
                          );
                        }}
                      />
                      <Label
                        htmlFor={permission.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* المخازن */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  المخازن المسموح بها
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {warehouseOptions.map((warehouse) => (
                    <div
                      key={warehouse.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={warehouse.value}
                        onCheckedChange={(checked) => {
                          const current = watch("warehouses") || [];
                          setValue(
                            "warehouses",
                            checked
                              ? [...current, warehouse.value]
                              : current.filter(
                                  (value: string) => value !== warehouse.value
                                )
                          );
                        }}
                      />
                      <Label
                        htmlFor={warehouse.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                      >
                        {warehouse.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* زر الإنشاء */}
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? "جاري إنشاء المستخدم..." : "إنشاء المستخدم"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
