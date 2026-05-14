import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import type { FormEvent } from "react";
import { FormProvider } from "react-hook-form";
import { BiX } from "react-icons/bi";

import { ControlledAutocomplete } from "@/features/dashboard/components/shared/ControlledAutocomplete";
import { ControlledInput } from "@/features/dashboard/components/shared/ControlledInput";
import { useWarehouseBranch } from "../../context/WarehouseBranchContext";
import {
  useConsumeInventoryItem,
  useCreateInventoryItem,
  useIngredients,
  useInventoryItems,
  useRestockInventoryItem,
} from "../../hooks/useWarehouse";
import { useWarehouseModalForm } from "../../hooks/useWarehouseModalForm";
import type { WarehouseModalFormData } from "../../types/WarehouseModal";
import RecordModalFooter from "./RecordModalFooter";
import RecordModalHeader from "./RecordModalHeader";

export interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabDefaults = (
  tab: WarehouseModalFormData["tab"],
): WarehouseModalFormData => {
  if (tab === "usage") {
    return { tab: "usage", inventoryItemId: "", quantity: 0 };
  }
  if (tab === "restock") {
    return {
      tab: "restock",
      inventoryItemId: "",
      quantity: 0,
      expiresAt: "",
    };
  }
  return {
    tab: "register",
    ingredientId: "",
    minimumQuantity: 0,
    initialRestock: 0,
  };
};

const AddRecordModal = ({ isOpen, onClose }: AddRecordModalProps) => {
  const methods = useWarehouseModalForm();
  const { warehouseId } = useWarehouseBranch();
  const tab = methods.watch("tab");

  const listQuery = useInventoryItems(
    warehouseId ? { warehouseId, page: 1, limit: 200 } : null,
  );
  const ingredientsQuery = useIngredients();

  const consume = useConsumeInventoryItem();
  const restock = useRestockInventoryItem();
  const createLine = useCreateInventoryItem();

  const inventoryOptions =
    listQuery.data?.data.map((row) => ({
      key: row.id,
      label: `${row.ingredient.name} (${row.quantity} ${row.ingredient.unit})`,
    })) ?? [];

  const ingredientOptions =
    ingredientsQuery.data?.map((ing) => ({
      key: ing.id,
      label: `${ing.name} (${ing.unit})`,
    })) ?? [];

  const handleClose = () => {
    onClose();
    methods.reset(tabDefaults("usage"));
  };

  const setTab = (next: WarehouseModalFormData["tab"]) => {
    methods.reset(tabDefaults(next));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!warehouseId) return;

    void methods.handleSubmit(async (data) => {
      try {
        if (data.tab === "usage") {
          await consume.mutateAsync({
            id: data.inventoryItemId,
            consumedQuantity: data.quantity,
            warehouseId,
          });
        } else if (data.tab === "restock") {
          await restock.mutateAsync({
            id: data.inventoryItemId,
            warehouseId,
            addedQuantity: data.quantity,
            ...(data.expiresAt
              ? { expiresAt: new Date(data.expiresAt).toISOString() }
              : {}),
          });
        } else {
          const created = await createLine.mutateAsync({
            ingredientId: data.ingredientId,
            warehouseId,
            minimumQuantity: data.minimumQuantity,
          });
          if (data.initialRestock && data.initialRestock > 0) {
            await restock.mutateAsync({
              id: created.id,
              warehouseId,
              addedQuantity: data.initialRestock,
            });
          }
        }
        handleClose();
      } catch {
        /* axios / server errors */
      }
    })();
  };

  const busy = consume.isPending || restock.isPending || createLine.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      closeButton={<BiX className="text-2xl" />}
      classNames={{
        base: "rounded-[20px]",
        header: "border-b py-4",
        footer: "border-t py-4 bg-white",
      }}
    >
      <ModalContent>
        {(internalClose) => (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit}>
              <RecordModalHeader
                onClose={internalClose}
                title="Stock actions"
                description="Consume, restock, or register a new ingredient line for this warehouse."
              />

              <ModalBody className="py-6 px-8 bg-default-50 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["usage", "Record usage"],
                      ["restock", "Restock"],
                      ["register", "New inventory line"],
                    ] as const
                  ).map(([key, label]) => (
                    <Button
                      key={key}
                      type="button"
                      size="sm"
                      variant={tab === key ? "solid" : "bordered"}
                      color={tab === key ? "primary" : "default"}
                      onPress={() => setTab(key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {(tab === "usage" || tab === "restock") && (
                  <>
                    <ControlledAutocomplete
                      name="inventoryItemId"
                      label="Inventory line"
                      placeholder="Search inventory…"
                      items={inventoryOptions}
                      className="w-full"
                    />
                    <ControlledInput
                      name="quantity"
                      label={
                        tab === "usage"
                          ? "Quantity to consume"
                          : "Quantity to add"
                      }
                      type="number"
                      placeholder="0"
                      className="max-w-md"
                    />
                  </>
                )}

                {tab === "restock" && (
                  <ControlledInput
                    name="expiresAt"
                    label="Expiry (optional)"
                    type="datetime-local"
                    placeholder=""
                    className="max-w-md"
                  />
                )}

                {tab === "register" && (
                  <>
                    <ControlledAutocomplete
                      name="ingredientId"
                      label="Ingredient"
                      placeholder="Choose ingredient…"
                      items={ingredientOptions}
                      className="w-full"
                    />
                    <ControlledInput
                      name="minimumQuantity"
                      label="Minimum quantity (alert threshold)"
                      type="number"
                      placeholder="0"
                      className="max-w-md"
                    />
                    <ControlledInput
                      name="initialRestock"
                      label="Initial stock (optional)"
                      type="number"
                      placeholder="0"
                      className="max-w-md"
                    />
                  </>
                )}
              </ModalBody>

              <RecordModalFooter onClose={internalClose} isBusy={busy} />
            </form>
          </FormProvider>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddRecordModal;
