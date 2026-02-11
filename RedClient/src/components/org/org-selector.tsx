"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { buildTree, OrgNode, OrgUnitFlat, orgTypeLabel } from "@/lib/orgTree";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  /** لو الهيدر عندك بيعرض children، سيبها فاضية */
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function OrgSelector(_props: Props) {
  const { selectedOrgUnitId, loadMyAccess, permissions } = useAuth();

  const [flat, setFlat] = useState<OrgUnitFlat[]>([]);
  const [loading, setLoading] = useState(true);

  // multi-select checkboxes (للعرض/الفلترة فقط)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // selected = اللي فعليًا بيتبعت للباك
  const [activeId, setActiveId] = useState<string | null>(selectedOrgUnitId);

  const [q, setQ] = useState("");

  const tree = useMemo(() => buildTree(flat), [flat]);

  const canView = permissions.includes("Org.View");

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.get<OrgUnitFlat[]>("/org/tree");
      setFlat(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveId(selectedOrgUnitId);
    if (selectedOrgUnitId) {
      setCheckedIds(new Set([selectedOrgUnitId]));
    }
  }, [selectedOrgUnitId]);

  useEffect(() => {
    if (!canView) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTree = useMemo(() => {
    if (!q.trim()) return tree;
    const query = normalize(q);

    const filterRec = (n: OrgNode): OrgNode | null => {
      const kids = n.children.map(filterRec).filter(Boolean) as OrgNode[];
      const hit = normalize(n.name).includes(query);
      if (hit || kids.length) return { ...n, children: kids };
      return null;
    };

    return tree.map(filterRec).filter(Boolean) as OrgNode[];
  }, [tree, q]);

  const toggleChecked = (id: string, v: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (v) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const applyActive = async (id: string) => {
    try {
      await loadMyAccess(id); // ده بيحط cookie orgUnitId + يجيب permissions للـ UI
      toast.success("تم تغيير الفرع/الوحدة");
    } catch (e: any) {
      toast.error(e?.response?.data || "فشل تغيير الوحدة");
    }
  };

  const NodeRow = ({ n, level }: { n: OrgNode; level: number }) => {
    if (!n.isActive) return null;

    const isChecked = checkedIds.has(n.id);
    const isActive = activeId === n.id;

    return (
      <div className="space-y-1">
        <div className={`flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted ${isActive ? "bg-muted" : ""}`}>
          <div className="flex items-center gap-2">
            <span style={{ marginRight: level * 14 }} />
            <Checkbox checked={isChecked} onCheckedChange={(v) => toggleChecked(n.id, Boolean(v))} />
            <button
              className="text-right"
              onClick={() => {
                setActiveId(n.id);
                toggleChecked(n.id, true);
              }}
            >
              <span className="font-medium">{n.name}</span>{" "}
              <Badge variant="secondary" className="mr-2">
                {orgTypeLabel(n.type)}
              </Badge>
            </button>
          </div>

          <Button
            size="sm"
            variant={isActive ? "default" : "outline"}
            onClick={() => applyActive(n.id)}
          >
            استخدام
          </Button>
        </div>

        {n.children?.map((c) => (
          <NodeRow key={c.id} n={c} level={level + 1} />
        ))}
      </div>
    );
  };

  // لو المستخدم مش معاه Org.View، نخفي الزر كله
  if (!canView) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {activeId ? "تغيير الفرع/الوحدة" : "اختيار الفرع/الوحدة"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>اختيار الفرع/الوحدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} />

          <div className="text-xs text-muted-foreground">
            ✅ الـ “Checkbox” متعدد (للفلترة/التحديد) — لكن **الوحدة الفعّالة** هي اللي تضغط عليها “استخدام”.
          </div>

          <ScrollArea className="h-[420px] pr-2">
            <div className="space-y-2">
              {filteredTree.map((n) => (
                <NodeRow key={n.id} n={n} level={0} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
