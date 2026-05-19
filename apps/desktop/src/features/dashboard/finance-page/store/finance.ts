import { create } from "zustand";

export type MetricType = "revenue" | "orders" | "profit" | "customers";

interface AnalyticsState {
  daysAgo: number;
  activeMetric: MetricType;
  setDaysAgo: (days: number) => void;
  setActiveMetric: (metric: MetricType) => void;
  resetAnalytics: () => void;
}

const INITIAL_DAYS_AGO = 30;
const INITIAL_METRIC: MetricType = "revenue";

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  daysAgo: INITIAL_DAYS_AGO,
  activeMetric: INITIAL_METRIC,

  setDaysAgo: (days) => set({ daysAgo: days }),

  setActiveMetric: (metric) => set({ activeMetric: metric }),

  resetAnalytics: () =>
    set({
      daysAgo: INITIAL_DAYS_AGO,
      activeMetric: INITIAL_METRIC,
    }),
}));
