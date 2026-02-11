export type OrgUnitFlat = {
  id: string;
  name: string;
  type: number;
  parentId: string | null;
  isActive: boolean;
};

export type OrgNode = OrgUnitFlat & { children: OrgNode[] };

export function buildTree(items: OrgUnitFlat[]): OrgNode[] {
  const map = new Map<string, OrgNode>();
  const roots: OrgNode[] = [];

  for (const it of items) map.set(it.id, { ...it, children: [] });

  for (const node of map.values()) {
    if (!node.parentId) roots.push(node);
    else {
      const p = map.get(node.parentId);
      if (p) p.children.push(node);
      else roots.push(node);
    }
  }

  const sortRec = (n: OrgNode) => {
    n.children.sort((a, b) => a.type - b.type || a.name.localeCompare(b.name));
    n.children.forEach(sortRec);
  };

  roots.sort((a, b) => a.type - b.type || a.name.localeCompare(b.name));
  roots.forEach(sortRec);

  return roots;
}

export function orgTypeLabel(t: number) {
  return t === 1 ? "منطقة/وجه" : t === 2 ? "فرع" : t === 3 ? "قسم" : "فريق";
}
