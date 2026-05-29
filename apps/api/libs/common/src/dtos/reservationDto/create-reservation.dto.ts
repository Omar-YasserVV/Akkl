import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ReservationStatus } from '../../../../db/generated/client/client';

export class CreateReservationDto {
  @IsDateString()
  reservationTime: string;

  @IsNumber()
  depositAmount: number;

  @IsUUID()
  userId: string;

  @IsInt()
  guestCount: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  reservation_status?: ReservationStatus;
}