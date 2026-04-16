import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { AnalyticsBaseDto } from './analytics.base.dto';

// ─── Slice shape ──────────────────────────────────────────────
export class PieChartSliceDto {
  @ApiProperty({ example: 'Apples', description: 'Label for this slice' })
  @IsString()
  label: string;

  @ApiProperty({ example: 60, description: 'Numeric value for this slice' })
  value: number;
}

// ─── Request DTO ──────────────────────────────────────────────
export class PieChartAnalyticsRequestDto {
  @ApiPropertyOptional({
    example: 5,
    description: 'Limit to top N slices (rest grouped as "Other")',
  })
  @IsOptional()
  topN?: number;

  @ApiPropertyOptional({
    example: 'category',
    description: 'Field to group/segment by',
  })
  @IsOptional()
  @IsString()
  groupBy?: string;
}

// ─── Response DTO ─────────────────────────────────────────────
export class PieChartAnalyticsResponseDto extends AnalyticsBaseDto {
  @ApiProperty({
    type: [PieChartSliceDto],
    description: 'Pie slices with label and value',
    example: [{ label: 'Apples', value: 60 }],
  })
  @ValidateNested({ each: true })
  @Type(() => PieChartSliceDto)
  slices: PieChartSliceDto[];
}
