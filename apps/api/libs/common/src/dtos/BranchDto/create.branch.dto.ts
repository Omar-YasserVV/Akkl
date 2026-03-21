import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateBranchDto {
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

  @IsBoolean()
  @IsOptional()
  haveReservations?: boolean;

  @IsBoolean()
  @IsOptional()
  haveWarehouses?: boolean;
}
