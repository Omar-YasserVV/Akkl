import { CreateReservationDto, CreateTableDto } from '@app/common';
import { PrismaService } from '@app/db';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TableStatus, ReservationStatus } from '../../../../libs/db/generated/client/client';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new floor table configuration for a branch
   */
  async createTable(branchId: string, dto: CreateTableDto) {
    const branchExists = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branchExists) throw new NotFoundException('Target branch not found');

    return this.prisma.table.create({
      data: {
        ...dto,
        branchId,
      },
    });
  }

  /**
   * Fetches all tables for a branch floor-plan view
   */
  async getBranchTables(branchId: string, zoneName?: string) {
    return this.prisma.table.findMany({
      where: {
        branchId,
        ...(zoneName && { zoneName }),
      },
      orderBy: { tableNumber: 'asc' },
    });
  }

  /**
   * Updates real-time floor plan layout status directly
   */
  async updateTableStatus(tableId: string, branchId: string, status: TableStatus) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table || table.branchId !== branchId) {
      throw new NotFoundException('Table not found for the specified branch');
    }

    return this.prisma.table.update({
      where: { id: tableId },
      data: { status },
    });
  }

  /**
   * Clears out tables safely from layout maps
   */
  async deleteTable(tableId: string, branchId: string) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table || table.branchId !== branchId) {
      throw new NotFoundException('Table not found for the specified branch');
    }

    // Block deletion if active reservation logs require its structural binding
    const existingReservations = await this.prisma.reservation.findFirst({
      where: { 
        tableId,
        reservation_status: ReservationStatus.ACTIVE
      },
    });
    if (existingReservations) {
      throw new ConflictException('Cannot delete table with active reservations. Please remove or clear associated reservations first.');
    }
    
    return this.prisma.table.delete({ where: { id: tableId } });
  }

  /**
   * Books a reservation safely using concurrent transaction execution blocks
   */
  async createReservation(branchId: string, dto: CreateReservationDto) {
    const { reservationTime, depositAmount, userId, guestCount } = dto;
    
    const requestDate = new Date(reservationTime);
    const bufferMinutes = 90;
    const slotStart = new Date(requestDate.getTime() - bufferMinutes * 60000);
    const slotEnd = new Date(requestDate.getTime() + bufferMinutes * 60000);

    return this.prisma.$transaction(async (tx) => {
      
      // 1. Find all available tables capable of hosting party bounds size requirements
      const matchingTables = await tx.table.findMany({
        where: {
          branchId,
          capacity: { gte: guestCount },
        },
      });

      if (matchingTables.length === 0) {
        throw new BadRequestException('No tables at this branch match the requested party capacity.');
      }

      // 2. Cross-reference tables to isolate conflicting schedules
      const conflictingReservations = await tx.reservation.findMany({
        where: {
          branchId,
          tableId: { in: matchingTables.map((t) => t.id) },
          reservation_status: ReservationStatus.ACTIVE,
          reservationTime: {
            gte: slotStart,
            lte: slotEnd,
          },
        },
        select: { tableId: true },
      });

      const bookedTableIds = conflictingReservations.map((r) => r.tableId);
      const freeTable = matchingTables.find((t) => !bookedTableIds.includes(t.id));

      if (!freeTable) {
        throw new ConflictException('All capable tables are fully booked for this time block window.');
      }

      // 3. Persist reservation confirmation record
      const reservation = await tx.reservation.create({
        data: {
          reservationTime: requestDate,
          depositAmount,
          userId,
          branchId,
          tableId: freeTable.id,
          reservation_status: ReservationStatus.ACTIVE,
          isPaid: depositAmount > 0 ? false : true,
        },
        include: {
          table: true,
        },
      });

      // 4. Update the real-time layout floor tracker reference map properties
      await tx.table.update({
        where: { id: freeTable.id },
        data: { status: TableStatus.RESERVED },
      });

      return reservation;
    });
  }

  /**
   * Fetches active daily schedule listings
   */
  async getDailyReservations(branchId: string, dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return this.prisma.reservation.findMany({
      where: {
        branchId,
        reservationTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        table: true,
        user: { select: { fullName: true, phone: true, email: true } },
      },
      orderBy: { reservationTime: 'asc' },
    });
  }

  /**
   * Safe reservation cancellation processing block
   */
  async cancelReservation(reservationId: string, branchId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { table: true }
    });
    
    if (!reservation || reservation.branchId !== branchId) {
      throw new NotFoundException('Reservation not found for the specified branch');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Shift the primary reservation ledger status representation 
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { reservation_status: ReservationStatus.CANCELLED },
      });

      // 2. Cascade update to clear layout map tables back into AVAILABLE states smoothly
      await tx.table.update({
        where: { id: reservation.tableId },
        data: { status: TableStatus.AVAILABLE },
      });

      return updatedReservation;
    });
  }
}