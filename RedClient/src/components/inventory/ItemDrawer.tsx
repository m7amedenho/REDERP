"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, X, Package } from "lucide-react";
import { InventoryItem, ItemUnit } from "@/lib/types/inventory";

interface ItemDrawerProps {
  open: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
  onSave: (item: Partial<InventoryItem>) => Promise<void>;
}

interface FormData {
  code: string;
  name: string;
  category: string;
  description: string;
  baseUnit: string;
  supportsBarcode: boolean;
  supportsExpiry: boolean;
  supportsLot: boolean;
  hasMultipleUnits: boolean;
  supportsBooking: boolean;
  status: "نشط" | "غير نشط";
  currentStock: number;
  minStock: number;
  maxStock: number;
  units: {
    unit: string;
    purchase: number;
    wholesale: number;
    half: number;
    retail: number;
    usd: number;
  }[];
}

const categories = [
  "البذور والشتلات",
  "المبيدات",
  "الأدوات الزراعية",
  "الأسمدة",
  "الآلات والمعدات",
  "المواد الخام",
  "المنتجات النهائية",
  "أخرى",
];

const units = [
  "كيلوجرام",
  "جرام",
  "لتر",
  "مليلتر",
  "قطعة",
  "علبة",
  "كيس",
  "صندوق",
  "طن",
  "متر",
  "سنتيمتر",
  "متر مربع",
  "أخرى",
];

