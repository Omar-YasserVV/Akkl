import {
  AnalyticsDaysAgo,
  GetTopSellingItemsParams,
} from "@/features/dashboard/overview/types/analytics";
import { useQuery } from "@tanstack/react-query";
import { analyticsApis } from "../../api/analytics";
import { analyticsKeys } from "./analytics.keys";

export const useBranchRevenueQuery = (daysAgo: AnalyticsDaysAgo) =>
  useQuery({
    queryKey: analyticsKeys.revenue(daysAgo),
    queryFn: () => analyticsApis.getBranchRevenue(daysAgo),
  });

export const useBranchOrdersQuery = (daysAgo: AnalyticsDaysAgo) =>
  useQuery({
    queryKey: analyticsKeys.branchOrder(daysAgo),
    queryFn: () => analyticsApis.getBranchOrders(daysAgo),
  });

export const useTopSellingItemsQuery = (
  params: GetTopSellingItemsParams = {},
) =>
  useQuery({
    queryKey: analyticsKeys.topSelling(params),
    queryFn: () => analyticsApis.getTopSellingItems(params),
  });
