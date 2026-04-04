import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateBranchDto {

  @IsInt()
  @IsNotEmpty()
  branchNumber: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  @IsNotEmpty()
  restaurantId: number;

  @IsBoolean()
  @IsOptional()
  haveTables?: boolean;

  @IsInt()
  @IsOptional()
  tablesCount?: number;

  @IsBoolean()
  @IsOptional()
  haveReservations?: boolean;

  @IsBoolean()
  @IsOptional()
  haveWarehouses?: boolean;


  @IsString()
  @IsOptional()
  warehouseName?: string;
}
