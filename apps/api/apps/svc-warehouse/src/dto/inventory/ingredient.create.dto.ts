import { ApiProperty } from '@nestjs/swagger';
import {
  IngredientCategory,
  MeasurementUnit,
} from 'libs/db/generated/client/enums';

export class CreateIngredientReqDto {
  @ApiProperty({ example: 'Flour' })
  name: string;

  @ApiProperty({ enum: MeasurementUnit, example: MeasurementUnit.KG })
  unit: MeasurementUnit;

  @ApiProperty({
    enum: IngredientCategory,
    example: IngredientCategory.GRAINS,
  })
  category: IngredientCategory;
}
