/* =========================================================
   FORM.JS — Contact form validation + submit handling
   NOTE: This is a plain contact form only. No booking/
   scheduling logic lives here by design.
   ========================================================= */

window.SiteForm = (function () {
  function showStatus(statusEl, message, state) {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  }

  function validate(form) {
    const requiredFields = form.querySelectorAll("[required]");
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        field.focus();
        return `Please fill in "${field.name || field.id}".`;
      }
    }

    const email = form.querySelector('input[type="email"]');
    if (email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!isValid) {
        email.focus();
        return "Please enter a valid email address.";
      }
    }

    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector(".form-submit");

    const error = validate(form);
    if (error) {
      showStatus(statusEl, error, "error");
      return;
    }

    // Placeholder submit — wire this up to your email service /
    // form backend of choice (Formspree, Netlify Forms, a custom
    // API route, etc). This file intentionally has no booking
    // or scheduling logic.
    submitBtn.setAttribute("disabled", "true");
    showStatus(statusEl, "Sending...", "pending");

    setTimeout(() => {
      showStatus(statusEl, "Thanks — your message has been sent. I'll be in touch soon.", "success");
      form.reset();
      submitBtn.removeAttribute("disabled");
    }, 900);
  }

  function init() {
    const form = document.querySelector(".contact-form");
    if (!form) return;
    form.addEventListener("submit", handleSubmit);
  }

  return { init };
})();
