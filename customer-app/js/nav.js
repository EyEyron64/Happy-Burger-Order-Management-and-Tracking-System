document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('hb-burger-btn');
  const nav = document.getElementById('hb-nav');

  if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      const iconNode = burgerBtn.querySelector('[data-lucide]');
      if (iconNode) {
        iconNode.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
      }
    });
  }
});
