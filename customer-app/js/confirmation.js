function renderConfirmation() {
  const orderId = new URLSearchParams(window.location.search).get("orderId");
  const order = orderId ? Storage.getOrderById(orderId) : null;
  const card = document.getElementById("confirmation-card");

  if (!order) {
    card.innerHTML = `
      <p class="text-muted">We couldn't find that order.</p>
      <a href="index.html" class="hb-btn">Back to Home</a>
    `;
    return;
  }

  const itemsHtml = order.items
    .map(
      (line) => `
    <div class="confirmation-item-row">
      <span>${line.qty}x ${escapeHtml(line.name)}</span>
      <span>${formatCurrency(line.price * line.qty)}</span>
    </div>
  `
    )
    .join("");

  card.innerHTML = `
    <div class="confirmation-icon">✓</div>
    <h2>Order Confirmed!</h2>
    <p class="confirmation-subtext">
      Your order <strong>#${escapeHtml(order.id)}</strong> is being prepared
      by the Kitchen Crew.
    </p>

    <div class="confirmation-items">
      <div class="confirmation-items-title">Items</div>
      ${itemsHtml}
    </div>

    <div class="confirmation-total">
      <div class="confirmation-total-label">Total Paid</div>
      <div class="confirmation-total-value">${formatCurrency(order.total)}</div>
    </div>

    <div class="confirmation-actions">
      <a href="tracking.html?orderId=${encodeURIComponent(order.id)}" class="hb-btn">🏃 Track Order</a>
      <a href="index.html" class="hb-btn outline">Back to Home</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", renderConfirmation);