// src/app/customers/opening-balance/schema.ts
import { z } from "zod";

export const openingBalanceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  balanceAmount: z.number(), // يمكن أن يكون موجب (مدين) أو سالب (دائن)
  entryDate: z.string(),
  notes: z.string().optional(),
});

export type OpeningBalance = z.infer<typeof openingBalanceSchema>;