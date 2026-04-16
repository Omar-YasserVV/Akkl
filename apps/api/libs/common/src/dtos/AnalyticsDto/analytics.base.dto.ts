import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AnalyticsBaseDto {
  @ApiProperty({ example: 123, description: 'Total number of data points' })
  @IsInt()
  @Min(0)
  totalCount: number;
}
