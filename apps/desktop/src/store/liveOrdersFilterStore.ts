import { create } from "zustand";
import { DUMMY_ORDERS, type LiveOrder, type OrderStatus } from "../app/dashboard/pages/live-orders/constants/constants";

export type SourceFilter = "all" | "app" | "restaurant";
export type StatusFilter = "all" | "pending" | "confirmed" | "cooking" | "ready" | "completed";

export type OrderRow = LiveOrder & { id: string };

export interface OrderItemDraft {
  id: string;
  itemId: string;
  quantity: number;
  notes: string;
}

export interface NewOrderDraft {
  orderNumber: string;
  customerName: string;
  source: string;
  status: OrderStatus;
  items: OrderItemDraft[];
}

interface LiveOrdersState {
  // Filters
  source: SourceFilter;
  status: StatusFilter;
  setSource: (source: SourceFilter) => void;
  setStatus: (status: StatusFilter) => void;

  // Orders Data
  orders: OrderRow[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addOrder: (order: OrderRow) => void;

  // Create Order Modal State
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
  newOrderDraft: NewOrderDraft;
  updateDraftField: (field: keyof Omit<NewOrderDraft, "items">, value: string) => void;
  addDraftItem: () => void;
  updateDraftItem: (id: string, field: keyof Omit<OrderItemDraft, "id">, value: string | number) => void;
  removeDraftItem: (id: string) => void;
  resetDraft: () => void;
}

const initialDraft: NewOrderDraft = {
  orderNumber: "",
  customerName: "",
  source: "Restaurant",
  status: "pending",
  items: [
    { id: "1", itemId: "", quantity: 1, notes: "" }
  ]
};

export const useLiveOrdersStore = create<LiveOrdersState>((set) => ({
  // Filters Initial State
  source: "all",
  status: "all",
  setSource: (source) => set({ source }),
  setStatus: (status) => set({ status }),

  // Orders Data
  orders: DUMMY_ORDERS.map((order, idx) => ({
    ...order,
    id: `${order["order#"]}-${order.status}-${idx}`,
  })),

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ),
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  // Create Order Modal State
  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
  newOrderDraft: initialDraft,

  updateDraftField: (field, value) =>
    set((state) => ({
      newOrderDraft: { ...state.newOrderDraft, [field]: value },
    })),

  addDraftItem: () =>
    set((state) => ({
      newOrderDraft: {
        ...state.newOrderDraft,
        items: [
          ...state.newOrderDraft.items,
          { id: Math.random().toString(36).substr(2, 9), itemId: "", quantity: 1, notes: "" }
        ],
      },
    })),

  updateDraftItem: (id, field, value) =>
    set((state) => ({
      newOrderDraft: {
        ...state.newOrderDraft,
        items: state.newOrderDraft.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    })),

  removeDraftItem: (id) =>
    set((state) => ({
      newOrderDraft: {
        ...state.newOrderDraft,
        items: state.newOrderDraft.items.length > 1
          ? state.newOrderDraft.items.filter((item) => item.id !== id)
          : state.newOrderDraft.items,
      },
    })),

  resetDraft: () => set({ newOrderDraft: initialDraft }),
}));
