import { OrderState, Source } from "@repo/types";
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

export const sources = [
  { label: "All", value: undefined },
  { label: "App Orders", value: "APP" as Source },
  { label: "Restaurant", value: "STORE" as Source },
] as const;

export const statuses = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" as OrderState },
  { label: "In Progress", value: "IN_PROGRESS" as OrderState },
  { label: "Completed", value: "COMPLETED" as OrderState },
  { label: "Cancelled", value: "CANCELLED" as OrderState },
] as const;

export const columns = [
  { name: "Order #", uid: "order#", align: "start" },
  { name: "Customer", uid: "customer", align: "start" },
  { name: "Source", uid: "source", align: "start" },
  { name: "Items", uid: "items", align: "start" },
  { name: "Total", uid: "total", align: "start" },
  { name: "Status", uid: "status", align: "start" },
  { name: "Actions", uid: "actions", align: "start" },
] as const;
