/* =========================================================
   ANIMATIONS.JS — Scroll reveals + small motion touches
   ========================================================= */

window.SiteAnimations = (function () {
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function initHeroParallax() {
    const hero = document.querySelector(".hero-media img");
    if (!hero) return;

    // The stylesheets already honour prefers-reduced-motion; the parallax was
    // the one piece of motion that ignored it. Keep them consistent.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    let visible = true;
    let lastOffset = 0;

    const update = () => {
      ticking = false;
      if (!visible) return;

      const offset = Math.min(window.scrollY * 0.25, 120);
      if (offset === lastOffset) return;

      lastOffset = offset;
      hero.style.transform = `translateY(${offset}px)`;
    };

    // Before: window.scrollY (layout read) + style.transform (style write) ran
    // synchronously inside the scroll listener, on every scroll event, on the
    // hero <img> itself -- i.e. the LCP element. Scroll events can fire many
    // times per frame, so this forced repeated style recalculation and layer
    // invalidation while the page was still painting. Now the handler only
    // schedules work and at most one style write happens per animation frame.
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    // The effect is only visible while the hero is on screen, so stop doing
    // any work at all once it has scrolled past.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible && !ticking) {
              ticking = true;
              window.requestAnimationFrame(update);
            }
          });
        },
        { threshold: 0 }
      ).observe(hero);
    }
  }

  function init() {
    initScrollReveal();
    initHeroParallax();
  }

  return { init };
})();
