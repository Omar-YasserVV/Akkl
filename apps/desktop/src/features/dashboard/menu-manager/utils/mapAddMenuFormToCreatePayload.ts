import type { AddMenuItemFormData } from "../types/AddItem";
import type { CreateBranchMenuItemPayload } from "../types/CreateMenuItem";

function parseMoney(value: string): number {
  const n = Number.parseFloat(value.trim());
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

/**
 * Maps the add-item modal form to the gateway create-menu body.
 * Uses safe defaults for required API fields that are not in this modal yet.
 */
export function mapAddMenuFormToCreatePayload(
  form: AddMenuItemFormData,
  branchId: string,
): CreateBranchMenuItemPayload {
  const name = form.itemName.trim();
  if (!name) {
    throw new Error("Item name is required.");
  }

  const variations = (form.sizes ?? [])
    .map((row) => {
      const size = row.name;
      const price = parseMoney(row.price ?? "");
      if (!size || Number.isNaN(price)) return null;
      return { size, price };
    })
    .filter(Boolean) as CreateBranchMenuItemPayload["variations"];

  if (variations.length === 0) {
    throw new Error("Add at least one variation with a name and valid price.");
  }

  const recipe = (form.recipeRows ?? [])
    .map((row) => {
      const ingredientId = row.ingredientId?.trim();
      const qty = Number.parseFloat(String(row.quantityRequired ?? "").trim());
      if (!ingredientId || !Number.isFinite(qty) || qty <= 0) return null;
      return { ingredientId, quantityRequired: qty };
    })
    .filter(Boolean) as CreateBranchMenuItemPayload["recipe"];

  const basePrice = variations[0]!.price;

  if (!branchId.trim()) {
    throw new Error("Branch ID is missing; cannot create menu item.");
  }

  return {
    menuItemId: crypto.randomUUID(),
    branchId: branchId.trim(),
    name,
    description: form.description.trim() || undefined,
    image: form.imageData?.trim() || undefined,
    isAvailable: form.inStock,
    category: form.category,
    price: basePrice,
    preparationTime: 15,
    variations,
    recipe,
  };
}
