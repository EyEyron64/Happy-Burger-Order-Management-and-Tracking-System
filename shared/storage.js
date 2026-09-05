const Storage = {
  // ---------- Menu items ----------
  getMenuItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]");
  },

  saveMenuItems(items) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  },

  addMenuItem(item) {
    const items = Storage.getMenuItems();
    items.push(item);
    Storage.saveMenuItems(items);
    return item;
  },

  updateMenuItem(id, updates) {
    const items = Storage.getMenuItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    Storage.saveMenuItems(items);
    return items[idx];
  },

  deleteMenuItem(id) {
    const items = Storage.getMenuItems().filter((i) => i.id !== id);
    Storage.saveMenuItems(items);
  },

  // ---------- Orders ----------
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
  },

  saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  saveOrder(order) {
    const orders = Storage.getOrders();
    orders.push(order);
    Storage.saveOrders(orders);
    return order;
  },

  getOrderById(id) {
    return Storage.getOrders().find((o) => o.id === id) || null;
  },

  updateOrderStatus(id, status) {
    const orders = Storage.getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    Storage.saveOrders(orders);
    return orders[idx];
  },

  // ---------- Admin session (demo-only, not secure) ----------
  isAdminLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === "true";
  },

  setAdminLoggedIn(value) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, value ? "true" : "false");
  },

  // ---------- Cross-tab live updates ----------
  // Fires `callback` whenever localStorage changes in ANOTHER tab/window.
  // Use this in tracking.html and orders.html to auto-refresh without polling.
  onExternalChange(callback) {
    window.addEventListener("storage", (event) => {
      if (
        event.key === STORAGE_KEYS.ORDERS ||
        event.key === STORAGE_KEYS.MENU_ITEMS
      ) {
        callback(event);
      }
    });
  },
};
