import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'libs/db/generated/client/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });
  }

  delete(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  create(data: Prisma.OrderCreateArgs['data']) {
    return this.prisma.order.create({
      data,
      include: { items: true },
    });
  }

  update(id: string, data: Prisma.OrderUpdateArgs['data']) {
    return this.prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  getMenuItems(branchId: string, itemIds: string[]) {
    return this.prisma.branchMenuItem.findMany({
      where: {
        id: { in: itemIds },
        branchId,
      },
      include: { variations: true },
    });
  }

  async getOrdersByBranch(
    where: Prisma.OrderWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const total = await tx.order.count({ where });

      const orders = await tx.order.findMany({
        where,
        skip,
        take,
        include: {
          items: { include: { branchMenuItem: true } },
          user: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return { total, orders };
    });
  }

  groupByStatus(branchId: string) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: { branchId },
      _count: { status: true },
    });
  }
}
