import { AnalyticsDaysAgo } from "@/features/dashboard/overview/types/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,

  revenues: () => [...analyticsKeys.all, "revenue"] as const,
  revenue: (daysAgo: AnalyticsDaysAgo) =>
    [...analyticsKeys.revenues(), daysAgo] as const,

  branchOrders: () => [...analyticsKeys.all, "orders"] as const,
  branchOrder: (daysAgo: AnalyticsDaysAgo) =>
    [...analyticsKeys.branchOrders(), daysAgo] as const,
};
