import { api } from "../axios";

export type OrgUnit = {
  id: string;
  name: string;
  type: number;
  parentId?: string | null;
  isActive: boolean;
};

export const orgApi = {
  async tree() {
    const r = await api.get<OrgUnit[]>("/org/tree");
    return r.data;
  },
  async root() {
    const r = await api.get<{ id: string; name: string }>("/org/root");
    return r.data;
  },
};
