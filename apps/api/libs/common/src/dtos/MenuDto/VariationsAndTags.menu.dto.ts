import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum DietaryType {
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
}

export class MenuItemVariationDto {
  @ApiProperty({
    example: 'Large',
    description: 'Size of the menu item',
  })
  @IsString()
  size!: string;

  @ApiProperty({
    example: 80,
    description: 'Base price',
  })
  @IsNumber()
  price!: number;

  @ApiPropertyOptional({
    example: 65,
    description: 'Discounted price if available',
  })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;
}

export class RecipeIngredientDto {
  @ApiProperty({
    example: 1,
    description: 'Ingredient ID',
  })
  @IsNumber()
  ingredientId!: number;

  @ApiProperty({
    example: 0.25,
    description: 'Required quantity for the recipe',
  })
  @IsNumber()
  quantityRequired!: number;
}
