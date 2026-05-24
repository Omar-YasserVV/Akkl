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
      where: { branchNumber: String(data.branchNumber) },
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
        name: 'Draft Branch',
        status: 'DRAFT',
      },
    });

    this.kafkaClient.emit('branch.draft_created', newDraft);
    return { ...newDraft, activeStep: 1 };
  }

  // ─── PHASE 2: SAVE WIZARD PROGRESS ──────────────────────────────────────
  async updateOnboardingProgress(
    branchId: string,
    data: UpdateOnboardingDto,
  ) {
    const { zones, warehouseName, hardware, busyModeSettings, ...basicUpdateData } = data;

    return await this.prisma.$transaction(async (tx) => {
      // Fetch existing branch to merge JSON settings (preserves holidayClosure if it exists)
      const existing = await tx.branch.findUnique({ where: { id: branchId } });
      const currentBusySettings = (existing?.busyModeSettings as any) || {};

      const branch = await tx.branch.update({
        where: { id: branchId },
        data: {
          ...basicUpdateData,
          // Merge new busy settings with existing ones to preserve holidayClosure toggle
          busyModeSettings: busyModeSettings 
            ? { ...currentBusySettings, ...busyModeSettings } 
            : currentBusySettings,
        },
      });

      if (!branch) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Branch draft not found',
        });
      }

      // Handle Zones & Tables Sync
      if (zones !== undefined) {
        await tx.table.deleteMany({ where: { branchId } });
        if (zones.length > 0) {
          const tablesToCreate = zones.flatMap((zone) =>
            zone.tables.map((table) => ({
              branchId,
              zoneName: zone.name,
              tableNumber: table.tableNumber,
              capacity: table.capacity,
            }))
          );
          if (tablesToCreate.length > 0) await tx.table.createMany({ data: tablesToCreate });
        }
      }

      // Handle Warehouse Sync
      if (data.haveWarehouses !== undefined) {
        await tx.warehouse.deleteMany({ where: { branchId } });
        if (data.haveWarehouses && warehouseName) {
          await tx.warehouse.create({ data: { branchId, name: warehouseName } });
        }
      }

      // Handle Hardware Sync
      if (hardware !== undefined) {
        await tx.hardware.deleteMany({ where: { branchId } });
        if (hardware.length > 0) {
          await tx.hardware.createMany({
            data: hardware.map((h) => ({
              branchId,
              type: (h.type.toUpperCase() === 'KDS' ? 'KDS' : 'PRINTER') as any,
              name: h.name,
              ipAddress: h.ipAddress,
            })),
          });
        }
      }

      const updatedBranch = await tx.branch.findUnique({
        where: { id: branchId },
        include: { tables: true, warehouses: true, hardware: true },
      });

      const response = { ...updatedBranch, activeStep: this.calculateStep(updatedBranch) };
      this.kafkaClient.emit('branch.updated', response);
      return response;
    });
  }

  // ─── PHASE 3: COMPLETE SETUP ─────────────────────────────────────────────
  async finalizeBranch(branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId },
      include: { tables: true },
    });

    if (!branch) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'Branch not found' });

    if (!branch.name || branch.name === 'Draft Branch' || !branch.address) {
      throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: 'Branch identity incomplete' });
    }

    const activeBranch = await this.prisma.branch.update({
      where: { id: branchId },
      data: { status: 'ACTIVE' },
      include: { tables: true, warehouses: true, hardware: true },
    });

    this.kafkaClient.emit('branch.activated', activeBranch);
    return { ...activeBranch, activeStep: 4 };
  }

  // ─── STANDARD OPERATIONS ─────────────────────────────────────────────────

  async getBranches(restaurantId: string) {
    return this.prisma.branch.findMany({ where: { restaurantId } });
  }

  async getBranchById(branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId },
      include: { tables: true, warehouses: true, hardware: true },
    });
    return { ...branch, activeStep: this.calculateStep(branch) };
  }

  async updateBranch(branchId: string, data: UpdateBranchDto) {
    const { hardware, busyModeSettings, ...updateData } = data;
    
    // Merge logic for busyModeSettings in standard updates as well
    const existing = await this.prisma.branch.findUnique({ where: { id: branchId } });
    const currentBusySettings = (existing?.busyModeSettings as any) || {};

    const updatedBranch = await this.prisma.branch.update({
      where: { id: branchId },
      data: {
        ...updateData,
        ...(busyModeSettings && { busyModeSettings: { ...currentBusySettings, ...busyModeSettings } }),
        ...(hardware && {
          hardware: {
            deleteMany: { branchId },
            createMany: {
              data: hardware.map((h) => ({
                type: (h.type.toUpperCase() === 'KDS' ? 'KDS' : 'PRINTER') as any,
                name: h.name,
                ipAddress: h.ipAddress,
              })),
            },
          },
        }),
      },
      include: { tables: true, warehouses: true, hardware: true },
    });

    this.kafkaClient.emit('branch.updated', updatedBranch);
    return updatedBranch;
  }

  async deleteBranch(branchId: string) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.table.deleteMany({ where: { branchId } });
      await tx.warehouse.deleteMany({ where: { branchId } });
      await tx.hardware.deleteMany({ where: { branchId } });

      const result = await tx.branch.deleteMany({ where: { id: branchId } });
      if (result.count === 0) throw new RpcException({ status: HttpStatus.NOT_FOUND, message: 'Branch not found' });

      this.kafkaClient.emit('branch.deleted', { id: branchId });
      return { deleted: true };
    });
  }

// ─── HELPER: CALCULATE STEP ──────────────────────────────────────────────
  private calculateStep(branch: any): number {
    if (!branch) return 1;
    // Step 1 check
    if (!branch.name || branch.name === 'Draft Branch' || !branch.address) return 1;
    // Step 2 check
    if (!branch.weeklyHours) return 2;
    // Step 3 check
    if (branch.haveTables && (!branch.tables || branch.tables.length === 0)) return 3;
    // Step 4 (Hardware)
    return 4;
  }
}