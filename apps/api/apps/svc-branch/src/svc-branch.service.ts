import {
  InitializeBranchDto,
  UpdateBranchDto,
  UpdateOnboardingDto,
} from '@app/common';
import { PrismaService } from '@app/db';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';

@Injectable()
export class SvcBranchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  // ─── PHASE 1: INITIALIZE DRAFT ──────────────────────────────────────────
  async initializeBranch(restaurantId: string, data: InitializeBranchDto) {
    const existingBranch = await this.prisma.branch.findFirst({
      where: {
        branchNumber: String(data.branchNumber),
      },
    });

    if (existingBranch) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Branch number already exists',
      });
    }

    const newDraft = await this.prisma.branch.create({
      data: {
        restaurantId: restaurantId,
        branchNumber: String(data.branchNumber),
        name: 'Draft Branch', // Temporary placeholder for Step 1
        status: 'DRAFT',
      },
    });

    this.kafkaClient.emit('branch.draft_created', newDraft);
    return newDraft;
  }

  // ─── PHASE 2: SAVE WIZARD PROGRESS (STEPS 1 to 4) ────────────────────────
  async updateOnboardingProgress(
    restaurantId: string,
    branchId: string,
    data: UpdateOnboardingDto,
  ) {
    const { zones, warehouseName, hardware, ...basicUpdateData } = data;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update basic scalar fields (Name, Location, Hours, Flags)
      const branch = await tx.branch.update({
        where: { id: branchId, restaurantId: restaurantId },
        data: basicUpdateData,
      });

      if (!branch) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Branch draft not found',
        });
      }

      // 2. Handle Zones & Tables Sync (Matches the UI Layout exactly)
      if (zones !== undefined) {
        await tx.table.deleteMany({ where: { branchId } });

        if (zones.length > 0) {
          const tablesToCreate: any[] = [];

          zones.forEach((zone) => {
            if (zone.tables && zone.tables.length > 0) {
              zone.tables.forEach((table) => {
                tablesToCreate.push({
                  branchId: branchId,
                  zoneName: zone.name,
                  tableNumber: table.tableNumber,
                  capacity: table.capacity,
                });
              });
            }
          });

          if (tablesToCreate.length > 0) {
            await tx.table.createMany({ data: tablesToCreate });
          }
        }
      }

      // 3. Handle Warehouse Sync
      if (data.haveWarehouses !== undefined) {
        await tx.warehouse.deleteMany({ where: { branchId } });

        if (data.haveWarehouses && warehouseName) {
          await tx.warehouse.create({
            data: { branchId: branchId, name: warehouseName },
          });
        }
      }

      // 4. Handle Hardware Sync (Step 4 Kitchen Displays / Printers)
      if (hardware !== undefined) {
        await tx.hardware.deleteMany({ where: { branchId } });

        if (hardware.length > 0) {
          const hardwareToCreate = hardware.map((h) => {
            const formattedType =
              h.type.toUpperCase() === 'KITCHEN_DISPLAY' ||
              h.type.toUpperCase() === 'KDS'
                ? 'KDS'
                : 'PRINTER';

            return {
              branchId: branchId,
              type: formattedType as any,
              name: h.name,
              ipAddress: h.ipAddress,
            };
          });
          await tx.hardware.createMany({ data: hardwareToCreate });
        }
      }

      const updatedBranch = await tx.branch.findUnique({
        where: { id: branchId },
        include: { tables: true, warehouses: true, hardware: true },
      });

      this.kafkaClient.emit('branch.updated', updatedBranch);
      return updatedBranch;
    });
  }

  // ─── PHASE 3: COMPLETE SETUP ─────────────────────────────────────────────
  async finalizeBranch(restaurantId: string, branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, restaurantId: restaurantId },
      include: { tables: true },
    });

    if (!branch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Branch not found',
      });
    }

    // Strict validation before flipping to ACTIVE
    if (!branch.name || !branch.address || branch.name === 'Draft Branch') {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Branch name and address are required to finalize setup.',
      });
    }

    if (branch.haveTables && branch.tables.length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Branch is marked as having tables, but none were configured.',
      });
    }

    const activeBranch = await this.prisma.branch.update({
      where: { id: branchId },
      data: { status: 'ACTIVE' },
      include: { tables: true, warehouses: true, hardware: true },
    });

    this.kafkaClient.emit('branch.activated', activeBranch);
    return activeBranch;
  }

  // ─── STANDARD OPERATIONS ─────────────────────────────────────────────────

  async getBranches(restaurantId: string) {
    return this.prisma.branch.findMany({
      where: {
        restaurantId: restaurantId,
      },
    });
  }

  async getBranchById(restaurantId: string, branchId: string) {
    return this.prisma.branch.findFirst({
      where: {
        restaurantId: restaurantId,
        id: branchId,
      },
      include: {
        tables: true,
        warehouses: true,
        hardware: true,
      },
    });
  }

  async updateBranch(
    restaurantId: string,
    branchId: string,
    data: UpdateBranchDto,
  ) {
    const { hardware, ...updateData } = data;
    const branch = await this.prisma.branch.update({
      where: {
        restaurantId: restaurantId,
        id: branchId,
      },
      data: {
        ...updateData,
        ...(hardware && {
          hardware: {
            deleteMany: { branchId },
            createMany: {
              data: hardware.map((h) => {
                const formattedType =
                  h.type.toUpperCase() === 'KITCHEN_DISPLAY' ||
                  h.type.toUpperCase() === 'KDS'
                    ? 'KDS'
                    : 'PRINTER';

                return {
                  type: formattedType as any,
                  name: h.name,
                  ipAddress: h.ipAddress,
                };
              }),
            },
          },
        }),
      },
    });

    if (!branch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Branch not found',
      });
    }

    const updatedBranch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    this.kafkaClient.emit('branch.updated', updatedBranch);

    return updatedBranch;
  }

  async deleteBranch(restaurantId: string, branchId: string) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.table.deleteMany({ where: { branchId: branchId } });
      await tx.warehouse.deleteMany({ where: { branchId: branchId } });
      await tx.hardware.deleteMany({ where: { branchId: branchId } });

      const result = await tx.branch.deleteMany({
        where: {
          restaurantId: restaurantId,
          id: branchId,
        },
      });

      if (result.count === 0) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Branch not found',
        });
      }

      this.kafkaClient.emit('branch.deleted', { id: branchId, restaurantId });
      return { deleted: true };
    });
  }
}