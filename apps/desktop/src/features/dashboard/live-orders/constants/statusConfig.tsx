import { OrderState } from "@repo/types";
import { LuChefHat, LuCircleCheck, LuClock8, LuX } from "react-icons/lu";

export const statusConfig = {
  [OrderState.PENDING]: {
    label: "Pending",
    color: "status-pill-pending",
    icon: LuClock8,
    itemClass: "text-amber-700 data-[hover=true]:bg-amber-50",
  },
  [OrderState.IN_PROGRESS]: {
    label: "Cooking",
    color: "status-pill-cooking",
    icon: LuChefHat,
    itemClass: "text-orange-900 data-[hover=true]:bg-orange-50",
  },
  [OrderState.COMPLETED]: {
    label: "Ready",
    color: "status-pill-ready",
    icon: LuCircleCheck,
    itemClass: "text-green-800 data-[hover=true]:bg-green-50",
  },
  [OrderState.CANCELLED]: {
    label: "Cancelled",
    color: "status-pill-cancelled",
    icon: LuX,
    itemClass: "text-red-700 data-[hover=true]:bg-red-50",
  },
} as const;
