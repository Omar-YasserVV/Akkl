import { create } from "zustand";

export type OrderMode = "pickup" | "dine-in";

export interface CartLineItem {
  itemId: string;
  name: string;
  branchId: string;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  unitPrice: number;
  variationId?: string;
  variationLabel?: string;
  image?: string | null;
}

export interface PlacedOrder {
  id: string;
  tableNumber: string;
  branchName: string;
  total: number;
  placedAt: Date;
  paymentMethod: string;
}

interface BranchContext {
  branchId: string;
  restaurantId: string;
  restaurantName: string;
  branchName: string;
}

interface DineInContext extends BranchContext {
  tableNumber: string;
}

interface CartTotals {
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

interface CartState extends CartTotals {
  branchId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  branchName: string | null;
  orderMode: OrderMode | null;
  tableNumber: string | null;
  items: CartLineItem[];
  lastOrder: PlacedOrder | null;
  setBranchContext: (context: BranchContext) => void;
  setDineInSession: (context: DineInContext) => void;
  addItem: (item: CartLineItem) => void;
  updateItemQuantity: (
    itemId: string,
    quantity: number,
    variationId?: string,
  ) => void;
  removeItem: (itemId: string, variationId?: string) => void;
  placeOrder: (
    paymentMethod: string,
    orderDetails?: { id: string; total: number },
  ) => PlacedOrder;
  clearCart: () => void;
}

const EMPTY_TOTALS: CartTotals = {
  itemCount: 0,
  subtotal: 0,
  serviceFee: 0,
  total: 0,
};

function computeTotals(items: CartLineItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  return {
    itemCount,
    subtotal,
    serviceFee: 0,
    total: subtotal,
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  branchId: null,
  restaurantId: null,
  restaurantName: null,
  branchName: null,
  orderMode: null,
  tableNumber: null,
  items: [],
  lastOrder: null,
  ...EMPTY_TOTALS,

  setBranchContext: (context) => {
    const { branchId } = get();
    set({
      ...(branchId && branchId !== context.branchId
        ? { items: [], ...EMPTY_TOTALS }
        : {}),
      branchId: context.branchId,
      restaurantId: context.restaurantId,
      restaurantName: context.restaurantName,
      branchName: context.branchName,
      orderMode: "pickup",
      tableNumber: null,
    });
  },

  setDineInSession: (context) => {
    const { branchId } = get();
    set({
      ...(branchId && branchId !== context.branchId
        ? { items: [], ...EMPTY_TOTALS }
        : {}),
      branchId: context.branchId,
      restaurantId: context.restaurantId,
      restaurantName: context.restaurantName,
      branchName: context.branchName,
      orderMode: "dine-in",
      tableNumber: context.tableNumber,
    });
  },

  addItem: (item) => {
    const { branchId } = get();

    if (branchId && branchId !== item.branchId) {
      const items = [item];
      set({
        items,
        branchId: item.branchId,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        ...computeTotals(items),
      });
      return;
    }

    const items = (() => {
      const current = get().items;
      const existingIndex = current.findIndex(
        (line) =>
          line.itemId === item.itemId && line.variationId === item.variationId,
      );

      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }

      return [...current, item];
    })();

    set({
      items,
      branchId: item.branchId,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      ...computeTotals(items),
    });
  },

  updateItemQuantity: (itemId, quantity, variationId) => {
    const items = get()
      .items.map((line) =>
        line.itemId === itemId && line.variationId === variationId
          ? { ...line, quantity }
          : line,
      )
      .filter((line) => line.quantity > 0);

    set({
      items,
      ...computeTotals(items),
    });
  },

  removeItem: (itemId, variationId) => {
    const items = get().items.filter(
      (line) => !(line.itemId === itemId && line.variationId === variationId),
    );

    set({
      items,
      ...computeTotals(items),
    });
  },

  placeOrder: (paymentMethod, orderDetails) => {
    const { tableNumber, branchName, total } = get();
    const order: PlacedOrder = {
      id: orderDetails?.id ?? "—",
      tableNumber: tableNumber ?? "—",
      branchName: branchName ?? "Branch",
      total: orderDetails?.total ?? total,
      placedAt: new Date(),
      paymentMethod,
    };

    set({
      lastOrder: order,
      items: [],
      ...EMPTY_TOTALS,
    });

    return order;
  },

  clearCart: () => {
    set({
      items: [],
      branchId: null,
      restaurantId: null,
      restaurantName: null,
      branchName: null,
      orderMode: null,
      tableNumber: null,
      ...EMPTY_TOTALS,
    });
  },
}));
