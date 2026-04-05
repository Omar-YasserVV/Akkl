import { IsNumber, IsOptional, IsString } from 'class-validator';

// Enum matches your Prisma schema
export enum DietaryType {
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
}

export class MenuItemVariationDto {
  @IsString()
  size!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;
}

export class RecipeIngredientDto {
  @IsNumber()
  ingredientId!: number;

  @IsNumber()
  quantityRequired!: number;
}
