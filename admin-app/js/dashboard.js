// admin-app/js/dashboard.js
// Renders live stats and the Live Queue from real orders in shared storage.
// The search input and header icons are cosmetic — no filtering logic yet.

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}

function fulfillmentLabel(method) {
  switch (method) {
    case "DELIVERY": return "Delivery";
    case "MEETUP": return "Meet-up";
    case "PICKUP":
    default: return "Pick-up";
  }
}

function shortOrderNumber(id) {
  const digitsOnly = id.replace(/\D/g, "");
  return `#${digitsOnly.slice(-4) || id}`;
}

function updateClock() {
  const el = document.getElementById("admin-clock");
  if (el) {
    el.textContent = "🕐 " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

function renderStats() {
  const orders = Storage.getOrders();
  const counts = {
    PENDING: 0,
    PREPARING: 0,
    READY: 0,
    COMPLETED: 0,
  };
  orders.forEach((o) => {
    if (counts[o.status] !== undefined) counts[o.status] += 1;
  });

  const cards = [
    { label: "Pending", value: counts.PENDING, icon: "⏳" },
    { label: "Preparing", value: counts.PREPARING, icon: "👨‍🍳" },
    { label: "Ready", value: counts.READY, icon: "✅" },
    { label: "Completed", value: counts.COMPLETED, icon: "📦" },
  ];

  document.getElementById("stats-grid").innerHTML = cards
    .map(
      (c) => `
    <div class="stat-card">
      <div class="stat-card-label"><span>${c.label}</span><span>${c.icon}</span></div>
      <div class="stat-card-value">${c.value}</div>
    </div>
  `
    )
    .join("");
}

function renderLiveQueue() {
  const orders = Storage.getOrders()
    .filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const listEl = document.getElementById("live-queue-list");

  if (orders.length === 0) {
    listEl.innerHTML = `<div class="queue-empty">No active orders right now.</div>`;
    return;
  }

  listEl.innerHTML = orders
    .map((o) => {
      const itemsSummary = o.items.map((i) => `${i.qty}x ${i.name}`).join(", ");
      return `
      <div class="queue-row">
        <div class="queue-row-id">${shortOrderNumber(o.id)}</div>
        <div class="queue-row-main">
          <div class="queue-row-items">${escapeHtml(itemsSummary)}</div>
          <div class="queue-row-meta">${fulfillmentLabel(o.fulfillmentMethod)} · ${timeAgo(o.createdAt)}</div>
        </div>
        <span class="badge ${o.status}">${o.status}</span>
        <button class="queue-row-more" onclick="event.preventDefault();" title="More options">⋯</button>
      </div>
    `;
    })
    .join("");
}

function renderDashboard() {
  renderStats();
  renderLiveQueue();
}

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 30000);
  renderDashboard();

  // Live update when a customer places an order, or admin changes a
  // status, in another tab.
  Storage.onExternalChange(renderDashboard);
});