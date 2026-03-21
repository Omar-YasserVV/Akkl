import { useForm } from "react-hook-form";
import { UsageRecordFromData } from "../types/AddRecord";

export function useAddRecordFrom() {
  return useForm<UsageRecordFromData>({
    defaultValues: {
      ingredientId: "",
      quantity: 0,
      unit: "",
      recordedAt: new Date(),
      reason: "Kitchen Prep",
      notes: "",
      stockSnapshot: {
        current: 0,
        projected: 0,
      },
    },
    mode: "onTouched",
  });
}
