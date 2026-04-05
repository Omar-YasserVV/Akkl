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

export class IngredientDetailDto {
  @IsNumber()
  ingredientId!: number;

  @IsString()
  name!: string;

  @IsNumber()
  quantityRequired!: number;

  @IsString()
  unit!: string;
}

export class BranchMenuItemDetailDto {
  @IsNumber()
  menuItemId!: number;

  @IsNumber()
  branchId!: number;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  isAvailable!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemVariationDto)
  variations!: MenuItemVariationDto[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  dietaryTags?: number[]; // Array of Tag IDs

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipe!: RecipeIngredientDto[];
}
