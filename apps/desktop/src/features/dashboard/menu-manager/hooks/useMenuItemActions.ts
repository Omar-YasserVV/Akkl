import type { BranchMenuItem } from "@/types/Menu";
import { useState } from "react";
import type { AddMenuItemFormData } from "../types/AddItem";
import { mapAddMenuFormToUpdatePayload } from "../utils/mapAddMenuFormToCreatePayload";
import { useDeleteBranchMenuItem } from "./useDeleteBranchMenuItem";
import { useUpdateBranchMenuItem } from "./useUpdateBranchMenuItem";

export function useMenuItemActions() {
  const updateMenuItem = useUpdateBranchMenuItem();
  const deleteMenuItem = useDeleteBranchMenuItem();
  const [selectedItem, setSelectedItem] = useState<BranchMenuItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openEdit = (item: BranchMenuItem) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedItem(null);
  };

  const updateSelectedItem = async (formData: AddMenuItemFormData) => {
    if (!selectedItem) return;

    await updateMenuItem.mutateAsync({
      id: selectedItem.id,
      payload: mapAddMenuFormToUpdatePayload(formData),
    });
  };

  const deleteItem = async (item: BranchMenuItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    setSelectedItem(item);
    try {
      await deleteMenuItem.mutateAsync(item.id);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Could not delete the menu item.",
      );
    } finally {
      setSelectedItem(null);
    }
  };

  return {
    selectedItem,
    isEditOpen,
    isDeleting: deleteMenuItem.isPending,
    openEdit,
    closeEdit,
    updateSelectedItem,
    deleteItem,
  };
}
