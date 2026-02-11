// src/app/customers/guarantees/schema.ts
import { z } from "zod";

export const guaranteeSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  type: z.enum(["شيك", "إيصال أمانة", "ورقة تجارية"]),
  documentNumber: z.string(),
  value: z.number().positive(),
  dueDate: z.string(),
  status: z.enum(["فعال", "منتهي", "مرتجع", "محصل"]),
});

export type Guarantee = z.infer<typeof guaranteeSchema>;