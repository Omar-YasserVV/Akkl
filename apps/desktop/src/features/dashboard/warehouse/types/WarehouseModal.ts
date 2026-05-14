import { z } from "zod";

const usageTab = z.object({
  tab: z.literal("usage"),
  inventoryItemId: z.string().min(1, "Select an inventory line"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
});

const restockTab = z.object({
  tab: z.literal("restock"),
  inventoryItemId: z.string().min(1, "Select an inventory line"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  expiresAt: z.string().optional(),
});

const registerTab = z.object({
  tab: z.literal("register"),
  ingredientId: z.string().min(1, "Select an ingredient"),
  minimumQuantity: z.coerce.number().min(0, "Minimum cannot be negative"),
  initialRestock: z.coerce.number().min(0),
});

export const warehouseModalSchema = z.discriminatedUnion("tab", [
  usageTab,
  restockTab,
  registerTab,
]);

export type WarehouseModalFormData = z.infer<typeof warehouseModalSchema>;
