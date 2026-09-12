/* =========================================================
   NAVIGATION.JS — Header scroll state + mobile nav drawer
   ========================================================= */

window.SiteNavigation = (function () {
  function initScrollState() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const toggleScrolled = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };

    toggleScrolled();
    window.addEventListener("scroll", toggleScrolled, { passive: true });
  }

  function initMobileDrawer() {
    const toggle = document.querySelector(".nav-toggle");
    const drawer = document.querySelector(".mobile-nav");
    if (!toggle || !drawer) return;

    const setToggleState = (isOpen) => {
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      setToggleState(false);
      document.body.style.overflow = "";
    };

    const openDrawer = () => {
      drawer.classList.add("is-open");
      setToggleState(true);
      document.body.style.overflow = "hidden";
    };

    toggle.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      isOpen ? closeDrawer() : openDrawer();
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    const closeBtn = drawer.querySelector(".nav-close");
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function init() {
    initScrollState();
    initMobileDrawer();
  }

  return { init };
})();
