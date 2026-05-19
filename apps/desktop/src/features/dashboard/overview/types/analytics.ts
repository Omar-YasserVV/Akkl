export type AnalyticsDaysAgo = number;

export interface LineChartAnalyticsRequestDto {
  daysAgo: AnalyticsDaysAgo;
}

export interface AnalyticsRecord {
  timestamp: string;
  value: number;
}

export interface LineChartAnalyticsResponseDto {
  totalCount: number;
  percentageChange: number;
  records: AnalyticsRecord[];
}

export interface GetTopSellingItemsParams {
  daysAgo?: AnalyticsDaysAgo; // maps to 'daysAgo' query param (default 7)
  topN?: number; // maps to 'topN' query param (default 5)
}

export interface TopSellingItem {
  menuItemId: string;
  name: string;
  sold: number;
  price: number;
  revenuePercentage: number;
}

export interface TopSellingItemsResponse {
  totalCount: number;
  items: TopSellingItem[];
}
