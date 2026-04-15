import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    example: 1,
    description: 'Unique branch number',
  })
  @IsInt()
  @IsNotEmpty()
  branchNumber!: number;

  @ApiProperty({
    example: 'Nasr City Branch',
    description: 'Branch name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '123 Abbas El Akkad St, Cairo',
    description: 'Branch address',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    example: 10,
    description: 'Restaurant ID this branch belongs to',
  })
  @IsString()
  @IsNotEmpty()
  restaurantId!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the branch has tables',
  })
  @IsBoolean()
  @IsOptional()
  haveTables?: boolean;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of tables in the branch',
  })
  @IsInt()
  @IsOptional()
  tablesCount?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if reservations are allowed',
  })
  @IsBoolean()
  @IsOptional()
  haveReservations?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates if the branch has warehouses',
  })
  @IsBoolean()
  @IsOptional()
  haveWarehouses?: boolean;

  @ApiPropertyOptional({
    example: 'Main Warehouse',
    description: 'Warehouse name if exists',
  })
  @IsOptional()
  warehouseName?: string;
}
