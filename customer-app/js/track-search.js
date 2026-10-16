// customer-app/js/track-search.js
// Handles tracking lookup by 4-digit order code and redirects to tracking.html?orderId=...

function shortOrderNumber(id) {
  const digitsOnly = id.replace(/\D/g, "");
  return digitsOnly.slice(-4) || id;
}

function findOrderByCode(inputCode) {
  const code = (inputCode || "").trim();
  if (!code) return null;

  const orders = Storage.getOrders();
  if (!orders || orders.length === 0) return null;

  // 1. Direct match on 4 digits (short order number)
  const exactShortMatch = orders.find((o) => shortOrderNumber(o.id) === code);
  if (exactShortMatch) return exactShortMatch;

  // 2. Direct exact match on full order ID or clean digits ending with code
  const exactFullMatch = orders.find((o) => {
    if (o.id.toLowerCase() === code.toLowerCase()) return true;
    const digitsOnly = o.id.replace(/\D/g, "");
    return digitsOnly.endsWith(code);
  });
  if (exactFullMatch) return exactFullMatch;

  // 3. Fallback: contains query
  const partialMatch = orders.find((o) => o.id.toLowerCase().includes(code.toLowerCase()));
  return partialMatch || null;
}

function initTrackSearch() {
  const form = document.getElementById("track-search-form");
  const input = document.getElementById("order-code-input");
  const errorMsg = document.getElementById("track-error");
  const recentBox = document.getElementById("track-recent");
  const recentLink = document.getElementById("track-recent-link");

  // Show quick shortcut if user placed an order recently in this browser
  const lastOrderId = localStorage.getItem("bs_lastOrderId");
  if (lastOrderId && recentBox && recentLink) {
    const lastOrder = Storage.getOrderById(lastOrderId);
    if (lastOrder) {
      recentBox.style.display = "block";
      recentLink.href = `tracking.html?orderId=${encodeURIComponent(lastOrder.id)}`;
      recentLink.textContent = `#${shortOrderNumber(lastOrder.id)}`;
    }
  }

  // Clear error on input
  input.addEventListener("input", () => {
    errorMsg.style.display = "none";
    errorMsg.textContent = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawVal = input.value.trim();

    if (!rawVal) {
      errorMsg.textContent = "Please enter your 4-digit order code.";
      errorMsg.style.display = "block";
      input.focus();
      return;
    }

    const matchedOrder = findOrderByCode(rawVal);
    if (!matchedOrder) {
      errorMsg.textContent = `No order found with code #${rawVal}. Please check and try again.`;
      errorMsg.style.display = "block";
      return;
    }

    // Redirect to tracking.html with matching orderId
    window.location.href = `tracking.html?orderId=${encodeURIComponent(matchedOrder.id)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTrackSearch();
  if (window.lucide) {
    lucide.createIcons();
  }
});
