import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from '@app/common';
import { PrismaService } from '@app/db';
import { RpcException, ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SvcBranchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createBranch(restaurantId: number, data: CreateBranchDto) {
    if (data.haveWarehouses && !data.warehouseName) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Warehouse name is required',
      });
    }

    if (data.haveTables && (!data.tablesCount || data.tablesCount <= 0)) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'You must specify a valid number of tables if haveTables is true',
      });
    }

    const existingBranch = await this.prisma.branch.findFirst({
      where: {
        restaurantId: Number(restaurantId),
        name: data.name,
        address: data.address,
      },
    });

    if (existingBranch) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'Branch already exists',
      });
    }

    const { warehouseName, tablesCount, ...branchData } = data;

    const tablesToCreate = data.haveTables
      ? Array.from({ length: tablesCount || 0 }, (_, i) => ({
          tableNumber: String(branchData.branchNumber) + '_' + String(i + 1),
          capacity: 4,
        }))
      : [];

    const newBranch = await this.prisma.branch.create({
      data: {
        ...branchData,
        branchNumber: String(branchData.branchNumber),
        restaurantId: Number(restaurantId),

        warehouses:
          data.haveWarehouses && warehouseName
            ? {
                create: [{ name: warehouseName }],
              }
            : undefined,

        tables: data.haveTables
          ? {
              create: tablesToCreate,
            }
          : undefined,
      },
      include: {
        warehouses: true,
        tables: true,
      },
    });

    this.kafkaClient.emit('branch.created', newBranch);
    return newBranch;
  }

  async getBranches(restaurantId: number) {
    return this.prisma.branch.findMany({
      where: {
        restaurantId: Number(restaurantId),
      },
    });
  }
  async getBranchById(restaurantId: number, branchId: number) {
    return this.prisma.branch.findFirst({
      where: {
        restaurantId: Number(restaurantId),
        id: Number(branchId),
      },
      include: {
        restaurant: true,

        employees: true,
        shifts: true,
        expenses: true,

        tables: true,
        warehouses: true,
        reservations: true,

        branchMenu: {
          include: {
            recipe: {
              include: {
                ingredient: true,
              },
            },
          },
        },

        orders: true,
      },
    });
  }
  async updateBranch(
    restaurantId: number,
    branchId: number,
    data: UpdateBranchDto,
  ) {
    const { ...updateData } = data;
    const branch = await this.prisma.branch.update({
      where: {
        restaurantId: Number(restaurantId),
        id: Number(branchId),
      },
      data: updateData,
    });

    if (!branch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Branch not found',
      });
    }

    const updatedBranch = await this.prisma.branch.findUnique({
      where: { id: Number(branchId) },
    });

    this.kafkaClient.emit('branch.updated', updatedBranch);

    return updatedBranch;
  }

  async deleteBranch(restaurantId: number, branchId: number) {
    await this.prisma.branch.deleteMany({
      where: {
        restaurantId: Number(restaurantId),
        id: Number(branchId),
      },
    });
    this.kafkaClient.emit('branch.deleted', { id: branchId, restaurantId });

    return { deleted: true };
  }
}
