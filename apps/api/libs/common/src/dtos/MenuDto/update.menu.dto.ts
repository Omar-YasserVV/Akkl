import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  MenuItemVariationDto,
  RecipeIngredientDto,
} from './VariationsAndTags.menu.dto';

export class UpdateRecipeIngredientDto {
  @IsNumber()
  ingredientId!: number;

  @IsNumber()
  quantityRequired!: number;
}

export class UpdateBranchMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuItemVariationDto)
  variations?: MenuItemVariationDto[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  dietaryTags?: number[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipe?: RecipeIngredientDto[];
}
