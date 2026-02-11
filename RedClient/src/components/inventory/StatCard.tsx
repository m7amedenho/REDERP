"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value?: string;
  hint?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className={cn("hover:shadow-md transition rounded-2xl")}>
        <CardContent className="p-5">
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="mt-2 text-2xl font-semibold">{value ?? "—"}</div>
          {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
        </CardContent>
      </Card>
    </Link>
  );
}
