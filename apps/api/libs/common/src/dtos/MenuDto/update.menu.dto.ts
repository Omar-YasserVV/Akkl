import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class UpdateRecipeIngredientDto {
  @IsNumber()
  ingredientId: number;

  @IsNumber()
  quantityRequired: number;
}

export class UpdateBranchMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  /**
   * If provided, this usually replaces the existing recipe
   * for this specific BranchMenuItem.
   */
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  recipe?: UpdateRecipeIngredientDto[];
}
