import { AllEnums } from "@repo/types";

export type Meta = { label: string; color: string };
export const ENUM_META: Partial<Record<AllEnums, Meta>> = {
  CUSTOMER: { label: "Customer", color: "bg-gray-100 text-gray-700" },
  BUSINESS_OWNER: {
    label: "Business Owner",
    color: "bg-purple-100 text-purple-700",
  },
  CHIEF: { label: "Chef", color: "bg-orange-100 text-orange-700" },
  WAITER: { label: "Waiter", color: "bg-blue-100 text-blue-700" },
  MANAGER: { label: "Manager", color: "bg-green-100 text-green-700" },
  CASHIER: { label: "Cashier", color: "bg-cyan-100 text-cyan-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  WORKING: { label: "Working", color: "bg-blue-100 text-blue-700" },
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  VEGAN: { label: "Vegan", color: "bg-green-100 text-green-700" },
  GLUTEN_FREE: { label: "Gluten Free", color: "bg-orange-100 text-orange-700" },
  DAIRY_FREE: { label: "Dairy Free", color: "bg-blue-100 text-blue-700" },
  APP: { label: "App", color: "bg-purple-100 text-purple-700" },
  STORE: { label: "Store", color: "bg-cyan-100 text-cyan-700" },
  INGREDIENTS: { label: "Ingredients", color: "bg-orange-100 text-orange-700" },
  SALARY: { label: "Salary", color: "bg-green-100 text-green-700" },
  RENT: { label: "Rent", color: "bg-red-100 text-red-700" },
  UTILITIES: { label: "Utilities", color: "bg-yellow-100 text-yellow-800" },
  LOSSES: { label: "Losses", color: "bg-gray-100 text-gray-700" },
  MARKETING: { label: "Marketing", color: "bg-purple-100 text-purple-700" },
};
