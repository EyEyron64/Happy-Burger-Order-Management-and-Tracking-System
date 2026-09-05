function createMenuItem({ name, description = "", price, image = "", id = null }) {
  return {
    id: id || generateId("ITEM"),
    name,
    description,
    price: Number(price),
    image,
  };
}

function createOrderItem(menuItem, qty) {
  return {
    menuItemId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    qty,
  };
}

function createOrder({ items, customerName, notes = "" }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return {
    id: generateId("ORD"),
    items,
    customerName,
    notes,
    status: ORDER_STATUS.PENDING,
    total,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}