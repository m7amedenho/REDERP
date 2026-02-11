// src/app/customers/transfer/schema.ts
import { z } from "zod";

export const customerTransferSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  currentDelegateId: z.string(),
  newDelegateId: z.string(),
  transferDate: z.string(),
});

export type CustomerTransfer = z.infer<typeof customerTransferSchema>;