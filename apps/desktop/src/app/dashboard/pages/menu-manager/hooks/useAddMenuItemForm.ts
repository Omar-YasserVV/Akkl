import { useForm } from "react-hook-form";
import type { AddMenuItemFormData } from "../types/types";
import { ADD_MENU_ITEM_DEFAULT_VALUES } from "../constants/formConfig";

export function useAddMenuItemForm(
  defaultValues = ADD_MENU_ITEM_DEFAULT_VALUES,
) {
  return useForm<AddMenuItemFormData>({
    defaultValues,
    mode: "onTouched",
  });
}
