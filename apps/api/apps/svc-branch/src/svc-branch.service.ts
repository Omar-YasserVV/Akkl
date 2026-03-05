import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from '@app/common';
import { PrismaService } from '@app/db';

@Injectable()
export class SvcBranchService {
  constructor(private readonly prisma: PrismaService) {}

  async createBranch(restaurantId: number, data: CreateBranchDto) {
    return this.prisma.branch.create({
      data: {
        ...data,
        restaurantId: Number(restaurantId),
      },
    });
  }
}
