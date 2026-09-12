// customer-app/js/menu.js
// Renders the full menu catalog on menu.html by reading directly from
// shared storage. Clicking a card's button opens the product detail page.

function initMenuPage() {
  seedMenuIfEmpty();
  renderMenu();
  Storage.onExternalChange(renderMenu);
}

function renderMenu() {
  const items = Storage.getMenuItems();
  const grid = document.getElementById("menu-grid");

  if (items.length === 0) {
    grid.innerHTML = `<p class="text-muted">No items on the menu yet.</p>`;
    return;
  }

  grid.innerHTML = items
    .map(
      (item) => `
    <article class="menu-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"
           onerror="this.style.display='none'" />
      <div class="menu-card-body">
        <div class="menu-card-title-row">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="menu-card-price">${formatCurrency(item.price)}</span>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <button class="btn-cart" data-view="${item.id}">🍴 Add to Cart</button>
      </div>
    </article>
  `
    )
    .join("");

  qsa("[data-view]", grid).forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = `product.html?id=${encodeURIComponent(btn.dataset.view)}`;
    });
  });
}

document.addEventListener("DOMContentLoaded", initMenuPage);