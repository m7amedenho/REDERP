// src/app/customers/leads/schema.ts
import { z } from "zod";

export const leadSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "الاسم مطلوب" }),
  phone: z.string().min(5, { message: "رقم الهاتف مطلوب" }),
  region: z.string().optional(),
  delegate: z.string().optional(),
  lastContact: z.string().optional(),
  interestLevel: z.enum(["منخفض", "متوسط", "مرتفع"]),
  status: z.enum(["جديد", "تم التواصل", "غير مؤهل", "مُحول لعميل"]),
});

export type Lead = z.infer<typeof leadSchema>;