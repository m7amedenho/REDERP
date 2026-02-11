"use client";

import { useEffect, useState } from "react";
import { inventoryApi } from "@/lib/api/inventory";
import { apiErrorMessage } from "@/lib/api/http";
import { PageHeader } from "@/components/inventory/PageHeader";
import { ZplPreview } from "@/components/inventory/ZplPreview";
import { toast } from "sonner";

export default function TokenClient({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await inventoryApi.getBarcode(token);
        setData(r);
      } catch (e) {
        toast.error(apiErrorMessage(e));
      }
    })();
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader title="تفاصيل الباركود" subtitle={`Token: ${token}`} />
      {data?.zpl ? <ZplPreview zpl={data.zpl} /> : <div className="text-sm text-muted-foreground">لا يوجد بيانات</div>}
    </div>
  );
}
