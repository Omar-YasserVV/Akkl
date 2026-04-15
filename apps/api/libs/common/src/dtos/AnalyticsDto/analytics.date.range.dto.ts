import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class AnalyticsDateRangeDto {
  @ApiProperty({
    example: '2024-06-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  from: string;

  @ApiProperty({ example: '2024-06-30', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  to: string;
}
