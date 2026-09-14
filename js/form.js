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

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim()) {
      return "Your submission was flagged as invalid.";
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector(".form-submit");

    const error = validate(form);
    if (error) {
      showStatus(statusEl, error, "error");
      return;
    }

    submitBtn.setAttribute("disabled", "true");
    showStatus(statusEl, "Sending...", "pending");

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      delete payload.website;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent right now.");
      }

      showStatus(statusEl, result.message || "Thanks — your message has been sent. I'll be in touch soon.", "success");
      form.reset();
    } catch (submitError) {
      showStatus(statusEl, submitError.message || "Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.removeAttribute("disabled");
    }
  }

  function init() {
    const form = document.querySelector(".contact-form");
    if (!form) return;
    form.addEventListener("submit", handleSubmit);
  }

  return { init };
})();
