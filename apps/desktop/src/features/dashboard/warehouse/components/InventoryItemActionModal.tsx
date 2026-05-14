import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  useConsumeInventoryItem,
  useDeleteInventoryItem,
  useRestockInventoryItem,
  useUpdateInventoryItem,
} from "../hooks/useWarehouse";
import type { InventoryItemDto } from "../types/inventory.types";

type ModalMode = "consume" | "restock" | "editMin" | null;

export interface InventoryItemActionModalProps {
  mode: ModalMode;
  item: InventoryItemDto | null;
  warehouseId: string;
  onClose: () => void;
}

const InventoryItemActionModal = ({
  mode,
  item,
  warehouseId,
  onClose,
}: InventoryItemActionModalProps) => {
  const [qty, setQty] = useState("");
  const [minQty, setMinQty] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const consume = useConsumeInventoryItem();
  const restock = useRestockInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const removeItem = useDeleteInventoryItem();

  useEffect(() => {
    if (item && mode === "editMin") {
      setMinQty(String(item.minimumQuantity));
    } else {
      setMinQty("");
    }
    setQty("");
    setExpiresAt("");
  }, [item, mode]);

  const isOpen = mode !== null && !!item;
  const busy =
    consume.isPending ||
    restock.isPending ||
    updateItem.isPending ||
    removeItem.isPending;

  const handleSubmit = async () => {
    if (!item) return;
    const n = Number(qty);
    const minN = Number(minQty);

    try {
      if (mode === "consume") {
        if (!Number.isFinite(n) || n <= 0) return;
        await consume.mutateAsync({
          id: item.id,
          consumedQuantity: n,
          warehouseId,
        });
        onClose();
      } else if (mode === "restock") {
        if (!Number.isFinite(n) || n <= 0) return;
        await restock.mutateAsync({
          id: item.id,
          warehouseId,
          addedQuantity: n,
          ...(expiresAt
            ? { expiresAt: new Date(expiresAt).toISOString() }
            : {}),
        });
        onClose();
      } else if (mode === "editMin") {
        if (!Number.isFinite(minN) || minN < 0) return;
        await updateItem.mutateAsync({
          id: item.id,
          warehouseId,
          minimumQuantity: minN,
        });
        onClose();
      }
    } catch {
      // errors surface via axios / global handlers if configured
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm(`Delete inventory line for ${item.ingredient.name}?`))
      return;
    try {
      await removeItem.mutateAsync({ id: item.id, warehouseId });
      onClose();
    } catch {
      /* handled upstream */
    }
  };

  const title =
    mode === "consume"
      ? "Record usage (consume)"
      : mode === "restock"
        ? "Restock"
        : mode === "editMin"
          ? "Minimum quantity"
          : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody className="gap-3">
          {item && (
            <p className="text-sm text-default-600">
              {item.ingredient.name} — current {item.quantity.toLocaleString()}{" "}
              {item.ingredient.unit}
            </p>
          )}
          {mode === "consume" && (
            <Input
              label="Quantity to consume"
              type="number"
              value={qty}
              onValueChange={setQty}
              min={0}
              step="any"
            />
          )}
          {mode === "restock" && (
            <>
              <Input
                label="Quantity to add"
                type="number"
                value={qty}
                onValueChange={setQty}
                min={0}
                step="any"
              />
              <Input
                label="Expiry (optional)"
                type="datetime-local"
                value={expiresAt}
                onValueChange={setExpiresAt}
              />
            </>
          )}
          {mode === "editMin" && (
            <Input
              label="Minimum quantity threshold"
              type="number"
              value={minQty}
              onValueChange={setMinQty}
              min={0}
              step="any"
            />
          )}
        </ModalBody>
        <ModalFooter className="justify-between">
          <div>
            {mode && item && (
              <Button
                color="danger"
                variant="light"
                onPress={handleDelete}
                isDisabled={busy}
              >
                Delete line
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="light" onPress={onClose} isDisabled={busy}>
              Cancel
            </Button>
            {mode !== "editMin" && mode !== null && (
              <Button color="primary" onPress={handleSubmit} isLoading={busy}>
                Confirm
              </Button>
            )}
            {mode === "editMin" && (
              <Button color="primary" onPress={handleSubmit} isLoading={busy}>
                Save
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InventoryItemActionModal;
