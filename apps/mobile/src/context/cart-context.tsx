import { useCartStore } from "@/stores/cart-store";
import { useShallow } from "zustand/react/shallow";
import type { ReactNode } from "react";

export type {
  CartLineItem,
  OrderMode,
  PlacedOrder,
} from "@/stores/cart-store";

export function useCart() {
  return useCartStore(
    useShallow((state) => ({
      branchId: state.branchId,
      restaurantId: state.restaurantId,
      restaurantName: state.restaurantName,
      branchName: state.branchName,
      orderMode: state.orderMode,
      tableNumber: state.tableNumber,
      items: state.items,
      itemCount: state.itemCount,
      subtotal: state.subtotal,
      serviceFee: state.serviceFee,
      total: state.total,
      lastOrder: state.lastOrder,
      setBranchContext: state.setBranchContext,
      setDineInSession: state.setDineInSession,
      addItem: state.addItem,
      updateItemQuantity: state.updateItemQuantity,
      removeItem: state.removeItem,
      placeOrder: state.placeOrder,
      clearCart: state.clearCart,
    })),
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  return children;
}
