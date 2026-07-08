import "server-only";
import { env } from "@/lib/env";
import { formatPrice } from "@/lib/format";
import type { OrderWithItems } from "@/types/database.types";

// Calls Resend's REST API directly with fetch rather than pulling in their
// SDK — this project already had one npm package (iyzipay) whose bundling
// broke Vercel's serverless build; a plain HTTP call has no such risk.
const RESEND_ENDPOINT = "https://api.resend.com/emails";

type ShippingAddress = {
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string | null;
  address_line: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildOrderEmailHtml(
  order: OrderWithItems,
  buyerEmail: string | null,
): string {
  const shipping = order.shipping_address as unknown as ShippingAddress;

  const itemRows = order.order_items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#4a3f3a;">
            ${escapeHtml(item.product_name)}${item.variant_label ? ` (${escapeHtml(item.variant_label)})` : ""} × ${item.quantity}
          </td>
          <td style="padding:8px 0;text-align:right;color:#4a3f3a;">${formatPrice(item.line_total)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#4a3f3a;">
      <h2 style="font-size:20px;">Yeni sipariş: ${escapeHtml(order.order_number)}</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;">
        ${itemRows}
        <tr>
          <td style="padding-top:12px;font-weight:600;">Toplam</td>
          <td style="padding-top:12px;text-align:right;font-weight:600;">${formatPrice(order.total)}</td>
        </tr>
      </table>

      <h3 style="font-size:15px;margin-top:24px;">Teslimat</h3>
      <p style="font-size:14px;line-height:1.5;">
        ${escapeHtml(shipping.full_name)} · ${escapeHtml(shipping.phone)}<br/>
        ${escapeHtml(shipping.address_line)}${shipping.neighborhood ? `, ${escapeHtml(shipping.neighborhood)}` : ""} ${escapeHtml(shipping.district)}/${escapeHtml(shipping.city)}
        ${buyerEmail ? `<br/>E-posta: ${escapeHtml(buyerEmail)}` : ""}
      </p>

      ${
        order.is_gift_wrapped && order.gift_note
          ? `<p style="font-size:14px;background:#f6ded8;padding:10px 12px;border-radius:8px;">Hediye notu: ${escapeHtml(order.gift_note)}</p>`
          : ""
      }

      <p style="margin-top:24px;">
        <a href="${env.NEXT_PUBLIC_SITE_URL}/admin/siparisler/${order.id}" style="color:#ad4e44;">Siparişi admin panelde görüntüle</a>
      </p>
    </div>`;
}

// Best-effort: a failed notification email should never block or fail the
// order itself. Callers should not await-and-throw on this.
export async function sendOrderNotificationEmail(
  order: OrderWithItems,
  buyerEmail: string | null,
): Promise<void> {
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
        subject: `Yeni sipariş — ${order.order_number} (${formatPrice(order.total)})`,
        html: buildOrderEmailHtml(order, buyerEmail),
        reply_to: buyerEmail ?? undefined,
      }),
    });

    if (!res.ok) {
      console.error("Order notification email failed:", await res.text());
    }
  } catch (err) {
    console.error("Order notification email failed:", err);
  }
}
