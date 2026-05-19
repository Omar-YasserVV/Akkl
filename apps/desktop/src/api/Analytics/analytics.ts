import { apiClient } from "@repo/utils";
import {
  AnalyticsDaysAgo,
  GetTopSellingItemsParams,
  LineChartAnalyticsResponseDto,
  TopSellingItemsResponse,
} from "../../features/dashboard/overview/types/analytics";

const BASE_URL = "/analytics";

export const analyticsApis = {
  getTopSellingItems: async (params: GetTopSellingItemsParams) => {
    return apiClient.get<TopSellingItemsResponse>(
      `${BASE_URL}/branch/top-selling`,
      {
        params,
      },
    );
  },

  getBranchRevenue: async (daysAgo: AnalyticsDaysAgo) => {
    return apiClient.get<LineChartAnalyticsResponseDto>(
      `${BASE_URL}/branch/revenue-analytics`,
      { params: { daysAgo } },
    );
  },

  getBranchOrders: async (daysAgo: AnalyticsDaysAgo) => {
    return apiClient.get<LineChartAnalyticsResponseDto>(
      `${BASE_URL}/branch/orders-analytics`,
      { params: { daysAgo } },
    );
  },
};
