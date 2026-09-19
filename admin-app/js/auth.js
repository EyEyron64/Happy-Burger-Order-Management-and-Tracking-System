// admin-app/js/auth.js
// Authentication is intentionally NOT enforced for this project — this is
// a UI-only login flow. Submitting the form always proceeds to the
// dashboard, regardless of what's entered, since routes are not protected
// and no credential check is required.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "dashboard.html";
  });
});