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
    initEventDropdowns();
    bindEventDropdowns();
    initScrollState();
    initMobileDrawer();
  }

  function initEventDropdowns() {
    document.querySelectorAll('.main-nav > a[href="events.html"], .mobile-nav > a[href="events.html"], .main-nav > a[href="brand-event.html"], .mobile-nav > a[href="brand-event.html"]').forEach((link) => {
      const isMobile = link.closest(".mobile-nav");
      const menu = document.createElement("div");
      menu.className = isMobile ? "mobile-event-menu" : "nav-dropdown";

      const toggle = document.createElement("button");
      toggle.className = isMobile ? "mobile-event-toggle" : "nav-dropdown-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-haspopup", "true");
      toggle.textContent = "Events";

      const links = document.createElement("div");
      links.className = isMobile ? "mobile-event-links" : "nav-dropdown-menu";
      [
        ["Corporate Event", "corporate-event"],
        ["Brand Event", "brand-event"],
        ["Other Event", "other-event"]
      ].forEach(([label, anchor]) => {
        const item = document.createElement("a");
        item.href = `${anchor}.html`;
        item.textContent = label;
        links.appendChild(item);
      });

      menu.append(toggle, links);
      link.replaceWith(menu);
    });
  }

  function bindEventDropdowns() {
    const dropdowns = document.querySelectorAll(".nav-dropdown, .mobile-event-menu");

    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector("button");
      if (!toggle) return;

      const menu = dropdown.querySelector(".nav-dropdown-menu, .mobile-event-links");
      if (menu) {
        const order = ["corporate-event.html", "brand-event.html", "other-event.html"];
        [...menu.querySelectorAll("a")]
          .sort((first, second) => order.indexOf(first.getAttribute("href")) - order.indexOf(second.getAttribute("href")))
          .forEach((item) => menu.appendChild(item));
      }

      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => {
        const isOpen = dropdown.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    });

    document.addEventListener("click", (event) => {
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) return;
        dropdown.classList.remove("is-open");
        const toggle = dropdown.querySelector("button");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        const toggle = dropdown.querySelector("button");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  return { init };
})();
