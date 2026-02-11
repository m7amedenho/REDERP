"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Calendar,
  Clock,
  Truck,
  Plus,
  Save,
  X,
  Package,
  Warehouse,
  User,
  Hash,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Transaction } from "@/lib/types/inventory";

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  warehouses: { id: string; name: string }[];
  items: { id: string; name: string; code: string; unit: string }[];
  onSave: (transaction: Partial<Transaction>) => Promise<void>;
}

interface FormData {
  type: "وارد" | "صادر" | "تحويل" | "تسوية";
  date: string;
  time: string;
  warehouseId: string;
  itemId: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
  userId: string;
}

const transactionTypes = [
  { value: "وارد", label: "حركة واردة", icon: "📥" },
  { value: "صادر", label: "حركة صادرة", icon: "📤" },
  { value: "تحويل", label: "حركة تحويل", icon: "🔄" },
  { value: "تسوية", label: "حركة تسوية", icon: "⚖️" },
];

// بيانات تجريبية للمستخدمين
const users = [
  { id: "user1", name: "أحمد محمد" },
  { id: "user2", name: "فاطمة علي" },
  { id: "user3", name: "محمد خالد" },
  { id: "user4", name: "سارة أحمد" },
  { id: "user5", name: "علي حسن" },
];

export function TransactionDrawer({
  open,
  onClose,
  transaction,
  warehouses,
  items,
  onSave,
}: TransactionDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      type: "وارد",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      warehouseId: "",
      itemId: "",
      quantity: 0,
      unit: "",
      lotNumber: "",
      expiryDate: "",
      notes: "",
      userId: "",
    },
  });

  const selectedType = watch("type");
  const selectedWarehouseId = watch("warehouseId");

  // تحديث النموذج عند فتح الحركة للتعديل
  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        date: transaction.date,
        time: transaction.time,
        warehouseId: transaction.warehouseId,
        itemId: transaction.itemId,
        quantity: transaction.quantity,
        unit: transaction.unit,
        lotNumber: transaction.lotNumber || "",
        expiryDate: transaction.expiryDate || "",
        notes: transaction.notes || "",
        userId: transaction.userId,
      });
      setSelectedWarehouse(transaction.warehouseId);
      setSelectedItem(transaction.itemId);
    } else {
      reset({
        type: "وارد",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        warehouseId: "",
        itemId: "",
        quantity: 0,
        unit: "",
        lotNumber: "",
        expiryDate: "",
        notes: "",
        userId: "",
      });
      setSelectedWarehouse("");
      setSelectedItem("");
    }
  }, [transaction, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const transactionData: Partial<Transaction> = {
        type: data.type,
        date: data.date,
        time: data.time,
        warehouseId: data.warehouseId,
        warehouseName:
          warehouses.find((w) => w.id === data.warehouseId)?.name || "",
        itemId: data.itemId,
        itemName: items.find((i) => i.id === data.itemId)?.name || "",
        itemCode: items.find((i) => i.id === data.itemId)?.code || "",
        quantity: data.quantity,
        unit: data.unit,
        lotNumber: data.lotNumber || undefined,
        expiryDate: data.expiryDate || undefined,
        notes: data.notes || undefined,
        userId: data.userId,
        userName: users.find((u) => u.id === data.userId)?.name || "",
        status: "مكتمل",
        createdAt: new Date().toISOString(),
      };

      await onSave(transactionData);

      toast.success(
        transaction ? "تم تحديث الحركة بنجاح" : "تم إضافة الحركة بنجاح"
      );
      onClose();
    } catch (error) {
      console.error("خطأ في حفظ الحركة:", error);
      toast.error("فشل في حفظ الحركة");
    } finally {
      setLoading(false);
    }
  };

  // تحديث الوحدة عند اختيار الصنف
  useEffect(() => {
    if (selectedItem) {
      const item = items.find((i) => i.id === selectedItem);
      if (item) {
        setValue("unit", item.unit);
      }
    }
  }, [selectedItem, items, setValue]);

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-[95vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            {transaction ? "تعديل الحركة" : "إضافة حركة جديدة"}
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* نوع الحركة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">نوع الحركة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {transactionTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={
                        watch("type") === type.value ? "default" : "outline"
                      }
                      onClick={() => setValue("type", type.value as any)}
                      className="h-16 flex-col gap-2"
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-sm">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* التاريخ والوقت */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">التاريخ والوقت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">التاريخ *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register("date", { required: "التاريخ مطلوب" })}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">الوقت *</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register("time", { required: "الوقت مطلوب" })}
                    />
                    {errors.time && (
                      <p className="text-sm text-red-500">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المخزن والصنف */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المخزن والصنف</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="warehouseId">المخزن *</Label>
                    <Select
                      value={watch("warehouseId")}
                      onValueChange={(value) => {
                        setValue("warehouseId", value);
                        setSelectedWarehouse(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المخزن" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.warehouseId && (
                      <p className="text-sm text-red-500">
                        {errors.warehouseId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemId">الصنف *</Label>
                    <Select
                      value={watch("itemId")}
                      onValueChange={(value) => {
                        setValue("itemId", value);
                        setSelectedItem(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصنف" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <span>{item.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.code}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.itemId && (
                      <p className="text-sm text-red-500">
                        {errors.itemId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      {...register("quantity", {
                        required: "الكمية مطلوبة",
                        valueAsNumber: true,
                      })}
                      placeholder="مثال: 50"
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-500">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">الوحدة</Label>
                    <Input
                      id="unit"
                      {...register("unit")}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* معلومات إضافية حسب نوع الحركة */}
            {(selectedType === "وارد" || selectedType === "تحويل") && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات إضافية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedType === "وارد" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lotNumber">رقم اللوط</Label>
                        <Input
                          id="lotNumber"
                          {...register("lotNumber")}
                          placeholder="رقم اللوط (اختياري)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          {...register("expiryDate")}
                        />
                      </div>
                    </div>
                  )}

                  {selectedType === "تحويل" && (
                    <div className="space-y-2">
                      <Label>تحويل إلى مخزن آخر</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المخزن المستهدف" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses
                            .filter((w) => w.id !== selectedWarehouseId)
                            .map((warehouse) => (
                              <SelectItem
                                key={warehouse.id}
                                value={warehouse.id}
                              >
                                {warehouse.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="ملاحظات إضافية حول الحركة (اختياري)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* المستخدم المسؤول */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المستخدم المسؤول</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="userId">المستخدم *</Label>
                  <Select
                    value={watch("userId")}
                    onValueChange={(value) => setValue("userId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستخدم المسؤول" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.userId && (
                    <p className="text-sm text-red-500">
                      {errors.userId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
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
              {loading
                ? "جاري الحفظ..."
                : transaction
                ? "تحديث الحركة"
                : "إضافة الحركة"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
