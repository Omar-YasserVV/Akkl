import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { OrderState } from '../../../../db/generated/client/client';

export class CreateOrderDto {
  @ApiProperty({
    example: 150.75,
    description: 'Total order amount (2 decimal places max)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount!: number;

  @ApiProperty({
    example: 1,
    description: 'Branch ID where the order is placed',
  })
  @IsInt()
  branchId!: number;

  @ApiProperty({
    example: 25,
    description: 'User ID who created the order',
  })
  @IsInt()
  userId!: number;

  @ApiPropertyOptional({
    enum: OrderState,
    example: OrderState.PENDING, // or any default you use
    description: 'Order status',
  })
  @IsEnum(OrderState)
  @IsOptional()
  status?: OrderState;

  // Future:
  // @ApiProperty({ type: [CreateOrderItemDto] })
  // items: CreateOrderItemDto[];
}
