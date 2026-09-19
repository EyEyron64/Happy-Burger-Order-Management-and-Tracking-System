// admin-app/js/order-detail.js
// Reads ?id= from the URL and renders full order detail: items, status
// management (all statuses shown, current one highlighted), and customer
// contact info. Mark [next status] and Cancel both write through Storage.

const STATUS_STEPS = [
  { key: "PENDING", label: "Pending", icon: "🕐" },
  { key: "PREPARING", label: "Preparing", icon: "👨‍🍳" },
  { key: "READY", label: "Ready", icon: "✅" },
  { key: "COMPLETED", label: "Completed", icon: "📦" },
];

function shortOrderNumber(id) {
  const digitsOnly = id.replace(/\D/g, "");
  return digitsOnly.slice(-4) || id;
}

function fulfillmentLabel(method) {
  switch (method) {
    case "DELIVERY": return "Delivery";
    case "MEETUP": return "Meet-up";
    case "PICKUP":
    default: return "Pick-up";
  }
}

function findMenuItem(menuItemId) {
  return Storage.getMenuItems().find((i) => i.id === menuItemId) || null;
}

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nextStatus(status) {
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

function renderStatusList(order) {
  if (order.status === "CANCELLED") {
    return `<p class="status-cancelled-note">This order was cancelled.</p>`;
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return STATUS_STEPS.map((step, i) => {
    const done = i < currentIndex;
    const current = i === currentIndex;
    let meta = "";
    if (current) meta = `Started ${formatDate(order.updatedAt)}`;
    else if (done) meta = "Completed";

    return `
      <div class="status-list-item ${done ? "done" : ""} ${current ? "current" : ""}">
        <div class="status-dot">${done ? "✓" : step.icon}</div>
        <div>
          <div class="status-text-title">${step.label}</div>
          ${meta ? `<div class="status-text-meta">${meta}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function renderOrderDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  const order = id ? Storage.getOrderById(id) : null;
  const content = document.getElementById("order-detail-content");

  if (!order) {
    content.innerHTML = `<p class="text-muted">Order not found. <a href="orders.html">Back to Orders</a>.</p>`;
    return;
  }

  const itemsHtml = order.items
    .map((line) => {
      const menuItem = findMenuItem(line.menuItemId);
      const image = menuItem ? menuItem.image : "";
      return `
      <div class="order-item-row">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(line.name)}" onerror="this.style.display='none'" />
        <div class="order-item-main">
          <div>
            <div class="order-item-name">${escapeHtml(line.name)}</div>
            ${line.notes ? `<div class="order-item-notes">${escapeHtml(line.notes)}</div>` : ""}
            <span class="order-item-qty-tag">Qty: ${line.qty}</span>
          </div>
          <div class="order-item-price">${formatCurrency(line.price * line.qty)}</div>
        </div>
      </div>
    `;
    })
    .join("");

  const next = nextStatus(order.status);
  const canCancel = order.status !== "COMPLETED" && order.status !== "CANCELLED";

  content.innerHTML = `
    <div class="order-detail-header-row">
      <div>
        <div class="order-detail-title-group">
          <h1>Order #${shortOrderNumber(order.id)}</h1>
          <span class="fulfillment-tag">${fulfillmentLabel(order.fulfillmentMethod)}</span>
        </div>
        <div class="order-detail-subtext">Placed on ${formatDate(order.createdAt)}</div>
      </div>
      <div class="order-detail-actions">
        <button class="btn-print" onclick="window.print()">🖨 Print Ticket</button>
        <button class="btn-cancel-order" id="cancel-order-btn" ${canCancel ? "" : "disabled"}>⊘ Cancel</button>
      </div>
    </div>

    <div class="order-detail-layout">
      <div class="order-detail-left-col">
        <div class="detail-card">
          <div class="detail-card-title">Order Items (${order.items.reduce((sum, i) => sum + i.qty, 0)})</div>
          ${itemsHtml}
          <div class="order-totals">
            <div class="order-totals-row"><span>Subtotal</span><span>${formatCurrency(order.subtotal)}</span></div>
            <div class="order-totals-row"><span>Fulfillment Fee</span><span>${formatCurrency(order.fulfillmentFee)}</span></div>
            <div class="order-totals-row order-totals-final"><span>Total</span><span>${formatCurrency(order.total)}</span></div>
          </div>
        </div>
      </div>

      <div class="order-detail-right-col">
        <div class="detail-card">
          <div class="detail-card-title">Status Management</div>
          <div class="status-list">${renderStatusList(order)}</div>
          ${
            next && order.status !== "CANCELLED"
              ? `<button class="btn-mark-next" id="mark-next-btn">Mark ${next.charAt(0) + next.slice(1).toLowerCase()}</button>`
              : `<button class="btn-mark-next" disabled>No further status</button>`
          }
        </div>

        <div class="detail-card">
          <div class="detail-card-title">Customer Details</div>
          <div class="customer-row">
            <div class="customer-avatar">${initials(order.customerName)}</div>
            <div>
              <div class="customer-name">${escapeHtml(order.customerName || "Guest")}</div>
              <div class="customer-contact">${escapeHtml(order.contactNumber || "No contact number provided")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const markNextBtn = document.getElementById("mark-next-btn");
  if (markNextBtn) {
    markNextBtn.addEventListener("click", () => {
      if (next) {
        Storage.updateOrderStatus(order.id, next);
        renderOrderDetail();
      }
    });
  }

  const cancelBtn = document.getElementById("cancel-order-btn");
  if (cancelBtn && canCancel) {
    cancelBtn.addEventListener("click", () => {
      if (confirm("Cancel this order?")) {
        Storage.updateOrderStatus(order.id, "CANCELLED");
        renderOrderDetail();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderDetail();
  Storage.onExternalChange(renderOrderDetail);
});