// customer-app/js/cart.js
// The "cart" is a work-in-progress order, kept separate from Storage.orders.
// Each line carries its own `notes` (e.g. "No onions"), so two lines for
// the same menu item with different notes are kept separate rather than merged.

const CART_KEY = "bs_cart"; // customer-app-only key, not shared with admin

const Cart = {
  get() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  },

  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart.updateCountBadge();
  },

  addItem(menuItem, qty = 1, notes = "") {
    const items = Cart.get();
    const existing = items.find(
      (i) => i.menuItemId === menuItem.id && i.notes === notes
    );
    if (existing) {
      existing.qty += qty;
    } else {
      items.push(createOrderItem(menuItem, qty, notes));
    }
    Cart.save(items);
  },

  updateQty(menuItemId, notes, qty) {
    let items = Cart.get();
    if (qty <= 0) {
      items = items.filter(
        (i) => !(i.menuItemId === menuItemId && i.notes === notes)
      );
    } else {
      const line = items.find(
        (i) => i.menuItemId === menuItemId && i.notes === notes
      );
      if (line) line.qty = qty;
    }
    Cart.save(items);
  },

  removeItem(menuItemId, notes) {
    Cart.updateQty(menuItemId, notes, 0);
  },

  clear() {
    Cart.save([]);
  },

  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },

  updateCountBadge() {
    const el = document.getElementById("cart-count");
    if (el) el.textContent = Cart.count();
  },
};

document.addEventListener("DOMContentLoaded", Cart.updateCountBadge);