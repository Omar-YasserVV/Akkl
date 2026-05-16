import { IngredientCategory } from "@/features/dashboard/warehouse/types/inventory.types";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  CHIEF = "CHIEF",
  WAITER = "WAITER",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
}
export type UserRoleType = keyof typeof UserRole;

export enum ShiftStatus {
  ACTIVE = "ACTIVE",
  WORKING = "WORKING",
  COMPLETED = "COMPLETED",
}
export type ShiftStatusType = keyof typeof ShiftStatus;

export enum OrderState {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export type OrderStateType = keyof typeof OrderState;

export enum DietaryType {
  VEGAN = "VEGAN",
  GLUTEN_FREE = "GLUTEN_FREE",
  DAIRY_FREE = "DAIRY_FREE",
}
export type DietaryTypeType = keyof typeof DietaryType;

export enum Source {
  APP = "APP",
  STORE = "STORE",
}
export type SourceType = keyof typeof Source;

export enum ExpenseType {
  INGREDIENTS = "INGREDIENTS",
  SALARY = "SALARY",
  RENT = "RENT",
  UTILITIES = "UTILITIES",
  LOSSES = "LOSSES",
  MARKETING = "MARKETING",
}
export type ExpenseTypeType = keyof typeof ExpenseType;

/**
 * A master union of every possible enum key in the entire object
 */
export type AllEnums =
  | UserRoleType
  | ShiftStatusType
  | OrderStateType
  | DietaryTypeType
  | SourceType
  | ExpenseTypeType
  | IngredientCategory
  | CategoryType;

export enum Category {
  DESSERT = "DESSERT",
  MAIN_COURSE = "MAIN_COURSE",
  APPETIZER = "APPETIZER",
  BEVERAGE = "BEVERAGE",
  SIDE_DISH = "SIDE_DISH",
  MEAT = "MEAT",
  SEAFOOD = "SEAFOOD",
  DAIRY = "DAIRY",
}
export type CategoryType = keyof typeof Category;
