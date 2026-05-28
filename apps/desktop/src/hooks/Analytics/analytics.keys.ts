import {
  AnalyticsDaysAgo,
  GetTopSellingItemsParams,
} from "@/features/dashboard/overview/types/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,

  // Revenue Keys
  revenues: () => [...analyticsKeys.all, "revenue"] as const,
  revenue: (daysAgo: AnalyticsDaysAgo) =>
    [...analyticsKeys.revenues(), daysAgo] as const,

  // Orders Keys
  branchOrders: () => [...analyticsKeys.all, "orders"] as const,
  branchOrder: (daysAgo: AnalyticsDaysAgo) =>
    [...analyticsKeys.branchOrders(), daysAgo] as const,

  // Expenses Keys
  expenses: () => [...analyticsKeys.all, "expenses"] as const,
  expense: (daysAgo: AnalyticsDaysAgo) =>
    [...analyticsKeys.expenses(), daysAgo] as const,

  // Top Selling Items Keys
  topSellings: () => [...analyticsKeys.all, "top-selling"] as const,
  topSelling: (params: GetTopSellingItemsParams) =>
    [...analyticsKeys.topSellings(), params] as const,
};
