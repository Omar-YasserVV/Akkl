import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';

export class IngredientDetailDto {
  @IsNumber()
  ingredientId: number;

  @IsString()
  name: string;

  @IsNumber()
  quantityRequired: number;

  @IsString()
  unit: string;
}

export class BranchMenuItemDetailDto {
  @IsNumber()
  menuItemId: number;

  @IsNumber()
  branchId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  @IsOptional()
  discountPrice: number | null;

  @IsBoolean()
  isAvailable: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDetailDto)
  recipe: IngredientDetailDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
