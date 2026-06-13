import type { CartLineItem } from "@/stores/cart-store";
import { CreateOrderBody, OrderState } from "../api/Orders";

export function buildCreateOrderPayload(
  items: CartLineItem[],
  user: { id: string; fullName: string },
): CreateOrderBody {
  return {
    CustomerName: user.fullName,
    status: OrderState.PENDING,
    userId: user.id,
    source: "APP",
    items: items.map((item) => ({
      menuItemId: item.itemId,
      quantity: item.quantity,
      specialInstructions: null,
      price: item.unitPrice,
    })),
  };
}
