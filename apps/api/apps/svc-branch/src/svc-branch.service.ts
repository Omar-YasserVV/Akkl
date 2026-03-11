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
        message: 'Branch with the same name and address already exists',
      });
    }

    const newBranch = await this.prisma.branch.create({
      data: {
        ...data,
        restaurantId: Number(restaurantId),
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
    const branch = await this.prisma.branch.update({
      where: {
        restaurantId: Number(restaurantId),
        id: Number(branchId),
      },
      data,
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
