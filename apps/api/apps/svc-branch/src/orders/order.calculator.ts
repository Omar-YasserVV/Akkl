import { Injectable } from '@nestjs/common';
import { Prisma } from 'libs/db/generated/client/client';

type MenuItem = Prisma.BranchMenuItemGetPayload<{
  include: { variations: true };
}>;

type OrderItemInput = {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string | null; // 👈 add this
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

      if (!dbItem.variations.length) {
        throw new Error(`No variations for item ${dbItem.id}`);
      }

      const variation = dbItem.variations[0];
      if (!variation) {
        throw new Error(`Variation is undefined for item ${dbItem.id}`);
      }

      const unitPrice = variation.price.toNumber();

      total += unitPrice * itemInput.quantity;
      itemCount += itemInput.quantity;

      return {
        menuItemId: dbItem.id,
        quantity: itemInput.quantity,
        price: unitPrice,
        specialInstructions: itemInput.specialInstructions ?? null, // 👈 add this
      };
    });

    return { total, itemCount, orderItemsData };
  }
}
