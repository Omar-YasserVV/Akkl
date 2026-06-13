import { Injectable } from '@nestjs/common';
import { Prisma } from 'libs/db/generated/client/client';

type MenuItem = Prisma.BranchMenuItemGetPayload<{
  include: { variations: true };
}>;

type OrderItemInput = {
  menuItemId: string;
  quantity: number;
  variationId?: string | null;
  specialInstructions?: string | null;
};

@Injectable()
export class OrderCalculator {
  calculate(items: OrderItemInput[], menuItems: MenuItem[]) {
    let total = 0;
    let itemCount = 0;

    const orderItemsData = items.map((itemInput) => {
      const dbItem = menuItems.find((m) => m.id === itemInput.menuItemId);

      if (!dbItem) {
        throw new Error(
          `Item ${itemInput.menuItemId} not found in branch menu`,
        );
      }

      let variation = dbItem.variations[0];
      if (itemInput.variationId) {
        const found = dbItem.variations.find((v) => v.id === itemInput.variationId);
        if (!found) {
          throw new Error(
            `Variation ${itemInput.variationId} not found for menu item ${dbItem.id}`,
          );
        }
        variation = found;
      }

      const unitPrice = variation
        ? variation.price.toNumber()
        : dbItem.price.toNumber();
      const lineTotal = unitPrice * itemInput.quantity;

      total += lineTotal;
      itemCount += itemInput.quantity;

      return {
        menuItemId: dbItem.id,
        variationId: variation?.id ?? null,
        quantity: itemInput.quantity,
        price: unitPrice,
        totalPrice: lineTotal,
        specialInstructions: itemInput.specialInstructions ?? null,
      };
    });

    return { total, itemCount, orderItemsData };
  }
}
