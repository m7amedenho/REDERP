"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api/catalog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();

  const [saving, setSaving] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [baseUnitId, setBaseUnitId] = React.useState("");
  const [maxDiscountPercent, setMaxDiscountPercent] = React.useState<number>(0);

  const [isLotTracked, setIsLotTracked] = React.useState(true);
  const [isExpiryTracked, setIsExpiryTracked] = React.useState(true);

   async function onSubmit() {
    if (!code.trim() || !name.trim() || !baseUnitId.trim()) {
      toast.error("الكود + الاسم + BaseUnitId مطلوبين");
      return;
    }

  
    if (maxDiscountPercent < 0 || maxDiscountPercent > 100) {
      toast.error("Max Discount لازم يكون من 0 إلى 100");
      return;
    }

    setSaving(true);
    try {
      await createProduct({
        code: code.trim(),
        name: name.trim(),
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
        isLotTracked,
        isExpiryTracked,
        baseUnitId: baseUnitId.trim(),
        maxDiscountPercent: Number(maxDiscountPercent || 0) / 100,
      });

      toast.success("تم إضافة الصنف");
      router.push("/dashboard/catalog/products");
    } catch (e: any) {
      console.log("CreateProduct error:", e?.response?.data || e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e?.message ||
        "فشل إضافة الصنف";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="container mx-auto py-8 space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">إضافة صنف جديد</h1>
        <p className="text-muted-foreground text-sm">
          مهم: لو IsExpiryTracked = true يبقى لازم الـ expiry يتسجل وقت الاستلام/الجرد… إلخ.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>كود الصنف</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="TM-025" />
          </div>

          <div className="space-y-2">
            <Label>اسم الصنف</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="طماطم 025" />
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label>Base Unit Id</Label>
            <Input value={baseUnitId} onChange={(e) => setBaseUnitId(e.target.value)} placeholder="UUID" />
          </div>

          <div className="space-y-2">
            <Label>Max Discount %</Label>
            <Input
              type="number"
              value={maxDiscountPercent}
              onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="font-medium">Lot Tracking</div>
              <div className="text-xs text-muted-foreground">يتطلب LotCode وقت الـ IN/OUT</div>
            </div>
            <Switch checked={isLotTracked} onCheckedChange={setIsLotTracked} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="font-medium">Expiry Tracking</div>
              <div className="text-xs text-muted-foreground">يتطلب ExpiryDate (زي ما أنت قلت)</div>
            </div>
            <Switch checked={isExpiryTracked} onCheckedChange={setIsExpiryTracked} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onSubmit} disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </Button>
          <Button variant="secondary" onClick={() => router.back()}>
            رجوع
          </Button>
        </div>
      </Card>
    </div>
  );
}
