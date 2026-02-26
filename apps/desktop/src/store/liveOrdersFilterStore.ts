import { create } from "zustand";

export type SourceFilter = "all" | "app" | "restaurant";
export type StatusFilter = "all" | "pending" | "confirmed" | "cooking" | "ready" | "completed";

interface LiveOrdersFilterState {
  source: SourceFilter;
  status: StatusFilter;
  setSource: (source: SourceFilter) => void;
  setStatus: (status: StatusFilter) => void;
}

export const useLiveOrdersFilterStore = create<LiveOrdersFilterState>((set) => ({
  source: "all",
  status: "all",
  setSource: (source) => set({ source }),
  setStatus: (status) => set({ status }),
}));

