import { CreateTableDto } from '@app/common';
import { BRANCH_TOPICS } from '@app/common/topics/branch.topics';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TableStatus } from '../../../../libs/db/generated/client/client';
import { ReservationService } from './reservation.service';

@Controller()
export class TableController {
  constructor(private readonly reservationService: ReservationService) {}

  @MessagePattern(BRANCH_TOPICS.CREATE_TABLE)
  async createTable(
    @Payload('branchId') branchId: string,
    @Payload('data') data: CreateTableDto,
  ) {
    return this.reservationService.createTable(branchId, data);
  }

  @MessagePattern(BRANCH_TOPICS.GET_BRANCH_TABLES)
  async getBranchTables(
    @Payload('branchId') branchId: string,
    @Payload('zoneName') zoneName?: string,
  ) {
    return this.reservationService.getBranchTables(branchId, zoneName);
  }

  @MessagePattern(BRANCH_TOPICS.UPDATE_TABLE_STATUS)
  async updateTableStatus(
    @Payload('tableId') tableId: string,
    @Payload('branchId') branchId: string,
    @Payload('status') status: TableStatus,
  ) {
    return this.reservationService.updateTableStatus(tableId, branchId, status);
  }

  @MessagePattern(BRANCH_TOPICS.DELETE_TABLE)
  async deleteTable(
    @Payload('tableId') tableId: string,
    @Payload('branchId') branchId: string,
  ) {
    return this.reservationService.deleteTable(tableId, branchId);
  }
}