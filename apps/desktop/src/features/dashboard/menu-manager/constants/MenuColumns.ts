export const MENU_COLUMNS = [
  { key: "name", label: "Item Name", align: undefined },
  { key: "category", label: "Category", align: "start" as const },
  { key: "price", label: "Price", align: "center" as const },
  { key: "prepTime", label: "Prep Time", align: "center" as const },
  { key: "status", label: "Status", align: "start" as const },
  { key: "description", label: "Description", align: "center" as const },
  { key: "actions", label: "Actions", align: "start" as const },
] as const;
