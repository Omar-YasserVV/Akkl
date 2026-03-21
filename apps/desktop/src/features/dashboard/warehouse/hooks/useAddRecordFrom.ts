import { useForm } from "react-hook-form";
import { UsageRecordFromData, usageRecordSchema } from "../types/AddRecord";
import { zodResolver } from "@hookform/resolvers/zod";
import { today, getLocalTimeZone, Time } from "@internationalized/date";

export function useAddRecordFrom() {
  return useForm<UsageRecordFromData>({
    resolver: zodResolver(usageRecordSchema),
    defaultValues: {
      ingredientId: "",
      quantity: 0,
      unit: "",
      recordedAt: {
        date: today(getLocalTimeZone()),
        time: new Time(12, 0),
      },
      reason: "Kitchen Prep",
      notes: "",
    },

    mode: "onTouched",
  });
}
