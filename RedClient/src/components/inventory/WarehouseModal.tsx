"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Warehouse,
  Plus,
  Save,
  X,
  Users,
  Package,
  Activity,
} from "lucide-react";
import { Warehouse as WarehouseType } from "@/lib/types/inventory";

interface WarehouseModalProps {
  open: boolean;
  onClose: () => void;
  warehouse?: WarehouseType | null;
  onSave: (warehouse: Partial<WarehouseType>) => Promise<void>;
}

interface FormData {
  name: string;
  location: string;
  type: "رئيسي" | "فرعي" | "معرض" | "مرتجع";
  capacity: number;
  status: "نشط" | "غير نشط" | "صيانة";
  description: string;
  allowedUsers: string[];
  sections: {
    name: string;
    capacity: number;
  }[];
}

const warehouseTypes = [
  { value: "رئيسي", label: "مخزن رئيسي" },
  { value: "فرعي", label: "مخزن فرعي" },
  { value: "معرض", label: "معرض" },
  { value: "مرتجع", label: "مخزن مرتجعات" },
];

const statuses = [
  { value: "نشط", label: "نشط" },
  { value: "غير نشط", label: "غير نشط" },
  { value: "صيانة", label: "تحت الصيانة" },
];

// بيانات تجريبية للمستخدمين
const users = [
  { id: "user1", name: "أحمد محمد" },
  { id: "user2", name: "فاطمة علي" },
  { id: "user3", name: "محمد خالد" },
  { id: "user4", name: "سارة أحمد" },
  { id: "user5", name: "علي حسن" },
  { id: "user6", name: "نورة سالم" },
  { id: "user7", name: "خالد عبدالله" },
  { id: "user8", name: "مريم سعيد" },
];

export function WarehouseModal({
  open,
  onClose,
  warehouse,
  onSave,
}: WarehouseModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      location: "",
      type: "رئيسي",
      capacity: 0,
      status: "نشط",
      description: "",
      allowedUsers: [],
      sections: [],
    },
  });

  // تحديث النموذج عند فتح المخزن للتعديل
  useEffect(() => {
    if (warehouse) {
      reset({
        name: warehouse.name,
        location: warehouse.location,
        type: warehouse.type,
        capacity: warehouse.capacity,
        status: warehouse.status,
        description: "",
        allowedUsers: warehouse.allowedUsers,
        sections: warehouse.sections || [],
      });
      setSelectedUsers(warehouse.allowedUsers);
    } else {
      reset({
        name: "",
        location: "",
        type: "رئيسي",
        capacity: 0,
        status: "نشط",
        description: "",
        allowedUsers: [],
        sections: [],
      });
      setSelectedUsers([]);
    }
  }, [warehouse, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const warehouseData: Partial<WarehouseType> = {
        name: data.name,
        location: data.location,
        type: data.type,
        capacity: data.capacity,
        status: data.status,
        allowedUsers: selectedUsers,

        updatedAt: new Date().toISOString(),
      };

      if (!warehouse) {
        warehouseData.createdAt = new Date().toISOString();
        warehouseData.currentStock = 0;
        warehouseData.utilization = 0;
        warehouseData.itemCount = 0;
      }

      await onSave(warehouseData);

      toast.success(
        warehouse ? "تم تحديث المخزن بنجاح" : "تم إضافة المخزن بنجاح"
      );
      onClose();
    } catch (error) {
      console.error("خطأ في حفظ المخزن:", error);
      toast.error("فشل في حفظ المخزن");
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Warehouse className="w-5 h-5" />
            {warehouse ? "تعديل المخزن" : "إضافة مخزن جديد"}
          </DialogTitle>
          <DialogDescription>
            {warehouse
              ? "تعديل معلومات المخزن وإعداداته"
              : "إضافة مخزن جديد إلى نظام المخزون"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* المعلومات الأساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المخزن *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "اسم المخزن مطلوب" })}
                    placeholder="مثال: مخزن البذور الرئيسي"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">الموقع *</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "الموقع مطلوب" })}
                    placeholder="مثال: النهضة - سند 1"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع المخزن *</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(
                      value: "رئيسي" | "فرعي" | "معرض" | "مرتجع"
                    ) => setValue("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المخزن" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">السعة الإجمالية *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register("capacity", {
                      required: "السعة مطلوبة",
                      valueAsNumber: true,
                    })}
                    placeholder="مثال: 10000"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">حالة المخزن</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value: "نشط" | "غير نشط" | "صيانة") =>
                    setValue("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="وصف المخزن واستخداماته (اختياري)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* المستخدمون المسموحون */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                المستخدمون المسموحون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={user.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.name}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>عدد المستخدمين المحددين:</span>
                  <Badge variant="outline">{selectedUsers.length} مستخدم</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* إحصائيات حالية (للمخازن الموجودة فقط) */}
          {warehouse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  الإحصائيات الحالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {warehouse.currentStock.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      الرصيد الحالي
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {warehouse.utilization}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      نسبة الاستخدام
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {warehouse.itemCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      عدد الأصناف
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* أزرار التحكم */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading
                ? "جاري الحفظ..."
                : warehouse
                ? "تحديث المخزن"
                : "إضافة المخزن"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
