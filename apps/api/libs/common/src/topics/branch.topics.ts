export const BRANCH_TOPICS = {
  // Branch
  GET_ALL: 'get-branches',
  GET_BY_ID: 'get-branch-by-id',
  CREATE: 'create-branch',
  UPDATE: 'update-branch',
  DELETE: 'delete-branch',
  // Menu
  MENU_GET: 'get_branch_menu',
  MENU_GET_ALL: 'get_all_menu_items',
  MENU_CREATE: 'create_menu_item',
  MENU_UPDATE: 'update_menu_item',
  MENU_DELETE: 'delete_menu_item',
  MENU_UPLOAD: 'upload_menu_excel',
  // Orders
  ORDER_GET_ALL: 'get_orders_by_branch',
  ORDER_GET_BY_ID: 'get_order_by_id',
  ORDER_CREATE: 'create_order',
  ORDER_UPDATE: 'update_order',
  ORDER_DELETE: 'delete_order',
} as const;
