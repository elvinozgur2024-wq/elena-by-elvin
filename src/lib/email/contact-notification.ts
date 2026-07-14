import "server-only";
import { env } from "@/lib/env";

// Same direct REST call as order-notification.ts — no SDK, no bundling risk.
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildContactEmailHtml(msg: {
  name: string;
  email: string;
  message: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#4a3f3a;">
      <h2 style="font-size:20px;">Yeni iletişim mesajı</h2>
      <p style="font-size:14px;line-height:1.5;">
        <strong>${escapeHtml(msg.name)}</strong><br/>
        ${escapeHtml(msg.email)}
      </p>
      <p style="font-size:14px;line-height:1.6;background:#f5efe8;padding:12px 14px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(msg.message)}</p>
      <p style="font-size:13px;color:#7a6d64;margin-top:16px;">
        Bu e-postayı yanıtladığınızda doğrudan müşteriye yazarsınız.
      </p>
    </div>`;
}

// Best-effort: the message is already safely stored in contact_messages —
// a failed notification email must never fail the form submission.
export async function sendContactNotificationEmail(msg: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.ORDER_NOTIFICATION_EMAIL) {
    return;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: env.ORDER_NOTIFICATION_EMAIL,
        subject: `Yeni iletişim mesajı — ${msg.name}`,
        html: buildContactEmailHtml(msg),
        reply_to: msg.email,
      }),
    });

    if (!res.ok) {
      console.error("Contact notification email failed:", await res.text());
    }
  } catch (err) {
    console.error("Contact notification email failed:", err);
  }
}
