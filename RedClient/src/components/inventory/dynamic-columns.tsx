"use client";

import { ColumnDef } from "@tanstack/react-table";

export function makeDynamicColumns<T extends Record<string, any>>(rows: T[]): ColumnDef<T>[] {
  const keys = rows?.[0] ? Object.keys(rows[0]) : [];
  return keys.map((k) => ({
    accessorKey: k,
    header: k,
    cell: ({ row }) => {
      const v = (row.original as any)[k];
      if (v === null || v === undefined) return "—";
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    },
  }));
}
