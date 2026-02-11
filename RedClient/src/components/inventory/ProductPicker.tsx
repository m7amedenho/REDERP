"use client";

import { useEffect, useMemo, useState } from "react";
import { catalogApi, CatalogProduct } from "@/lib/api/catalog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ProductPicker({
  value,
  onChange,
  placeholder = "ابحث بالصنف (اسم/كود)...",
}: {
  value: string;
  onChange: (productId: string, product?: CatalogProduct) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const selected = useMemo(() => items.find((x) => x.id === value), [items, value]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const list = await catalogApi.products(q);
      setItems(list ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-2">
      <Input className="rounded-xl" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
      <div className="max-h-[320px] overflow-auto rounded-2xl border p-2">
        <div className="grid gap-2">
          {items.map((p) => (
            <Card
              key={p.id}
              className={cn(
                "p-3 rounded-2xl cursor-pointer hover:bg-muted/50 transition",
                value === p.id && "border-primary"
              )}
              onClick={() => onChange(p.id, p)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={p.imageUrl ?? ""} alt={p.name} />
                  <AvatarFallback>{(p.name ?? "P").slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.code}</div>
                </div>
                <div className="ms-auto text-xs text-muted-foreground">
                  {p.isLotTracked ? "Lot" : "—"} • {p.isExpiryTracked ? "Expiry" : "—"}
                </div>
              </div>
            </Card>
          ))}
          {!items.length ? <div className="text-sm text-muted-foreground p-3">لا توجد نتائج</div> : null}
        </div>
      </div>

      {selected ? (
        <div className="text-xs text-muted-foreground">
          المختار: <span className="font-medium text-foreground">{selected.code} — {selected.name}</span>
        </div>
      ) : null}
    </div>
  );
}
