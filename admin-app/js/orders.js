// admin-app/js/orders.js
// Lists orders with tab filtering (by status) and a search box (by order
// ID or item name). Clicking a row navigates to the order detail page
// (order-detail.html — not yet built).

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Completed" },
];

let activeTab = "ALL";
let searchQuery = "";

function shortOrderNumber(id) {
  const digitsOnly = id.replace(/\D/g, "");
  return `#${digitsOnly.slice(-4) || id}`;
}

function fulfillmentLabel(method) {
  switch (method) {
    case "DELIVERY": return "Delivery";
    case "MEETUP": return "Meet-up";
    case "PICKUP":
    default: return "Pick-up";
  }
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}

function tabCount(orders, key) {
  if (key === "ALL") return orders.filter((o) => o.status !== "CANCELLED").length;
  return orders.filter((o) => o.status === key).length;
}

function renderTabs(orders) {
  const container = document.getElementById("orders-tabs");
  container.innerHTML = TABS.map(
    (tab) => `
    <button class="orders-tab ${tab.key === activeTab ? "active" : ""}" data-tab="${tab.key}">
      ${tab.label} (${tabCount(orders, tab.key)})
    </button>
  `
  ).join("");

  qsa(".orders-tab", container).forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      renderOrders();
    });
  });
}

function matchesSearch(order, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const idMatch = order.id.toLowerCase().includes(q);
  const itemMatch = order.items.some((i) => i.name.toLowerCase().includes(q));
  return idMatch || itemMatch;
}

function renderTable(orders) {
  let filtered = orders.filter((o) => o.status !== "CANCELLED" || activeTab === "ALL");

  if (activeTab !== "ALL") {
    filtered = filtered.filter((o) => o.status === activeTab);
  }

  filtered = filtered.filter((o) => matchesSearch(o, searchQuery));
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const tbody = document.getElementById("orders-table-body");
  const emptyEl = document.getElementById("orders-empty");

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  tbody.innerHTML = filtered
    .map((o) => {
      const itemsSummary = o.items.map((i) => `${i.qty}x ${i.name}`).join(", ");
      return `
      <tr data-order-id="${o.id}">
        <td class="order-id-cell">${shortOrderNumber(o.id)}</td>
        <td class="items-cell">${escapeHtml(itemsSummary)}</td>
        <td>${fulfillmentLabel(o.fulfillmentMethod)}</td>
        <td class="time-cell">${timeAgo(o.createdAt)}</td>
        <td><span class="badge ${o.status}">${o.status}</span></td>
      </tr>
    `;
    })
    .join("");

  qsa("tr[data-order-id]", tbody).forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `order-detail.html?id=${encodeURIComponent(row.dataset.orderId)}`;
    });
  });
}

function renderOrders() {
  const orders = Storage.getOrders();
  renderTabs(orders);
  renderTable(orders);
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();

  document.getElementById("orders-search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderTable(Storage.getOrders());
  });

  // Live update when a customer places a new order in another tab.
  Storage.onExternalChange(renderOrders);
});