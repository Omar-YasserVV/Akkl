import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices'; // Added RpcException
import { Prisma } from 'libs/db/generated/client/client';
import * as XLSX from 'xlsx';

interface ExcelMenuRow {
  Name?: string;
  Description?: string;
  Image?: string;
  Available?: string | boolean;
  MenuItemID?: string;
  Variations?: string;
  DietaryTags?: string;
  Recipe?: string;
}

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    @Inject('BRANCH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

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

  async getBranchMenu(branchId: string) {
    return this.prisma.branchMenuItem.findMany({
      where: { branchId: branchId },
      include: this.commonInclude,
    });
  }

  async createMenu(branchId: string, data: BranchMenuItemDetailDto) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new RpcException({
        message: `Branch with ID ${branchId} not found`,
        statusCode: 404,
      });
    }

    try {
      const newMenuItem = await this.prisma.branchMenuItem.create({
        data: {
          name: data.name,
          description: data.description,
          image: data.image,
          isAvailable: data.isAvailable,
          menuItemId: data.menuItemId,
          branchId: branchId,
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

      this.kafkaClient.emit('menu-item.created', newMenuItem);
      return newMenuItem;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          message:
            'One or more Dietary Tags or Ingredients were not found in the database.',
          statusCode: 400,
        });
      }

      if (error instanceof Error) {
        throw new RpcException({
          message: error.message || 'Internal Server Error',
          statusCode: 500,
        });
      }
    }
  }

  async updateMenuItem(
    menuItemId: string,
    data: UpdateBranchMenuItemDto,
    branchId?: string,
  ) {
    const menuItem = await this.prisma.branchMenuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new RpcException({
        message: `Menu item with ID ${menuItemId} not found`,
        statusCode: 404,
      });
    }

    if (branchId && menuItem.branchId !== branchId) {
      throw new RpcException({
        message: 'This menu item does not belong to the specified branch',
        statusCode: 403,
      });
    }

    const updatedMenuItem = await this.prisma.branchMenuItem.update({
      where: { id: menuItemId },
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
    this.kafkaClient.emit('menu-item.updated', updatedMenuItem);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: string, branchId: string) {
    const menuItem = await this.prisma.branchMenuItem.findFirst({
      where: { id: id, branchId: branchId },
    });

    if (!menuItem) {
      throw new RpcException({
        message: `Menu item with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await this.prisma.branchMenuItem.delete({
      where: { id: id },
    });

    this.kafkaClient.emit('menu-item.deleted', { id });
    return { message: `Menu item with ID ${id} deleted successfully` };
  }

  // --- Bulk & Excel Operations ---

  async handleExcelUpload(branchId: string, fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<ExcelMenuRow>(sheet);

    if (!rows || rows.length === 0) {
      throw new RpcException({
        message: 'The uploaded Excel file is empty.',
        statusCode: 400,
      });
    }

    const items = this.parseExcelRows(branchId, rows);
    return this.bulkCreateMenuItem(branchId, items);
  }

  private parseExcelRows(
    branchId: string,
    rows: ExcelMenuRow[],
  ): BranchMenuItemDetailDto[] {
    return rows.map((row) => {
      try {
        return {
          branchId: branchId,
          name: String(row.Name || ''),
          description: row.Description ? String(row.Description) : undefined,
          image: row.Image ? String(row.Image) : undefined,
          isAvailable:
            row.Available === 'false' || row.Available === false ? false : true,
          menuItemId: String(row.MenuItemID || ''),
          variations: row.Variations
            ? (JSON.parse(
                row.Variations,
              ) as BranchMenuItemDetailDto['variations'])
            : [],
          dietaryTags: row.DietaryTags
            ? String(row.DietaryTags)
                .split(',')
                .filter((id) => id.trim() !== '')
                .map((id) => id.trim())
            : [],
          recipe: row.Recipe
            ? (JSON.parse(row.Recipe) as BranchMenuItemDetailDto['recipe'])
            : [],
        } as BranchMenuItemDetailDto;
      } catch (e) {
        throw new RpcException({
          message: `Parsing failed for row "${row.Name || 'Unknown'}". ${e}`,
          statusCode: 400,
        });
      }
    });
  }

  async bulkCreateMenuItem(branchId: string, items: BranchMenuItemDetailDto[]) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new RpcException({
        message: `Branch with ID ${branchId} not found`,
        statusCode: 404,
      });
    }

    try {
      const bulkItems = await this.prisma.$transaction(
        items.map((item) =>
          this.prisma.branchMenuItem.create({
            data: {
              name: item.name,
              description: item.description,
              image: item.image,
              isAvailable: item.isAvailable,
              menuItemId: item.menuItemId,
              branchId: branchId,
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
      this.kafkaClient.emit('menu-items.bulk-created', bulkItems);
      return {
        message: `${bulkItems.length} menu items created successfully`,
        items: bulkItems,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Bulk upload failed';
      throw new RpcException({ message, statusCode: 400 });
    }
  }
}
