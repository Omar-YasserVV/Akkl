import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AnalyticsBaseDto } from './analytics.base.dto';
import { AnalyticsDateRangeDto } from './analytics.date.range.dto';

// ─── Record shape ─────────────────────────────────────────────
export class LineChartRecordDto {
  @ApiProperty({
    example: '2024-06-01T00:00:00Z',
    description: 'ISO timestamp',
  })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ example: 42, description: 'Numeric value at this point' })
  value: number;

  @ApiPropertyOptional({
    example: 'Monday',
    description: 'Optional label for the point',
  })
  @IsOptional()
  @IsString()
  label?: string;
}

// ─── Request DTO ──────────────────────────────────────────────
export class LineChartAnalyticsRequestDto {
  @ApiProperty({
    type: AnalyticsDateRangeDto,
    description: 'Date range to query',
  })
  @ValidateNested()
  @Type(() => AnalyticsDateRangeDto)
  dateRange: AnalyticsDateRangeDto;

  @ApiPropertyOptional({
    example: 'daily',
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    description: 'Granularity of data points',
  })
  @IsOptional()
  @IsString()
  granularity?: 'hourly' | 'daily' | 'weekly' | 'monthly';

  @ApiPropertyOptional({
    example: 100,
    description: 'Max number of records to return',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

// ─── Response DTO ─────────────────────────────────────────────
export class LineChartAnalyticsResponseDto extends AnalyticsBaseDto {
  @ApiProperty({
    type: [LineChartRecordDto],
    description: 'Time-series data points',
    example: [
      { timestamp: '2024-06-01T00:00:00Z', value: 42, label: 'Monday' },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => LineChartRecordDto)
  records: LineChartRecordDto[];
}
