import { ReactNode } from "react";
import Link from "next/link";

const items = [
  { href: "/dashboard/inventory", label: "نظرة عامة" },
  { href: "/dashboard/inventory/warehouses", label: "المخازن" },
  { href: "/dashboard/inventory/docs/new", label: "مستند جديد" },
  { href: "/dashboard/inventory/stock/onhand", label: "أرصدة المخزون" },
  { href: "/dashboard/inventory/counts/new", label: "جرد جديد" },
  { href: "/dashboard/inventory/barcodes/rep-package", label: "باركود مندوب" },
  { href: "/dashboard/inventory/reports/valuation", label: "تقارير" },
];

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="rounded-full border px-4 py-2 text-sm hover:bg-muted transition"
            >
              {i.label}
            </Link>
          ))}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