export function ItemDrawer({ open, onClose, item, onSave }: ItemDrawerProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      code: "",
      name: "",
      category: "",
      description: "",
      baseUnit: "",
      supportsBarcode: false,
      supportsExpiry: false,
      supportsLot: false,
      hasMultipleUnits: false,
      supportsBooking: false,
      status: "نشط",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      units: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  });

  const hasMultipleUnits = watch("hasMultipleUnits");

  // تحديث النموذج عند فتح الصنف للتعديل
  useEffect(() => {
    if (item) {
      reset({
        code: item.code,
        name: item.name,
        category: item.category,
        description: item.description || "",
        baseUnit: item.baseUnit,
        supportsBarcode: item.supportsBarcode,
        supportsExpiry: item.supportsExpiry,
        supportsLot: item.supportsLot,
        hasMultipleUnits: item.hasMultipleUnits,
        status: item.status,
        currentStock: item.currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        units: item.units || [],
      });
    } else {
      reset({
        code: "",
        name: "",
        category: "",
        description: "",
        baseUnit: "",
        supportsBarcode: false,
        supportsExpiry: false,
        supportsLot: false,
        hasMultipleUnits: false,
        status: "نشط",
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        units: [],
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const itemData: Partial<InventoryItem> = {
        code: data.code,
        name: data.name,
        category: data.category,
        description: data.description,
        baseUnit: data.baseUnit,
        supportsBarcode: data.supportsBarcode,
        supportsExpiry: data.supportsExpiry,
        supportsLot: data.supportsLot,
        hasMultipleUnits: data.hasMultipleUnits,
        status: data.status,
        currentStock: data.currentStock,
        minStock: data.minStock,
        maxStock: data.maxStock,
        units: data.units.length > 0 ? data.units : undefined,
        updatedAt: new Date().toISOString(),
      };

      if (!item) {
        itemData.createdAt = new Date().toISOString();
      }

      await onSave(itemData);

      toast.success(item ? "تم تحديث الصنف بنجاح" : "تم إضافة الصنف بنجاح");
      onClose();
    } catch (error) {
      console.error("خطأ في حفظ الصنف:", error);
      toast.error("فشل في حفظ الصنف");
    } finally {
      setLoading(false);
    }
  };

  const addUnit = () => {
    append({
      unit: "",
      purchase: 0,
      wholesale: 0,
      half: 0,
      retail: 0,
      usd: 0,
    });
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-[95vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {item ? "تعديل الصنف" : "إضافة صنف جديد"}
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">كود الصنف *</Label>
                    <Input
                      id="code"
                      {...register("code", { required: "كود الصنف مطلوب" })}
                      placeholder="مثال: SEED-001"
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500">
                        {errors.code.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الصنف *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "اسم الصنف مطلوب" })}
                      placeholder="مثال: بذور طماطم هجين F1"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="category">الفئة *</Label>
                    <Select
                      value={watch("category")}
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger className="w-full" dir="rtl">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseUnit">الوحدة الأساسية *</Label>
                    <Select
                      value={watch("baseUnit")}
                      onValueChange={(value) => setValue("baseUnit", value)}
                    >
                      <SelectTrigger className="w-full" dir="rtl">
                        <SelectValue placeholder="اختر الوحدة" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.baseUnit && (
                      <p className="text-sm text-red-500">
                        {errors.baseUnit.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>الحالة</Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value: "نشط" | "غير نشط") =>
                        setValue("status", value)
                      }
                    >
                      <SelectTrigger className="w-full" dir="rtl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="نشط">نشط</SelectItem>
                        <SelectItem value="غير نشط">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="وصف تفصيلي للصنف (اختياري)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* الميزات المدعومة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الميزات المدعومة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="px-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="supportsBarcode"
                        checked={watch("supportsBarcode")}
                        onCheckedChange={(checked) =>
                          setValue("supportsBarcode", !!checked)
                        }
                      />
                      <Label
                        htmlFor="supportsBarcode"
                        className="text-sm font-medium"
                      >
                        دعم الباركود
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="supportsExpiry"
                        checked={watch("supportsExpiry")}
                        onCheckedChange={(checked) =>
                          setValue("supportsExpiry", !!checked)
                        }
                      />
                      <Label
                        htmlFor="supportsExpiry"
                        className="text-sm font-medium"
                      >
                        دعم تاريخ الصلاحية
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="supportsLot"
                        checked={watch("supportsLot")}
                        onCheckedChange={(checked) =>
                          setValue("supportsLot", !!checked)
                        }
                      />
                      <Label
                        htmlFor="supportsLot"
                        className="text-sm font-medium"
                      >
                        دعم اللوطات والدفعات
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="supportsBooking"
                        checked={watch("supportsBooking")}
                        onCheckedChange={(checked) =>
                          setValue("supportsBooking", !!checked)
                        }
                      />
                      <Label
                        htmlFor="supportsLot"
                        className="text-sm font-medium"
                      >
                        دعم للحجوزات والطلبات
                      </Label>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasMultipleUnits"
                          checked={watch("hasMultipleUnits")}
                          onCheckedChange={(checked) =>
                            setValue("hasMultipleUnits", !!checked)
                          }
                        />
                        <Label
                          htmlFor="hasMultipleUnits"
                          className="text-sm font-medium"
                        >
                          وحدات متعددة
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات المخزون */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إعدادات المخزون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">الرصيد الحالي</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      {...register("currentStock", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock">الحد الأدنى</Label>
                    <Input
                      id="minStock"
                      type="number"
                      {...register("minStock", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStock">الحد الأقصى</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      {...register("maxStock", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الوحدات المتعددة */}
            {hasMultipleUnits && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">الوحدات والأسعار</CardTitle>
                    <Button
                      type="button"
                      onClick={addUnit}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة وحدة
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline">الوحدة {index + 1}</Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            className="gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div className="space-y-2">
                            <Label>الوحدة</Label>
                            <Input placeholder="مثال : كرتونة" />
                          </div>

                          <div className="space-y-2">
                            <Label>سعر الشراء</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`units.${index}.purchase`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سعر الجملة</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`units.${index}.wholesale`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سعر النص جملة</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`units.${index}.half`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سعر المستهلك</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`units.${index}.retail`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سعر الدولار</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register(`units.${index}.usd`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    {fields.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        لا توجد وحدات مضافة
                        <br />
                        <Button
                          type="button"
                          onClick={addUnit}
                          variant="outline"
                          className="mt-2 gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          إضافة الوحدة الأولى
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-2 justify-end p-6 border-t bg-muted/50">
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
              {loading ? "جاري الحفظ..." : item ? "تحديث الصنف" : "إضافة الصنف"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
