// customer-app/js/product.js
// Reads the ?id= from the URL, looks the item up in shared storage, and
// renders the product detail layout, including an optional customization
// notes field that gets attached to the cart line.

function getItemIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderProduct() {
  const id = getItemIdFromUrl();
  const item = id ? Storage.getMenuItems().find((i) => i.id === id) : null;
  const layout = document.getElementById("product-layout");

  if (!item) {
    layout.innerHTML = `<p class="text-muted">Item not found. <a href="menu.html">Back to menu</a>.</p>`;
    return;
  }

  document.title = `Happy Burger — ${item.name}`;
  document.getElementById("breadcrumb-name").textContent = item.name;

  layout.innerHTML = `
    <div class="product-image-col">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"
           onerror="this.style.display='none'" />
    </div>
    <div class="product-details-col">
      <h1>${escapeHtml(item.name.toUpperCase())}</h1>
      <div class="product-price">${formatCurrency(item.price)}</div>
      <p class="product-description">${escapeHtml(item.description)}</p>
      <hr class="product-divider" />

      <div class="field">
        <label for="item-notes">Special Instructions (optional)</label>
        <textarea id="item-notes" rows="2" placeholder="e.g. no onions, extra sauce"></textarea>
      </div>

      <div class="product-action-row">
        <div class="qty-stepper">
          <button id="qty-decrease" type="button">−</button>
          <span id="qty-value">1</span>
          <button id="qty-increase" type="button">+</button>
        </div>
        <button class="btn-add-to-cart" id="add-to-cart-btn" type="button">
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyValueEl = document.getElementById("qty-value");

  document.getElementById("qty-increase").addEventListener("click", () => {
    qty += 1;
    qtyValueEl.textContent = qty;
  });

  document.getElementById("qty-decrease").addEventListener("click", () => {
    if (qty > 1) qty -= 1;
    qtyValueEl.textContent = qty;
  });

  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const notes = document.getElementById("item-notes").value.trim();
    Cart.addItem(item, qty, notes);
    window.location.href = "cart.html";
  });
}

document.addEventListener("DOMContentLoaded", renderProduct);