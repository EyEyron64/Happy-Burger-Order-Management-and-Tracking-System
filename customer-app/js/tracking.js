// customer-app/js/tracking.js
// Reads ?orderId= (falling back to the last order placed in this browser)
// and renders live order status. Listens for the cross-tab "storage" event
// so admin status updates in another tab reflect here without a refresh.

const STATUS_STEPS = [
  { key: "PENDING", label: "Pending", icon: "✓" },
  { key: "PREPARING", label: "Preparing", icon: "👨‍🍳" },
  { key: "READY", label: "Ready", icon: "🛍" },
  { key: "COMPLETED", label: "Completed", icon: "🏁" },
];

function shortOrderNumber(id) {
  const digitsOnly = id.replace(/\D/g, "");
  return digitsOnly.slice(-4) || id;
}

function findMenuItem(menuItemId) {
  return Storage.getMenuItems().find((i) => i.id === menuItemId) || null;
}

function fulfillmentInfo(order) {
  switch (order.fulfillmentMethod) {
    case "DELIVERY":
      return { icon: "🛵", title: "Out for Delivery", desc: "Your order will be delivered to you shortly." };
    case "MEETUP":
      return { icon: "🤝", title: "Meet-up", desc: "Please head to the agreed meet-up location once your order is ready." };
    case "PICKUP":
    default:
      return { icon: "🏬", title: "Pick-up at Store", desc: "Collect your order at the store counter once it's ready." };
  }
}

function renderStepper(order) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  if (isCancelled) {
    return `<p style="color:#c92a2a; font-weight:600; margin:0;">This order was cancelled.</p>`;
  }

  const progressPct = currentIndex <= 0 ? 0 : (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  const stepsHtml = STATUS_STEPS.map((step, i) => {
    const done = i <= currentIndex;
    let time = "";
    if (i === 0) time = formatDate(order.createdAt);
    else if (i === currentIndex) time = formatDate(order.updatedAt);

    return `
      <div class="status-step ${done ? "done" : ""}">
        <div class="status-step-circle">${done ? "✓" : step.icon}</div>
        <div class="status-step-label">${step.label}</div>
        <div class="status-step-time">${time}</div>
      </div>
    `;
  }).join("");

  return `
    <div class="status-stepper">
      <div class="step-progress-line" style="width: calc(${progressPct}% * ((100% - 60px) / 100%));"></div>
      ${stepsHtml}
    </div>
  `;
}

function renderTracking() {
  const orderId =
    new URLSearchParams(window.location.search).get("orderId") ||
    localStorage.getItem("bs_lastOrderId");

  const order = orderId ? Storage.getOrderById(orderId) : null;
  const page = document.getElementById("tracking-page");

  if (!order) {
    page.innerHTML = `<p class="text-muted">No order found. <a href="menu.html">Browse the menu</a> to place one.</p>`;
    return;
  }

  const itemsHtml = order.items
    .map((line) => {
      const menuItem = findMenuItem(line.menuItemId);
      const image = menuItem ? menuItem.image : "";
      return `
      <div class="tracking-item-row">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(line.name)}" onerror="this.style.display='none'" />
        <div class="tracking-item-main">
          <div>
            <div class="tracking-item-name">${escapeHtml(line.name)}</div>
            ${line.notes ? `<div class="tracking-item-notes">${escapeHtml(line.notes)}</div>` : ""}
          </div>
          <div>
            <div class="tracking-item-qty">${line.qty}x</div>
            <div class="tracking-item-price">${formatCurrency(line.price * line.qty)}</div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  const info = fulfillmentInfo(order);

  const rightColHtml =
    order.fulfillmentMethod === "DELIVERY"
      ? `
      <div class="tracking-card tracking-map-card">
        <img src="../assets/images/delivery-map.jpg" alt="Delivery route map" onerror="this.style.display='none'" />
      </div>
      <div class="tracking-card fulfillment-info-card">
        <span class="fulfillment-info-icon">${info.icon}</span>
        <div>
          <div class="fulfillment-info-title">${info.title}</div>
          <div class="fulfillment-info-desc">${info.desc}</div>
        </div>
      </div>
    `
      : `
      <div class="tracking-card fulfillment-info-card">
        <span class="fulfillment-info-icon">${info.icon}</span>
        <div>
          <div class="fulfillment-info-title">${info.title}</div>
          <div class="fulfillment-info-desc">${info.desc}</div>
        </div>
      </div>
    `;

  page.innerHTML = `
    <div class="tracking-header-row">
      <div>
        <h1>Order #${shortOrderNumber(order.id)}</h1>
        <div class="tracking-subtext">Placed ${formatDate(order.createdAt)}</div>
      </div>
      <span class="badge ${order.status}">${order.status}</span>
    </div>

    <div class="tracking-layout">
      <div class="tracking-left-col">
        <div class="tracking-card">
          ${renderStepper(order)}
        </div>

        <div class="tracking-card">
          <h3>Order Summary</h3>
          ${itemsHtml}
          <div class="tracking-summary-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>
          <div class="tracking-summary-row">
            <span>Fulfillment Fee</span>
            <span>${formatCurrency(order.fulfillmentFee)}</span>
          </div>
          <div class="tracking-summary-row tracking-summary-total">
            <span>Total</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div class="tracking-right-col">
        ${rightColHtml}
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTracking();
  Storage.onExternalChange(renderTracking);
});