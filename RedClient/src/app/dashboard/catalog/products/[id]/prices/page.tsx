"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/axios"; // نفس ملف axios بتاعك
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";

type ProductLite = {
  id: string;
  code: string;
  name: string;
  imageUrl?: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const PriceType = {
  Purchase: 1,
  Wholesale: 2,
  SemiWholesale: 3,
  Retail: 4,
  USD: 5,
} as const;

type PriceForm = {
  purchase: string;
  wholesale: string;
  semiWholesale: string;
  retail: string;
  usd: string;
};

function toNumberOrZero(v: string) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function ProductPricesPage({ params }: PageProps) {
  const router = useRouter();

  const [productId, setProductId] = useState<string>("");
  const [product, setProduct] = useState<ProductLite | null>(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PriceForm>({
    purchase: "0",
    wholesale: "0",
    semiWholesale: "0",
    retail: "0",
    usd: "0",
  });

  useEffect(() => {
    (async () => {
      const p = await params;
      setProductId(p.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    (async () => {
      setLoading(true);
      try {
        // عندنا GET /api/catalog/products/{id} بيرجع Product كامل + Prices
        const r = await api.get(`/catalog/products/${productId}`);
        const prod = r.data;

        setProduct({
          id: prod.id,
          code: prod.code,
          name: prod.name,
          imageUrl: prod.imageUrl,
        });

        // لو عندك Prices جوه prod.prices (list) هنعمل mapping عليها
        const prices: Array<{ type: number; amount: number; unitId?: string | null }> = prod.prices ?? [];

        const get = (t: number) => {
          const row = prices.find((x) => x.type === t && (x.unitId == null));
          return row ? String(row.amount ?? 0) : "0";
        };

        setForm({
          purchase: get(PriceType.Purchase),
          wholesale: get(PriceType.Wholesale),
          semiWholesale: get(PriceType.SemiWholesale),
          retail: get(PriceType.Retail),
          usd: get(PriceType.USD),
        });
      } catch (e: any) {
        toast.error("فشل تحميل بيانات الصنف");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const title = useMemo(() => {
    if (!product) return "أسعار الصنف";
    return `أسعار الصنف — ${product.name} (${product.code})`;
  }, [product]);

  async function upsert(type: number, amount: number) {
    // UpsertPriceDto(Guid ProductId, PriceType Type, decimal Amount, Guid? UnitId)
    await api.post(`/catalog/prices/upsert`, {
      productId,
      type,
      amount,
      unitId: null,
    });
  }

  const onSave = async () => {
    if (!productId) return;
    setSaving(true);
    try {
      await Promise.all([
        upsert(PriceType.Purchase, toNumberOrZero(form.purchase)),
        upsert(PriceType.Wholesale, toNumberOrZero(form.wholesale)),
        upsert(PriceType.SemiWholesale, toNumberOrZero(form.semiWholesale)),
        upsert(PriceType.Retail, toNumberOrZero(form.retail)),
        upsert(PriceType.USD, toNumberOrZero(form.usd)),
      ]);

      toast.success("تم حفظ الأسعار بنجاح");
      router.back();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "حصل خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">نظام شركة أليكس</h1>
          <p className="text-muted-foreground">Alex for Agriculture Tools — نظام إدارة الشركة</p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={saving}>
            <ArrowRight className="ml-2 h-4 w-4" />
            رجوع
          </Button>
          <Button onClick={onSave} disabled={loading || saving}>
            <Save className="ml-2 h-4 w-4" />
            حفظ
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{loading ? "..." : title}</CardTitle>
          <CardDescription>
            ملاحظة: endpoint بتاع upsert مش بيرجع body — ده طبيعي، احنا شغالين toast + redirect.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <PriceField
                label="سعر الشراء (Supply / Purchase)"
                value={form.purchase}
                onChange={(v) => setForm((s) => ({ ...s, purchase: v }))}
              />
              <PriceField
                label="سعر الجملة (Wholesale)"
                value={form.wholesale}
                onChange={(v) => setForm((s) => ({ ...s, wholesale: v }))}
              />

              <PriceField
                label="سعر نص جملة (SemiWholesale)"
                value={form.semiWholesale}
                onChange={(v) => setForm((s) => ({ ...s, semiWholesale: v }))}
              />
              <PriceField
                label="سعر المستهلك (Retail)"
                value={form.retail}
                onChange={(v) => setForm((s) => ({ ...s, retail: v }))}
              />

              <div className="md:col-span-2">
                <Separator className="my-2" />
                <PriceField
                  label="سعر الدولار (USD)"
                  value={form.usd}
                  onChange={(v) => setForm((s) => ({ ...s, usd: v }))}
                />
              </div>

              <div className="md:col-span-2 mt-2">
                <Button className="w-full" onClick={onSave} disabled={saving}>
                  <Save className="ml-2 h-4 w-4" />
                  {saving ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <Input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="h-11"
      />
    </div>
  );
}
