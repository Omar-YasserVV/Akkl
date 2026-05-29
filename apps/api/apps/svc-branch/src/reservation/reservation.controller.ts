import { CreateReservationDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReservationService } from './reservation.service';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @MessagePattern(BRANCH_TOPICS.CREATE_RESERVATION)
  async createReservation(
    @Payload('branchId') branchId: string,
    @Payload('data') data: CreateReservationDto,
  ) {
    return this.reservationService.createReservation(branchId, data);
  }

  @MessagePattern(BRANCH_TOPICS.GET_DAILY_RESERVATIONS)
  async getDailyReservations(
    @Payload('branchId') branchId: string,
    @Payload('date') date?: string,
  ) {
    return this.reservationService.getDailyReservations(branchId, date);
  }

  @MessagePattern(BRANCH_TOPICS.CANCEL_RESERVATION)
  async cancelReservation(
    @Payload('reservationId') reservationId: string,
    @Payload('branchId') branchId: string,
  ) {
    return this.reservationService.cancelReservation(reservationId, branchId);
  }
}