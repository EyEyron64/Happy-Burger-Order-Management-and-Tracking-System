// admin-app/js/sidebar.js
// Handles collapsible and responsive sidebar for admin application pages.

function initAdminSidebar() {
  const sidebar = document.querySelector(".admin-sidebar");
  const toggleBtn = document.getElementById("admin-sidebar-toggle");
  const overlay = document.getElementById("admin-sidebar-overlay");

  if (!sidebar) return;

  const MOBILE_BREAKPOINT = 800;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // Update ARIA attributes and button state
  function updateState(collapsed) {
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", (!collapsed).toString());
      toggleBtn.setAttribute("title", collapsed ? "Expand Sidebar" : "Collapse Sidebar");
    }
  }

  // Set collapse state
  function setSidebarCollapsed(collapsed) {
    if (isMobile()) {
      // On mobile/tablet, collapsed means off-canvas hidden
      if (collapsed) {
        sidebar.classList.remove("is-mobile-open");
        if (overlay) overlay.classList.remove("is-visible");
      } else {
        sidebar.classList.add("is-mobile-open");
        if (overlay) overlay.classList.add("is-visible");
      }
    } else {
      // On desktop, collapsed means icon-only compact sidebar
      if (collapsed) {
        sidebar.classList.add("is-collapsed");
        localStorage.setItem("hb_admin_sidebar_collapsed", "true");
      } else {
        sidebar.classList.remove("is-collapsed");
        localStorage.setItem("hb_admin_sidebar_collapsed", "false");
      }
    }
    updateState(isCollapsed());
  }

  function isCollapsed() {
    if (isMobile()) {
      return !sidebar.classList.contains("is-mobile-open");
    }
    return sidebar.classList.contains("is-collapsed");
  }

  function toggleSidebar() {
    setSidebarCollapsed(!isCollapsed());
  }

  // Restore desktop preference on load
  if (!isMobile()) {
    const saved = localStorage.getItem("hb_admin_sidebar_collapsed");
    if (saved === "true") {
      sidebar.classList.add("is-collapsed");
    }
  } else {
    // If small screen on initial load, ensure it's collapsed
    sidebar.classList.remove("is-mobile-open");
    if (overlay) overlay.classList.remove("is-visible");
  }
  updateState(isCollapsed());

  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      setSidebarCollapsed(true);
    });
  }

  // Handle window resizing: automatically collapse when switching to small screens
  let prevWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (prevWidth > MOBILE_BREAKPOINT && currentWidth <= MOBILE_BREAKPOINT) {
      // Screen became small -> collapse mobile drawer
      sidebar.classList.remove("is-mobile-open");
      if (overlay) overlay.classList.remove("is-visible");
      updateState(true);
    } else if (prevWidth <= MOBILE_BREAKPOINT && currentWidth > MOBILE_BREAKPOINT) {
      // Screen became large -> remove mobile classes, restore desktop preference
      if (overlay) overlay.classList.remove("is-visible");
      sidebar.classList.remove("is-mobile-open");
      const saved = localStorage.getItem("hb_admin_sidebar_collapsed");
      if (saved === "true") {
        sidebar.classList.add("is-collapsed");
      } else {
        sidebar.classList.remove("is-collapsed");
      }
      updateState(isCollapsed());
    }
    prevWidth = currentWidth;
  });

  // Close sidebar on mobile when a nav item is clicked
  const navLinks = sidebar.querySelectorAll(".admin-sidebar-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobile()) {
        setSidebarCollapsed(true);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminSidebar();
});
