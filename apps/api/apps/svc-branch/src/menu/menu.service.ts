import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { PrismaService } from '@app/db';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  private readonly commonInclude = {
    variations: true,
    dietaryTags: true,
    recipe: {
      include: { ingredient: true },
    },
  };

  async getMenu() {
    return this.prisma.branchMenuItem.findMany({
      include: this.commonInclude,
    });
  }

  async getBranchMenu(branchId: number) {
    return this.prisma.branchMenuItem.findMany({
      where: { branchId: Number(branchId) },
      include: this.commonInclude,
    });
  }

  async createMenu(branchId: number, data: BranchMenuItemDetailDto) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: Number(branchId) },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }

    return this.prisma.branchMenuItem.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        isAvailable: data.isAvailable ?? true,
        menuItemId: data.menuItemId,
        branch: { connect: { id: Number(branchId) } },
        variations: {
          create: data.variations?.map((v) => ({
            size: v.size,
            price: v.price,
            discountPrice: v.discountPrice,
          })),
        },
        dietaryTags: {
          connect: data.dietaryTags?.map((tagId) => ({ id: tagId })),
        },
        recipe: {
          create: data.recipe?.map((r) => ({
            ingredientId: r.ingredientId,
            quantityRequired: r.quantityRequired,
          })),
        },
      },
      include: this.commonInclude,
    });
  }

  async bulkCreateMenuItem(branchId: number, items: BranchMenuItemDetailDto[]) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: Number(branchId) },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branchId} not found`);
    }

    try {
      return this.prisma.$transaction(
        items.map((item) =>
          this.prisma.branchMenuItem.create({
            data: {
              name: item.name,
              description: item.description,
              image: item.image,
              isAvailable: item.isAvailable,
              menuItemId: item.menuItemId,
              branchId: Number(branchId),

              variations: {
                create: item.variations?.map((v) => ({
                  size: v.size,
                  price: v.price,
                  discountPrice: v.discountPrice,
                })),
              },

              dietaryTags: {
                connect: item.dietaryTags?.map((tagId) => ({ id: tagId })),
              },

              recipe: {
                create: item.recipe?.map((r) => ({
                  ingredientId: r.ingredientId,
                  quantityRequired: r.quantityRequired,
                })),
              },
            },
          }),
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new BadRequestException(message);
    }
  }

  async updateMenuItem(menuItemId: number, data: UpdateBranchMenuItemDto) {
    const menuItem = await this.prisma.branchMenuItem.findUnique({
      where: { id: Number(menuItemId) },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${menuItemId} not found`);
    }

    return this.prisma.branchMenuItem.update({
      where: { id: Number(menuItemId) },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        isAvailable: data.isAvailable,
        variations: data.variations
          ? {
              deleteMany: {},
              create: data.variations,
            }
          : undefined,
        dietaryTags: data.dietaryTags
          ? {
              set: data.dietaryTags.map((id) => ({ id })),
            }
          : undefined,
        recipe: data.recipe
          ? {
              deleteMany: {},
              create: data.recipe.map((r) => ({
                ingredientId: r.ingredientId,
                quantityRequired: r.quantityRequired,
              })),
            }
          : undefined,
      },
      include: this.commonInclude,
    });
  }

  async deleteMenuItem(menuItemId: number) {
    return this.prisma.branchMenuItem.delete({
      where: { id: Number(menuItemId) },
    });
  }
}
