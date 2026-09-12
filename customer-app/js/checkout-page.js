// customer-app/js/checkout-page.js
// Renders the order summary from the cart, tracks the selected fulfillment
// and payment method, and places the order on submit.

let selectedFulfillment = FULFILLMENT_METHOD.PICKUP;
let selectedPayment = PAYMENT_METHOD.CASH;

function currentFee() {
  return selectedFulfillment === FULFILLMENT_METHOD.DELIVERY ? DELIVERY_FEE : 0;
}

function renderSummary() {
  const items = Cart.get();
  const linesEl = document.getElementById("summary-lines");

  if (items.length === 0) {
    linesEl.innerHTML = `<p class="text-muted">Your cart is empty.</p>`;
  } else {
    linesEl.innerHTML = items
      .map(
        (line) => `
      <div class="summary-line-item">
        <div>
          <div class="summary-line-name">${line.qty}x ${escapeHtml(line.name)}</div>
          ${line.notes ? `<div class="summary-line-notes">${escapeHtml(line.notes)}</div>` : ""}
        </div>
        <div class="summary-line-price">${formatCurrency(line.price * line.qty)}</div>
      </div>
    `
      )
      .join("");
  }

  const subtotal = Cart.total();
  const fee = currentFee();
  const total = subtotal + fee;

  document.getElementById("summary-subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("summary-fee").textContent = formatCurrency(fee);
  document.getElementById("summary-total").textContent = formatCurrency(total);

  const placeOrderBtn = document.getElementById("place-order-btn");
  placeOrderBtn.disabled = items.length === 0;
}

function setupFulfillmentOptions() {
  const buttons = qsa("#fulfillment-options .option-card");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedFulfillment = btn.dataset.fulfillment;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      renderSummary();
    });
  });
}

function setupPaymentOptions() {
  const buttons = qsa("#payment-options .payment-option");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedPayment = btn.dataset.payment;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
}

function handlePlaceOrder() {
  const items = Cart.get();
  if (items.length === 0) return;

  const customerName = document.getElementById("customerName").value.trim();
  const contactNumber = document.getElementById("contactNumber").value.trim();

  if (!customerName || !contactNumber) {
    alert("Please fill in your name and contact number.");
    return;
  }

  const order = createOrder({
    items,
    customerName,
    contactNumber,
    fulfillmentMethod: selectedFulfillment,
    paymentMethod: selectedPayment,
    fulfillmentFee: currentFee(),
  });

  Storage.saveOrder(order);
  Cart.clear();
  localStorage.setItem("bs_lastOrderId", order.id);

  window.location.href = `confirmation.html?orderId=${encodeURIComponent(order.id)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  setupFulfillmentOptions();
  setupPaymentOptions();
  document.getElementById("place-order-btn").addEventListener("click", handlePlaceOrder);
});