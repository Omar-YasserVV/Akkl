import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(branchId: number, data: any) {
    return this.prisma.branchMenuItem.create({
      data: {
        ...data,
        branchId: Number(branchId),
      },
      include: {
        recipe: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }
}
