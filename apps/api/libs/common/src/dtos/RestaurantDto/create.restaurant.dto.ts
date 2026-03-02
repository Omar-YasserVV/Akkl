import { IsString, IsNotEmpty, IsOptional, IsInt, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}