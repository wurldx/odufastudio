/* =========================================================
   MAIN.JS — Entry point. Wires up the other modules.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (window.SiteNavigation) window.SiteNavigation.init();
  if (window.SiteAnimations) window.SiteAnimations.init();
  if (window.SiteForm) window.SiteForm.init();

  addGalleryPageHeading();
  initImageSkeletons();
  setActiveNavLink();
  initPortraitLightbox();
});

function initImageSkeletons() {
  document.querySelectorAll(".portrait-card").forEach((card) => {
    const image = card.querySelector("img");
    if (!image) return;

    const finishLoading = () => card.classList.remove("is-loading");
    card.classList.add("is-loading");
    image.addEventListener("load", finishLoading, { once: true });
    image.addEventListener("error", finishLoading, { once: true });

    if (image.complete) finishLoading();
  });
}

function addGalleryPageHeading() {
  const gallery = document.querySelector(".portrait-gallery-wrap");
  if (!gallery || gallery.querySelector(".gallery-page-heading")) return;

  const labels = {
    "Portrait gallery": "Portrait Gallery",
    "Brand events gallery": "Brand Event Gallery",
    "Corporate events gallery": "Corporate Event Gallery",
    "Other events gallery": "Other Event Gallery",
    "Fashion gallery": "Fashion Gallery",
    "Studio gallery": "Studio Gallery"
  };
  const title = labels[gallery.getAttribute("aria-label")];
  if (!title) return;

  const headingWrap = document.createElement("div");
  headingWrap.className = "gallery-page-heading";
  headingWrap.innerHTML = `<h1>${title}</h1>`;
  gallery.prepend(headingWrap);
}

function initPortraitLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const img = lightbox ? lightbox.querySelector("img") : null;
  const closeBtn = lightbox
    ? lightbox.querySelector(".lightbox-close")
    : null;

  if (!lightbox || !img || !closeBtn) return;

  const cards = document.querySelectorAll(".portrait-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const small = card.dataset.lightboxSmall || "";
      const medium = card.dataset.lightboxMedium || "";
      const large = card.dataset.lightboxLarge || "";

      let full = large;

      if (window.innerWidth <= 767) {
        full = small;
      } else if (window.innerWidth <= 1199) {
        full = medium;
      }

      if (!full) {
        console.warn(
          "No optimized lightbox image found for this gallery item."
        );
        return;
      }

      img.removeAttribute("src");

      img.src = full;

      img.alt =
        card.querySelector("img")?.alt ||
        "Expanded portrait";

      lightbox.classList.add("is-open");
      lightbox.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener(
    "click",
    closeLightbox
  );

  lightbox.addEventListener(
    "click",
    (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        lightbox.classList.contains("is-open")
      ) {
        closeLightbox();
      }
    }
  );

  function closeLightbox() {
    lightbox.classList.remove("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

    img.removeAttribute("src");
  }
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
