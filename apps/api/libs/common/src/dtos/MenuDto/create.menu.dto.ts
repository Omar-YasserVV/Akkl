import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '1',
    description: 'Ingredient ID',
  })
  @IsString()
  ingredientId!: string;

  @ApiProperty({
    example: 'Tomato',
    description: 'Ingredient name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity required',
  })
  @IsNumber()
  quantityRequired!: number;

  @ApiProperty({
    example: 'kg',
    description: 'Unit of measurement',
  })
  @IsString()
  unit!: string;
}

export class BranchMenuItemDetailDto {
  @ApiProperty({
    example: '101',
    description: 'Menu item ID',
  })
  @IsString()
  menuItemId!: string;

  @ApiProperty({
    example: '1',
    description: 'Branch ID',
  })
  @IsString()
  branchId!: string;

  @ApiProperty({
    example: 'Chicken Shawarma',
    description: 'Menu item name',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Grilled chicken wrapped with garlic sauce',
    description: 'Item description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/shawarma.jpg',
    description: 'Item image URL',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: true,
    description: 'Availability status',
  })
  @IsBoolean()
  isAvailable!: boolean;

  @ApiProperty({
    type: [MenuItemVariationDto],
    description: 'Available variations for the item',
    example: [
      {
        size: 'Small',
        price: 50,
      },
      {
        size: 'Large',
        price: 80,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemVariationDto)
  variations!: MenuItemVariationDto[];

  @ApiPropertyOptional({
    example: ['1', '2'],
    description: 'Dietary tag IDs (e.g., vegan, spicy)',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dietaryTags?: string[];

  @ApiProperty({
    type: [RecipeIngredientDto],
    description: 'Recipe ingredients required',
    example: [
      {
        ingredientId: '1',
        quantityRequired: 0.2,
      },
      {
        ingredientId: '2',
        quantityRequired: 0.1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipe!: RecipeIngredientDto[];
}
