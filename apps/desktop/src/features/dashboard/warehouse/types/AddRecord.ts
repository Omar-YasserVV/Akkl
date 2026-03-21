import { z } from "zod";
import { CalendarDate, Time } from "@internationalized/date";
export type UsageReason =
  | "Kitchen Prep"
  | "Internal Transfer"
  | "Damaged"
  | "Expired"
  | "Sample/Testing"
  | "Discrepancy Correction";

export const usageRecordSchema = z.object({
  ingredientId: z.string().min(1, "Please select an ingredient"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  recordedAt: z.object({
    date: z.instanceof(CalendarDate, { message: "Invalid date" }),
    time: z.instanceof(Time, { message: "Invalid time" }),
  }),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});
export type UsageRecordFromData = z.infer<typeof usageRecordSchema>;
