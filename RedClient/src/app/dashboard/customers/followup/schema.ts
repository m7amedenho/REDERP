// src/app/customers/followup/schema.ts
import { z } from "zod";

export const followupLogSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  type: z.enum(["زيارة", "اتصال", "رسالة"]),
  notes: z.string().optional(),
  followupDate: z.string().optional(), // موعد المتابعة القادمة
  logDate: z.string(), // تاريخ المتابعة الحالي
  delegate: z.string(),
});

export type FollowupLog = z.infer<typeof followupLogSchema>;