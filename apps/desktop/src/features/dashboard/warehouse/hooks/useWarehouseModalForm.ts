import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  warehouseModalSchema,
  type WarehouseModalFormData,
} from "../types/WarehouseModal";

export function useWarehouseModalForm() {
  return useForm<WarehouseModalFormData>({
    resolver: zodResolver(warehouseModalSchema),
    defaultValues: {
      tab: "usage",
      inventoryItemId: "",
      quantity: 0,
    } as WarehouseModalFormData,
    mode: "onTouched",
  });
}
