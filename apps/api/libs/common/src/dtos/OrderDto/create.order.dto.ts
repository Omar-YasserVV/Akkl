
import { OrderState } from '../../../../db/generated/client/client';
import { 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsInt 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount: number;

  @IsInt()
  branchId: number;

  @IsInt()
  userId: number;

  @IsEnum(OrderState)
  @IsOptional()
  status?: OrderState;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateOrderItemDto) // Assumes you have an OrderItem DTO
//   items: CreateOrderItemDto[];
}