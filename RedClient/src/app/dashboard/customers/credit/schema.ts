// src/app/customers/credit/schema.ts
import { z } from "zod";

export const creditLimitSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  creditLimit: z.number().positive(),
  usedCredit: z.number().nonnegative(),
  currentBalance: z.number(), // الرصيد الحالي (مدين/دائن)
});

export type CreditLimit = z.infer<typeof creditLimitSchema>;