import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { PrismaService } from '@app/db';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';

interface ExcelMenuRow {
  Name?: string;
  Description?: string;
  Image?: string;
  Available?: string | boolean;
  MenuItemID?: number | string;
  Variations?: string;
  DietaryTags?: string;
  Recipe?: string;
}

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
  //TODO:extract the func
  async handleExcelUpload(branchId: number, fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<ExcelMenuRow>(sheet);

    if (!rows || rows.length === 0) {
      throw new BadRequestException('The uploaded Excel file is empty.');
    }

    const items: BranchMenuItemDetailDto[] = rows.map((row) => {
      try {
        return {
          branchId: Number(branchId),
          name: String(row.Name || ''),
          description: row.Description ? String(row.Description) : undefined,
          image: row.Image ? String(row.Image) : undefined,
          isAvailable:
            row.Available === 'false' || row.Available === false ? false : true,
          menuItemId: Number(row.MenuItemID || 0),

          variations: row.Variations
            ? (JSON.parse(
                row.Variations,
              ) as unknown as BranchMenuItemDetailDto['variations'])
            : [],

          dietaryTags: row.DietaryTags
            ? String(row.DietaryTags)
                .split(',')
                .map((id) => Number(id.trim()))
            : [],

          recipe: row.Recipe
            ? (JSON.parse(
                row.Recipe,
              ) as unknown as BranchMenuItemDetailDto['recipe'])
            : [],
        } as BranchMenuItemDetailDto;
      } catch (e) {
        throw new BadRequestException(
          `Failed to parse row: ${row.Name ?? 'Unknown'}. Ensure JSON columns (Variations/Recipe) are valid. ${e}`,
        );
      }
    });

    return this.bulkCreateMenuItem(branchId, items);
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
      return await this.prisma.$transaction(
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
        error instanceof Error ? error.message : 'Bulk upload failed';
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
