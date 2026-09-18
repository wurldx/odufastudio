export async function onRequestPost({ request, env }) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse({ message: "Invalid request format." }, 415);
    }

    const body = await request.json();

    const requiredFields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "message", label: "Message" }
    ];

    const errors = [];

    for (const field of requiredFields) {
      const value = typeof body?.[field.key] === "string" ? body[field.key].trim() : "";
      if (!value) {
        errors.push(`${field.label} is required.`);
      }
    }

    const emailValue = typeof body?.email === "string" ? body.email.trim() : "";
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.push("Please enter a valid email address.");
    }

    if (body?.website && String(body.website).trim()) {
      return jsonResponse({ message: "Submission rejected." }, 400);
    }

    const name = typeof body?.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const service = typeof body?.["project-type"] === "string" ? body["project-type"].trim() : "";
    const preferredDate = typeof body?.date === "string" ? body.date.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim().replace(/\s+/g, " ") : "";

    if (errors.length > 0) {
      return jsonResponse({ message: errors[0] }, 400);
    }

    if (!env.EMAIL_API_KEY || !env.CONTACT_EMAIL) {
      return jsonResponse({ message: "Email configuration is not available right now." }, 500);
    }

    const serviceLabel = service
      ? service.charAt(0).toUpperCase() + service.slice(1)
      : "Not specified";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.EMAIL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.EMAIL_DOMAIN
          ? `Odufa Studio <noreply@${env.EMAIL_DOMAIN}>`
          : "Odufa Studio <onboarding@resend.dev>",
        to: [env.CONTACT_EMAIL],
        reply_to: emailValue,
        subject: `New Odufa Studio Enquiry — ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
            <h2 style="margin-bottom: 16px;">NEW CLIENT ENQUIRY</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(emailValue)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
            <p><strong>Service:</strong> ${escapeHtml(serviceLabel)}</p>
            <p><strong>Preferred date:</strong> ${escapeHtml(preferredDate || "Not provided")}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #f6f6f6; padding: 16px; border-radius: 8px;">${escapeHtml(message)}</div>
          </div>
        `,
        text: [
          "NEW CLIENT ENQUIRY",
          `Name: ${name}`,
          `Email: ${emailValue}`,
          `Phone: ${phone || "Not provided"}`,
          `Service: ${serviceLabel}`,
          `Preferred date: ${preferredDate || "Not provided"}`,
          "",
          "Message:",
          message
        ].join("\n")
      })
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Resend error:", errorBody);
      return jsonResponse({ message: "Your message could not be sent right now. Please try again later." }, 500);
    }

    return jsonResponse({
      message: "Thanks — your message has been sent. I'll be in touch soon."
    }, 200);
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonResponse({ message: "Something went wrong while sending your message. Please try again." }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
