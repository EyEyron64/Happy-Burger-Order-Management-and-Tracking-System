const STORAGE_KEYS = {
  MENU_ITEMS: "bs_menuItems",
  ORDERS: "bs_orders",
  ADMIN_SESSION: "bs_adminSession",
  NEXT_ORDER_NUMBER: "bs_nextOrderNumber",
};

const ORDER_STATUS = {
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
];

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "burger123",
};
