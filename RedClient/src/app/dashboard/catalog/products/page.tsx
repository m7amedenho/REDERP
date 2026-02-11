"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchProducts, CatalogProduct } from "@/lib/api/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<CatalogProduct[]>([]);

  async function load(query?: string) {
    setLoading(true);
    try {
      const data = await searchProducts(query);
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || "فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-4" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">المنتجات</h1>
          <p className="text-muted-foreground text-sm">
            إدارة الأصناف (Lot / Expiry flags) + الانتقال للأسعار
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/catalog/products/new">+ إضافة صنف</Link>
          </Button>
          <Button variant="secondary" onClick={() => load(q)}>
            تحديث
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو الكود..."
          />
          <Button
            onClick={() => load(q)}
            disabled={loading}
            className="shrink-0"
          >
            بحث
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          مفيش منتجات… ابدأ بإضافة صنف جديد.
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center text-xs">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    "IMG"
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold">{p.name}</div>
                    <Badge variant="secondary">{p.code}</Badge>
                    {p.isLotTracked && <Badge>Lot</Badge>}
                    {p.isExpiryTracked && <Badge variant="outline">Expiry</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Max Discount: {p.maxDiscountPercent}%
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/dashboard/catalog/products/${p.id}/prices`)}
                  >
                    الأسعار
                  </Button>
                  {/* <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/catalog/products/${p.id}`)}
                  >
                    تفاصيل
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
