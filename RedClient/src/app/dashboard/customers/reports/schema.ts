// src/app/customers/reports/schema.ts
import { z } from "zod";

export const reportFilterSchema = z.object({
  reportType: z.enum(["مديونية", "بيع_حسب_العميل", "نشاط_شهري"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customerId: z.string().optional(),
  delegateId: z.string().optional(),
});

export type ReportFilter = z.infer<typeof reportFilterSchema>;