"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

type OrgNode = {
  id: string;
  name: string;
  type: number;
  children: OrgNode[];
};

export default function SelectOrgPage() {
  const { loadMyAccess } = useAuth();
  const [tree, setTree] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get("/org/tree");
      setTree(res.data || []);
      setLoading(false);
    })();
  }, []);

  const pick = async (id: string) => {
    await loadMyAccess(id);
    location.href = "/dashboard";
  };

  const Node = ({ n, level }: { n: OrgNode; level: number }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2" style={{ marginRight: level * 16 }}>
        <Button variant="outline" onClick={() => pick(n.id)}>
          اختيار
        </Button>
        <span className="font-medium">{n.name}</span>
        <span className="text-xs text-muted-foreground">
          {n.type === 1 ? "وجه" : n.type === 2 ? "فرع" : n.type === 3 ? "قسم" : "فريق"}
        </span>
      </div>
      {n.children?.map((c) => (
        <Node key={c.id} n={c} level={level + 1} />
      ))}
    </div>
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-4">اختيار الفرع/القسم</h1>
      <div className="space-y-3">
        {tree.map((n) => (
          <Node key={n.id} n={n} level={0} />
        ))}
      </div>
    </div>
  );
}
