import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { AnalyticsDateRangeDto } from './analytics.date.range.dto';

export class AnalyticsBaseDto {
  @ApiProperty({ example: 123, description: 'Total number of data points' })
  @IsInt()
  @Min(0)
  totalCount: number;

  @ApiPropertyOptional({ type: AnalyticsDateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyticsDateRangeDto)
  dateRange?: AnalyticsDateRangeDto;
}
