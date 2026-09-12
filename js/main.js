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
  initPortraitLightbox();
});

function initPortraitLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const img = lightbox ? lightbox.querySelector("img") : null;
  const closeBtn = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (!lightbox || !img || !closeBtn) return;

  const cards = document.querySelectorAll(".portrait-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const full = card.dataset.full || card.querySelector("img")?.src || "";
      if (!full) return;

      img.src = full;
      img.alt = card.querySelector("img")?.alt || "Expanded portrait";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });
}

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
