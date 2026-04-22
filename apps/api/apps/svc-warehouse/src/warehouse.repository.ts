import { PrismaService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { CreateInventoryItemReqDto } from './dto/inventory/inventory.create.dto';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getWarehouse(warehouseId: string) {
    return this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
  }

  async getIngredient(ingredientId: string) {
    return this.prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });
  }

  async getInventoryItem(inventoryItemId: string) {
    return this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: {
        ingredient: true,
      },
    });
  }

  async getAllInventoryItems(warehouseId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { warehouseId },
      include: { ingredient: true },
    });
  }

  async deleteInventoryItem(id: string) {
    await this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  async createInventoryItem(data: CreateInventoryItemReqDto) {
    return this.prisma.inventoryItem.create({
      data: {
        minimumQuantity: data.minimumQuantity,
        warehouseId: data.warehouseId,
        ingredientId: data.ingredientId,
        quantity: data.quantity,
      },
      include: { ingredient: true },
    });
  }
}
