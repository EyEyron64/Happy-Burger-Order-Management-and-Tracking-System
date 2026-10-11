// shared/seed-orders.js
// DEV/DEMO TOOL: populates localStorage with realistic sample orders.
// Uses the real data-model factories, then backdates timestamps and assigns
// statuses by age so the dashboard, Live Queue, and Orders tabs all have
// something meaningful to show. Requires constants, utils, data-models,
// storage, and seed-data to be loaded first.

const SAMPLE_CUSTOMERS = [
  { name: "Juan Dela Cruz", contact: "+63 917 123 4567" },
  { name: "Maria Santos", contact: "+63 918 234 5678" },
  { name: "Jose Reyes", contact: "+63 919 345 6789" },
  { name: "Ana Garcia", contact: "+63 920 456 7890" },
  { name: "Miguel Torres", contact: "+63 921 567 8901" },
  { name: "Sofia Ramos", contact: "+63 922 678 9012" },
  { name: "Carlo Mendoza", contact: "+63 923 789 0123" },
  { name: "Bianca Cruz", contact: "+63 924 890 1234" },
];

const SAMPLE_NOTES = [
  "", "", "", "",
  "No onions",
  "Extra pickles",
  "Extra sauce",
  "No cheese",
  "Well done",
  "Cut in half",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Newer orders are likelier to still be active; older ones mostly completed.
function pickStatusByAge(minutesAgo) {
  const r = Math.random();
  if (minutesAgo <= 15) {
    return r < 0.6 ? ORDER_STATUS.PENDING : ORDER_STATUS.PREPARING;
  }
  if (minutesAgo <= 45) {
    if (r < 0.2) return ORDER_STATUS.PENDING;
    if (r < 0.7) return ORDER_STATUS.PREPARING;
    return ORDER_STATUS.READY;
  }
  if (minutesAgo <= 180) {
    if (r < 0.1) return ORDER_STATUS.PREPARING;
    if (r < 0.5) return ORDER_STATUS.READY;
    return ORDER_STATUS.COMPLETED;
  }
  return r < 0.85 ? ORDER_STATUS.COMPLETED : ORDER_STATUS.CANCELLED;
}

function seedSampleOrders({ count = 20, clearExisting = false } = {}) {
  seedMenuIfEmpty(); // make sure there's a menu to order from
  const menu = Storage.getMenuItems();
  if (menu.length === 0) {
    console.warn("[seed-orders] No menu items available.");
    return 0;
  }

  const orders = clearExisting ? [] : Storage.getOrders();
  const usedIds = new Set(orders.map((o) => o.id));
  const now = Date.now();
  const created = [];

  for (let i = 0; i < count; i++) {
    // First 5 are always recent so the Live Queue is never empty.
    const minutesAgo = i < 5 ? randInt(1, 45) : randInt(1, 60 * 24 * 3);
    const createdMs = now - minutesAgo * 60000;

    const lines = shuffle(menu)
      .slice(0, randInt(1, Math.min(3, menu.length)))
      .map((m) => createOrderItem(m, randInt(1, 3), pick(SAMPLE_NOTES)));

    const customer = pick(SAMPLE_CUSTOMERS);
    const fulfillmentMethod = pick(Object.values(FULFILLMENT_METHOD));
    const paymentMethod = pick(Object.values(PAYMENT_METHOD));

    const order = createOrder({
      items: lines,
      customerName: customer.name,
      contactNumber: customer.contact,
      fulfillmentMethod,
      paymentMethod,
      fulfillmentFee: fulfillmentMethod === FULFILLMENT_METHOD.DELIVERY ? DELIVERY_FEE : 0,
    });

    // Unique, backdated id + timestamps
    let id;
    do {
      id = `ORD-${createdMs}-${randInt(100, 999)}`;
    } while (usedIds.has(id));
    usedIds.add(id);
    order.id = id;

    order.status = pickStatusByAge(minutesAgo);
    order.createdAt = new Date(createdMs).toISOString();
    order.updatedAt =
      order.status === ORDER_STATUS.PENDING
        ? order.createdAt
        : new Date(Math.min(now, createdMs + randInt(3, 25) * 60000)).toISOString();

    orders.push(order);
    created.push(order);
  }

  Storage.saveOrders(orders);

  // Point the customer tracking page at the newest order for easy demoing.
  const newest = created.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  if (newest) localStorage.setItem("bs_lastOrderId", newest.id);

  return created.length;
}

// Wipes everything the system stores, so the next page load re-seeds the menu.
function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("bs_cart");
  localStorage.removeItem("bs_lastOrderId");
}