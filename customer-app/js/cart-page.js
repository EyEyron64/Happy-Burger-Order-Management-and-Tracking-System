function findMenuItem(menuItemId) {
  return Storage.getMenuItems().find((i) => i.id === menuItemId) || null;
}

function renderCartPage() {
  const items = Cart.get();
  const itemsCol = document.getElementById("cart-items-col");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (items.length === 0) {
    itemsCol.innerHTML = `<div class="cart-empty-state">Your cart is empty. <a href="menu.html">Browse the menu</a>.</div>`;
    checkoutBtn.style.pointerEvents = "none";
    checkoutBtn.style.opacity = "0.5";
  } else {
    checkoutBtn.style.pointerEvents = "auto";
    checkoutBtn.style.opacity = "1";

    itemsCol.innerHTML = items
      .map((line) => {
        const menuItem = findMenuItem(line.menuItemId);
        const image = menuItem ? menuItem.image : "";

        return `
        <div class="cart-item-card">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(line.name)}"
               onerror="this.style.display='none'" />
          <div class="cart-item-main">
            <div class="cart-item-top-row">
              <div>
                <div class="cart-item-name">${escapeHtml(line.name)}</div>
                ${line.notes ? `<div class="cart-item-notes">${escapeHtml(line.notes)}</div>` : ""}
              </div>
              <div class="cart-item-price">${formatCurrency(line.price)}</div>
            </div>
            <div class="cart-item-bottom-row">
              <div class="qty-stepper">
                <button data-decrease type="button">−</button>
                <span>${line.qty}</span>
                <button data-increase type="button">+</button>
              </div>
              <button class="remove-link" data-remove type="button"><i data-lucide="trash-2"></i> Remove</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    if (window.lucide) {
      lucide.createIcons();
    }

    // Attach handlers per card, keyed by index so we don't need notes in a data-attribute.
    const cards = qsa(".cart-item-card", itemsCol);
    cards.forEach((card, idx) => {
      const line = items[idx];
      card.querySelector("[data-increase]").addEventListener("click", () => {
        Cart.updateQty(line.menuItemId, line.notes, line.qty + 1);
        renderCartPage();
      });
      card.querySelector("[data-decrease]").addEventListener("click", () => {
        Cart.updateQty(line.menuItemId, line.notes, line.qty - 1);
        renderCartPage();
      });
      card.querySelector("[data-remove]").addEventListener("click", () => {
        Cart.removeItem(line.menuItemId, line.notes);
        renderCartPage();
      });
    });
  }

  const subtotal = Cart.total();
  document.getElementById("summary-subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("summary-total").textContent = formatCurrency(subtotal);
}

document.addEventListener("DOMContentLoaded", renderCartPage);