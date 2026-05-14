import { BranchMenuItemDetailDto, UpdateBranchMenuItemDto } from '@app/common';
import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Prisma, category } from 'libs/db/generated/client/client';
import { createPagination } from 'utils/pagination.util';
import * as XLSX from 'xlsx';

interface ExcelMenuRow {
  Name?: string;
  Description?: string;
  Image?: string;
  Available?: string | boolean;
  MenuItemID?: string;
  Category?: string;
  Price?: string | number;
  DiscountPrice?: string | number;
  PreparationTime?: string | number;
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

  async getMenu(branchId: string) {
    return this.prisma.branchMenuItem.findMany({
      where: { branchId },
      include: this.commonInclude,
    });
  }

  async getBranchMenu(
    branchId: string,
    pagination: {
      page?: number;
      limit?: number;
      category?: category;
      isAvailable?: boolean;
    },
  ) {
    const page = Number(pagination?.page) || 1;
    const limit = Number(pagination?.limit) || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.BranchMenuItemWhereInput = {
      branchId,
      ...(pagination?.category ? { category: pagination.category } : {}),
    };

    if (pagination?.isAvailable === true) {
      where.isAvailable = true;
      where.recipe = {
        none: {
          OR: [
            {
              ingredient: {
                inventoryItems: {
                  none: { warehouse: { branchId } },
                },
              },
            },
            {
              ingredient: {
                inventoryItems: {
                  some: {
                    warehouse: { branchId },
                    stockStatus: 'OUT_OF_STOCK',
                  },
                },
              },
            },
          ],
        },
      };
    } else if (pagination?.isAvailable === false) {
      where.OR = [
        { isAvailable: false },
        {
          recipe: {
            some: {
              OR: [
                {
                  ingredient: {
                    inventoryItems: {
                      none: { warehouse: { branchId } },
                    },
                  },
                },
                {
                  ingredient: {
                    inventoryItems: {
                      some: {
                        warehouse: { branchId },
                        stockStatus: 'OUT_OF_STOCK',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.branchMenuItem.findMany({
        where,
        include: this.commonInclude,
        skip,
        take: limit,
      }),
      this.prisma.branchMenuItem.count({
        where,
      }),
    ]);

    return createPagination(items, total, page, limit);
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
          category: data.category, // ✅ Added
          price: data.price, // ✅ Added
          discountPrice: data.discountPrice, // ✅ Added
          preparationTime: data.preparationTime, // ✅ Added
          branchId,
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
        category: data.category, // ✅ Added
        price: data.price, // ✅ Added
        discountPrice: data.discountPrice, // ✅ Added
        preparationTime: data.preparationTime, // ✅ Added
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
      where: { id, branchId },
    });

    if (!menuItem) {
      throw new RpcException({
        message: `Menu item with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await this.prisma.branchMenuItem.delete({ where: { id } });

    this.kafkaClient.emit('menu-item.deleted', { id });
    return { message: `Menu item with ID ${id} deleted successfully` };
  }

  // --- Bulk & Excel Operations ---

  async handleExcelUpload(branchId: string, fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new RpcException({
        message: 'The uploaded Excel file has no sheets.',
        statusCode: 400,
      });
    }

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new RpcException({
        message: 'The selected sheet could not be read from the Excel file.',
        statusCode: 400,
      });
    }

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
          branchId,
          name: String(row.Name || ''),
          description: row.Description ? String(row.Description) : undefined,
          image: row.Image ? String(row.Image) : undefined,
          isAvailable:
            row.Available === 'false' || row.Available === false ? false : true,
          menuItemId: String(row.MenuItemID || ''),
          category: row.Category as BranchMenuItemDetailDto['category'], // ✅ Added
          price: row.Price ? Number(row.Price) : 0, // ✅ Added
          discountPrice: row.DiscountPrice // ✅ Added
            ? Number(row.DiscountPrice)
            : undefined,
          preparationTime: row.PreparationTime // ✅ Added
            ? Number(row.PreparationTime)
            : 0,
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
      const bulkItems = await this.prisma.$transaction(async (tx) => {
        // Use Promise.all for internal mapping if rows are independent 
        // but keep them in the loop for safe relational creation
        const createdItems: any[] = [];
        
        for (const item of items) {
          const created = await tx.branchMenuItem.create({
            data: {
              name: item.name,
              description: item.description,
              image: item.image,
              isAvailable: item.isAvailable,
              menuItemId: item.menuItemId,
              category: item.category,
              price: item.price,
              discountPrice: item.discountPrice,
              preparationTime: item.preparationTime,
              branch: { connect: { id: branchId } }, // Using connect is cleaner
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
                  ingredient: { connect: { id: r.ingredientId } },
                  quantityRequired: r.quantityRequired,
                })),
              },
            },
          });
          createdItems.push(created);
        }
        return createdItems;
      }, {
        timeout: 60000, // Increased to 60s for very large imports
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Prevents race conditions
      });

      // 3. Emit a SUMMARY to Kafka to avoid "Message Size Too Large" errors
      this.kafkaClient.emit('menu-items.bulk-created', {
        branchId,
        totalCreated: bulkItems.length,
        itemIds: bulkItems.map(i => i.id), // Only send IDs or a summary
      });

      return {
        success: true,
        count: bulkItems.length,
        message: 'Menu items and relations imported successfully',
      };

    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new RpcException({ message: 'Foreign key failure: Check if all Ingredient IDs and Dietary Tags exist.', status: 400 });
        case 'P2002':
          throw new RpcException({ message: 'Duplicate found: One of these items is already in the menu.', status: 409 });
        default:
          throw new RpcException({ message: `Database error: ${error.code}`, status: 400 });
      }
    }
    throw new RpcException({ message: error.message || 'Bulk upload failed', status: 500 });
  }
}
