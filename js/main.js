/* =========================================================
   MAIN.JS — Entry point. Wires up the other modules.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".page");
  if (page) {
    // trigger the fade-in defined in style.css
    requestAnimationFrame(() => page.classList.add("is-ready"));
  }

  if (window.SiteNavigation) window.SiteNavigation.init();
  if (window.SiteAnimations) window.SiteAnimations.init();
  if (window.SiteForm) window.SiteForm.init();

  setActiveNavLink();
});

/**
 * Adds an `is-active` class to the nav link matching the current page,
 * for both the desktop nav and the mobile drawer.
 */
function setActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPage = href.split("/").pop() || "index.html";
    if (linkPage === current) {
      link.classList.add("is-active");
    }
  });
}
