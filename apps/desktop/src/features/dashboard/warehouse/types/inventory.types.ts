/** Mirrors Prisma / API enums for warehouse payloads */

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type BatchStatus = "ACTIVE" | "DEPLETED" | "EXPIRED" | "DAMAGED";

export type MeasurementUnit =
  | "KG"
  | "G"
  | "L"
  | "ML"
  | "PCS"
  | "TSP"
  | "TBSP"
  | "CUP";

export type IngredientCategory =
  | "MEAT"
  | "SEAFOOD"
  | "DAIRY"
  | "PRODUCE"
  | "GRAINS"
  | "SPICES"
  | "OILS"
  | "SAUCES"
  | "BAKERY"
  | "BEVERAGES"
  | "NUTS"
  | "OTHER";

export interface IngredientDto {
  id: string;
  name: string;
  unit: MeasurementUnit;
  category: IngredientCategory;
}

export interface StockBatchDto {
  id: string;
  initialQuantity: number;
  remainingQuantity: number;
  numberOfUnits: number | null;
  unitSize: number | null;
  receivedAt: string;
  expiresAt: string | null;
  status: BatchStatus;
}

export interface InventoryItemDto {
  id: string;
  quantity: number;
  minimumQuantity: number;
  stockStatus: StockStatus;
  ingredientId: string;
  warehouseId: string;
  ingredient: IngredientDto;
  batches: StockBatchDto[];
}

export interface WarehouseSummaryDto {
  id: string;
  name: string;
  branchId: string;
}

export interface CreateIngredientBody {
  name: string;
  unit: MeasurementUnit;
  category: IngredientCategory;
}

export interface CreateInventoryItemBody {
  ingredientId: string;
  warehouseId: string;
  minimumQuantity: number;
}

export interface ListInventoryQuery {
  warehouseId: string;
  page?: number;
  limit?: number;
  stockStatus?: StockStatus;
}

export type InventoryLogAction = "CREATE" | "RESTOCK" | "CONSUME" | "UPDATE";

export interface InventoryUsageLogDto {
  id: string;
  inventoryItemId: string;
  action: InventoryLogAction;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  notes: string | null;
  createdAt: string;
  inventoryItem?: InventoryItemDto;
}
