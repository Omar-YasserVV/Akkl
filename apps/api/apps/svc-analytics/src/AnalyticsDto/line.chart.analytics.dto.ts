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
  @ApiPropertyOptional({
    example: 7,
    description: 'Number of days ago to start fetching data',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  daysAgo?: number;
}

// ─── Response DTO ─────────────────────────────────────────────
export class LineChartAnalyticsResponseDto extends AnalyticsBaseDto {
  @ApiProperty({
    example: 15.5,
    description: 'Percentage change compared to previous period',
  })
  percentageChange: number;

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
