// shared/data-models.js
// Factory functions that define the exact shape of each object we store.

function createMenuItem({ name, description = "", price, image = "", id = null }) {
  return {
    id: id || generateId("ITEM"),
    name,
    description,
    price: Number(price),
    image,
  };
}

// `notes` here is per-item customization, e.g. "Double Patty, No Onions" —
// different from the order-level `notes` in createOrder below.
function createOrderItem(menuItem, qty, notes = "") {
  return {
    menuItemId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    qty,
    notes,
  };
}

function createOrder({
  items,
  customerName,
  contactNumber = "",
  fulfillmentMethod = FULFILLMENT_METHOD.PICKUP,
  paymentMethod = PAYMENT_METHOD.CASH,
  fulfillmentFee = 0,
  notes = "",
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + Number(fulfillmentFee);

  return {
    id: generateId("ORD"),
    items,
    customerName,
    contactNumber,
    fulfillmentMethod,
    paymentMethod,
    subtotal,
    fulfillmentFee: Number(fulfillmentFee),
    total,
    notes,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}