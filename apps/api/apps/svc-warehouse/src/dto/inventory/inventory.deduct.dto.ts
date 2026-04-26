// dto/inventory/inventory.deduct.dto.ts

export class OrderItemDto {
  menuItemId: string;
  quantity: number;
}

export class DeductForOrderReqDto {
  orderId: string;
  branchId: string;
  items: OrderItemDto[];
}

export class DeductForOrderResDto {
  success: boolean;
  message?: string;
}
