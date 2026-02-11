"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function ZplPreview({ zpl }: { zpl: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(zpl);
    toast.success("تم نسخ ZPL");
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium">ZPL (Zebra)</div>
          <Button variant="secondary" onClick={copy}>
            نسخ
          </Button>
        </div>
        <pre className="mt-3 max-h-[420px] overflow-auto rounded-xl bg-muted p-3 text-xs ltr">
          {zpl}
        </pre>
      </CardContent>
    </Card>
  );
}
