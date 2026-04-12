import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OrderState } from '../../../../db/generated/client/client';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  quantity!: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;
}
export class CreateOrderDto {
  @ApiProperty({ example: 150.75 })
  @IsNumber({ maxDecimalPlaces: 2 })
  totalPrice!: number;

  @ApiProperty({ example: 25 })
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  itemCount!: number;

  @IsArray()
  @IsInt({ each: true })
  itemsId!: number[]; // [1, 2, 3, 4, 5]

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiPropertyOptional({ enum: OrderState })
  @IsEnum(OrderState)
  @IsOptional()
  status?: OrderState;
}
