import { OrderFilters } from "@/types/Order";
import { create } from "zustand";

interface OrderStore {
  filters: OrderFilters;
  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: OrderFilters = {
  page: 1,
  limit: 10,
};

export const useOrderStore = create<OrderStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };

      // Clean up undefined values
      Object.keys(updatedFilters).forEach((key) => {
        if (updatedFilters[key as keyof OrderFilters] === undefined) {
          delete updatedFilters[key as keyof OrderFilters];
        }
      });

      return { filters: updatedFilters };
    }),
  resetFilters: () => set({ filters: { ...initialFilters } }),
}));
