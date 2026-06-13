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

      const variation = dbItem.variations[0];
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
