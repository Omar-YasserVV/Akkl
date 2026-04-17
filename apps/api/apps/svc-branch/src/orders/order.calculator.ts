import { Injectable } from '@nestjs/common';
import { Prisma } from 'libs/db/generated/client/client';

type MenuItem = Prisma.BranchMenuItemGetPayload<{
  include: { variations: true };
}>;

type OrderItemInput = {
  menuItemId: string;
  quantity: number;
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

      // ✅ FIX: convert Decimal → number
      const unitPrice = dbItem.variations[0].price.toNumber();

      total += unitPrice * itemInput.quantity;
      itemCount += itemInput.quantity;

      return {
        menuItemId: dbItem.id,
        quantity: itemInput.quantity,
        price: unitPrice,
      };
    });

    return { total, itemCount, orderItemsData };
  }
}
