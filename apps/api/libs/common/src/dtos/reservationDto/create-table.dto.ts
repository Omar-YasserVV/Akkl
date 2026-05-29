import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TableStatus } from '../../../../db/generated/client/client';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsInt()
  capacity: number;

  @IsString()
  @IsOptional()
  zoneName?: string;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}