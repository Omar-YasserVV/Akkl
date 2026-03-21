export type UsageReason =
  | "Kitchen Prep"
  | "Internal Transfer"
  | "Damaged"
  | "Expired"
  | "Sample/Testing"
  | "Discrepancy Correction";

export interface UsageRecordFromData {
  /** Reference to the item in the warehouse catalog (UUID or SKU) */
  ingredientId: string;

  /** The specific quantity being removed from stock */
  quantity: number;

  /** Standard unit of measure (e.g., 'kg', 'unit', 'box') */
  unit: string;

  /** The timestamp when the usage occurred/was recorded */
  recordedAt: Date | string;

  /** Categorization for accounting/inventory tracking */
  reason: UsageReason;

  /** Optional metadata for the usage event */
  notes?: string;

  /** Snapshot of stock levels at the time of entry */
  stockSnapshot: {
    current: number;
    projected: number;
  };
}
