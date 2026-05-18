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
