// src/app/customers/customers-debts/schema.ts
import { z } from "zod";

export const customerDebtSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  totalDebt: z.number().positive(),
  overdueAmount: z.number().nonnegative(),
  region: z.string().optional(),
  delegate: z.string().optional(),
  status: z.enum(["في الموعد", "متأخر", "متأخر جداً"]),
});

export type CustomerDebt = z.infer<typeof customerDebtSchema>;