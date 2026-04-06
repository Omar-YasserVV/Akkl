import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    example: 1,
    description: 'Ingredient ID',
  })
  @IsNumber()
  ingredientId!: number;

  @ApiPropertyOptional({
    example: 0.3,
    description: 'Updated required quantity',
  })
  @IsNumber()
  quantityRequired!: number;
}

export class UpdateBranchMenuItemDto {
  @ApiPropertyOptional({
    example: 'Beef Shawarma',
    description: 'Updated menu item name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Grilled beef with tahini sauce',
    description: 'Updated description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/beef-shawarma.jpg',
    description: 'Updated image URL',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Availability status',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    type: [MenuItemVariationDto],
    description: 'Updated variations list',
    example: [
      { size: 'Small', price: 55 },
      { size: 'Large', price: 85, discountPrice: 75 },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuItemVariationDto)
  variations?: MenuItemVariationDto[];

  @ApiPropertyOptional({
    example: [1, 3],
    description: 'Updated dietary tag IDs',
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  dietaryTags?: number[];

  @ApiPropertyOptional({
    type: [RecipeIngredientDto],
    description: 'Updated recipe ingredients',
    example: [
      { ingredientId: 1, quantityRequired: 0.25 },
      { ingredientId: 2, quantityRequired: 0.15 },
    ],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipe?: RecipeIngredientDto[];
}
