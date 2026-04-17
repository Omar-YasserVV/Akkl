import { LuChefHat, LuCircleCheck, LuClock8 } from "react-icons/lu";
import { OrdersStats } from "../types/LiveOrders.types"; //
import { StatConfig } from "../types/StatsCard.types";

export const getStatsConfig = (stats?: OrdersStats): StatConfig[] => [
  {
    label: "Pending",
    value: stats?.PENDING ?? 0, //
    icon: LuClock8,
    borderColor: "border-amber-400",
    bgColor: "bg-amber-100",
    iconColor: "text-[#746A0C]",
  },
  {
    label: "Cooking",
    value: stats?.IN_PROGRESS ?? 0, //
    icon: LuChefHat,
    borderColor: "border-orange-500",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-900",
  },
  {
    label: "Ready",
    value: stats?.COMPLETED ?? 0, //
    icon: LuCircleCheck,
    borderColor: "border-green-500",
    bgColor: "bg-green-100",
    iconColor: "text-green-800",
  },
];
