import { AnalyticsDaysAgo } from "@/features/dashboard/overview/types/analytics";
import { LineChartAnalyticsResponseDto } from "@/types/analytics";
import { apiClient } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { analyticsKeys } from "./analytics.keys";

const BASE_URL = "/analytics";

export const useBranchRevenueQuery = (daysAgo: AnalyticsDaysAgo) =>
  useQuery({
    queryKey: analyticsKeys.revenue(daysAgo),
    queryFn: () =>
      apiClient.get<LineChartAnalyticsResponseDto>(
        `${BASE_URL}/branch/revenue-analytics`,
        { params: { daysAgo } },
      ),
  });

export const useBranchOrdersQuery = (daysAgo: AnalyticsDaysAgo) =>
  useQuery({
    queryKey: analyticsKeys.branchOrder(daysAgo),
    queryFn: () =>
      apiClient.get<LineChartAnalyticsResponseDto>(
        `${BASE_URL}/branch/orders-analytics`,
        { params: { daysAgo } },
      ),
  });
