export const BRANCH_TOPICS = {
  // Branch
  GET_ALL: 'get-branches',
  GET_BY_ID: 'get-branch-by-id',
  CREATE: 'create-branch',
  UPDATE: 'update-branch',
  DELETE: 'delete-branch',
  // Menu
  GET_MENU: 'get_branch_menu',
  GET_ALL_MENU_ITEMS: 'get_all_menu_items',
  CREATE_MENU: 'create_menu_item',
  UPDATE_MENU: 'update_menu_item',
  DELETE_MENU: 'delete_menu_item',
  UPLOAD_MENU: 'upload_menu_excel',
  // Orders
  GET_ALL_ORDERS: 'get_orders_by_branch',
  GET_ORDER_BY_ID: 'get_order_by_id',
  CREATE_ORDER: 'create_order',
  UPDATE_ORDER: 'update_order',
  DELETE_ORDER: 'delete_order',
  GET_ORDER_STATUSES: 'get_order_statuses',
} as const;
