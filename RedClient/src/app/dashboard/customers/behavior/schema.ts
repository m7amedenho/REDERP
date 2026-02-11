// src/app/customers/behavior/schema.ts
import { z } from "zod";

export const rfmMetricSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  Recency: z.number(), // عدد الأيام منذ آخر شراء
  Frequency: z.number(), // عدد مرات الشراء
  Monetary: z.number(), // إجمالي قيمة الشراء
  prediction: z.string(), // توقع حركة العميل
  recommendation: z.string(), // توصيات مندوبين
});

export type RFMMetric = z.infer<typeof rfmMetricSchema>;