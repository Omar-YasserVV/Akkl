import { OrderState } from "@repo/types";
import { CreateOrderDraft, DraftItem } from "../types/OrderList.types";

export const statusOptions = [
  { key: OrderState.PENDING, label: "Pending" },
  { key: OrderState.IN_PROGRESS, label: "In Progress" },
  { key: OrderState.COMPLETED, label: "Completed" },
  { key: OrderState.CANCELLED, label: "Cancelled" },
] as const;

export const createDraftItem = (): DraftItem => ({
  id: crypto.randomUUID(),
  menuItemId: "",
  quantity: 1,
  specialInstructions: null,
});

export const createInitialDraft = (): CreateOrderDraft => ({
  CustomerName: "",
  status: OrderState.PENDING,
  items: [createDraftItem()],
});
