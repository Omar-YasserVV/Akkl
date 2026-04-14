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
  @ApiProperty({ example: 9 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 'Eyad 5ales' })
  @IsOptional()
  @Type(() => String)
  CustomerName?: string;

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
