import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AnalyticsBaseDto } from './analytics.base.dto';

export class TopSellingAnalyticsRequestDto {
  @ApiPropertyOptional({
    example: 7,
    description: 'Number of days to look back (default 7)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  daysAgo?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Maximum number of items to return (default 5)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  topN?: number;
}

export class TopSellingItemDto {
  @ApiProperty({ example: 'uuid', description: 'Branch menu item ID' })
  @IsString()
  menuItemId: string;

  @ApiProperty({
    example: 'Classic Cheeseburger',
    description: 'Menu item name',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 42, description: 'Total units sold in the period' })
  @IsInt()
  @Min(0)
  sold: number;

  @ApiProperty({
    example: 125.5,
    description: 'Total revenue from this item in the period',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 32.5,
    description: 'Share of branch revenue (%) from completed orders',
  })
  @IsNumber()
  @Min(0)
  revenuePercentage: number;
}

export class TopSellingAnalyticsResponseDto extends AnalyticsBaseDto {
  @ApiProperty({
    type: [TopSellingItemDto],
    description: 'Top selling menu items ranked by revenue',
  })
  @ValidateNested({ each: true })
  @Type(() => TopSellingItemDto)
  items: TopSellingItemDto[];
}
