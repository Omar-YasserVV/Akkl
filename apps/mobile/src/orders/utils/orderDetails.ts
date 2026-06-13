import type { CartLineItem } from "@/stores/cart-store";
import type { OrderItem } from "@/orders/types/PaginatedResponse";

export function formatOrderLineLabel(item: OrderItem): string {
  const name = item.branchMenuItem?.name ?? "Item";
  return `${item.quantity}x ${name}`;
}

export function formatCartLineLabel(item: CartLineItem): string | null {
  if (item.variationLabel) {
    return `Size: ${item.variationLabel}`;
  }
  return null;
}
