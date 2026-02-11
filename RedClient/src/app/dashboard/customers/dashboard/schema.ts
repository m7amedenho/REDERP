// src/app/customers/dashboard/schema.ts
import { z } from "zod";

export const dashboardItemSchema = z.object({
  id: z.string(),
  metric: z.string(),
  value: z.number(),
});

export type DashboardItem = z.infer<typeof dashboardItemSchema>;