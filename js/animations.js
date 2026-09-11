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

    window.addEventListener(
      "scroll",
      () => {
        const offset = Math.min(window.scrollY * 0.25, 120);
        hero.style.transform = `translateY(${offset}px) scale(1.05)`;
      },
      { passive: true }
    );
  }

  function init() {
    initScrollReveal();
    initHeroParallax();
  }

  return { init };
})();
