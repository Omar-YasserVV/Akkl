import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrderValidator {
  constructor(private readonly prisma: PrismaService) {}

  async validateBranchAndUser(branchId: string, userId: string) {
    const [branch, user] = await Promise.all([
      this.prisma.branch.findUnique({ where: { id: branchId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!branch)
      throw new RpcException({
        statusCode: 404,
        message: `Branch ${branchId} not found`,
      });

    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: `User ${userId} not found`,
      });

    return { branch, user };
  }

  validateItems(items: any[]) {
    if (!items?.length) {
      throw new RpcException({
        statusCode: 400,
        message: 'Order must contain at least one item.',
      });
    }
  }
}
