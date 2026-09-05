function initMenuPage() {
  seedMenuIfEmpty();
  renderMenu();
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
        <button class="btn-cart" data-add="${item.id}">🍴 Add to Cart</button>
      </div>
    </article>
  `
    )
    .join("");

  qsa("[data-add]", grid).forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = Storage.getMenuItems().find((i) => i.id === btn.dataset.add);
      if (!item) return;
      Cart.addItem(item, 1);
      const original = btn.innerHTML;
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.innerHTML = original), 800);
    });
  });
}

document.addEventListener("DOMContentLoaded", initMenuPage);