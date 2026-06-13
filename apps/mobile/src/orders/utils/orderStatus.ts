import type { OrderStatus } from "@/orders/types/PaginatedResponse";

export type PickupStage = "confirmed" | "preparing" | "ready" | "cancelled";

export function getPickupStageFromStatus(status: OrderStatus): PickupStage {
  if (status === "COMPLETED") return "ready";
  if (status === "CANCELLED") return "cancelled";
  if (status === "IN_PROGRESS") return "preparing";
  return "confirmed";
}

export function getPickupStatusTitle(status: OrderStatus): string {
  if (status === "COMPLETED") return "Your order is ready!";
  if (status === "CANCELLED") return "Order cancelled";
  if (status === "IN_PROGRESS") return "Preparing your meal";
  return "Order confirmed";
}

export function getPickupStatusSubtitle(
  status: OrderStatus,
  estimatedMinutes?: number,
): string {
  if (status === "COMPLETED") return "Pick up at the counter";
  if (status === "CANCELLED") return "This order is no longer active";
  if (status === "IN_PROGRESS" && estimatedMinutes) {
    return `Estimated pick-up in ${estimatedMinutes} mins`;
  }
  if (status === "IN_PROGRESS") return "Kitchen is working on your order";
  return "We've received your order";
}

export function getEstimatedPrepMinutes(
  items: { branchMenuItem: { preparationTime: number }; quantity: number }[],
): number | undefined {
  if (!items.length) return undefined;

  const maxPrep = Math.max(
    ...items.map((item) => item.branchMenuItem.preparationTime * item.quantity),
  );

  return maxPrep > 0 ? maxPrep : undefined;
}
