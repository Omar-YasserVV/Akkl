import { create } from "zustand";
import { AnalyticsDaysAgo } from "../types/analytics";

interface AnalyticsStore {
  daysAgo: AnalyticsDaysAgo;
  setDaysAgo: (daysAgo: AnalyticsDaysAgo) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  daysAgo: 30,
  setDaysAgo: (daysAgo) => set({ daysAgo }),
}));
