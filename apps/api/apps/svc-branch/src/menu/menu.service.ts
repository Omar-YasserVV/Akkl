import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenu() {
    return this.prisma.branchMenuItem.findMany({
      include: {
        recipe: { include: { ingredient: true } },
      },
    });
  }

  async getBranchMenu(branchId: number) {
    return this.prisma.branchMenuItem.findMany({
      where: { branchId: Number(branchId) },
      include: {
        recipe: { include: { ingredient: true } },
      },
    });
  }

  async createMenu(BranchId: number, data: BranchMenuItemDetailDto) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: Number(BranchId) },
    });
    if (!branch) {
      throw new Error(`Branch with ID ${BranchId} not found`);
    }

    
    return this.prisma.branchMenuItem.create({
      data: {
        ...data,
        branchId: Number(BranchId),
        menuItemId: data.menuItemId,
        recipe: {
          create: data.recipe.map((ingredient) => ({ ...ingredient })),
        },
      },
    });
  }
}
