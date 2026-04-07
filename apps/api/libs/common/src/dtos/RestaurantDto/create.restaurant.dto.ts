import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Koshary El Tahrir',
    description: 'Restaurant name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'Restaurant logo URL',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
