import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico/client";
import { sendOrderNotificationEmail } from "@/lib/email/order-notification";
import { env } from "@/lib/env";
import type { OrderWithItems } from "@/types/database.types";

// iyzico POSTs to this endpoint, so redirects must use 303 (See Other) — the
// default 307 preserves the POST method, making the browser re-POST to the
// destination page and hit a 405 (pages only accept GET).
function redirect(path: string) {
  return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}${path}`, 303);
}

// iyzico POSTs application/x-www-form-urlencoded { token } to this endpoint
// after the buyer finishes on the hosted payment page. We must call back into
// iyzico's retrieve API to get the authoritative result — never trust the
// callback payload alone.
export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString();

  if (!token) {
    return redirect("/odeme/basarisiz");
  }

  const admin = createAdminClient();

  // Look the order up by the token we stored on it at checkout-initiation
  // time. iyzico's retrieve API does NOT return the original conversationId
  // when queried without one — it just echoes back whatever conversationId
  // was sent in that specific request — so the token (which iyzico's
  // callback actually delivers to us) is the only reliable link back to
  // the order.
  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, status")
    .eq("iyzico_token", token)
    .maybeSingle();

  if (!order) {
    return redirect("/odeme/basarisiz");
  }

  if (order.status === "paid") {
    // Already finalized (e.g. duplicate callback) — just send them to confirmation.
    return redirect(`/odeme/basarili?order=${order.order_number}`);
  }

  try {
    const result = await retrieveCheckoutForm(token, order.id);

    if (result.status === "success" && result.paymentStatus === "SUCCESS") {
      await admin
        .from("orders")
        .update({
          status: "paid",
          iyzico_payment_id: result.paymentId ?? null,
          payment_raw_response: result.raw,
        })
        .eq("id", order.id);

      // Decrement stock now that payment is confirmed — pending/abandoned
      // orders never hold stock hostage.
      const { data: items } = await admin
        .from("order_items")
        .select("product_id, variant_id, quantity")
        .eq("order_id", order.id);

      for (const item of items ?? []) {
        if (item.variant_id) {
          await admin.rpc("decrement_variant_stock", {
            variant_id: item.variant_id,
            qty: item.quantity,
          });
        } else if (item.product_id) {
          await admin.rpc("decrement_product_stock", {
            product_id: item.product_id,
            qty: item.quantity,
          });
        }
      }

      // Fire the order-notification email after the redirect response is
      // sent (via `after`), so a slow or failing email provider never delays
      // the buyer's checkout flow. sendOrderNotificationEmail never throws.
      after(async () => {
        const { data: fullOrder } = await admin
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", order.id)
          .maybeSingle();
        if (!fullOrder) return;

        let buyerEmail = fullOrder.guest_email;
        if (!buyerEmail && fullOrder.customer_id) {
          const { data: authUser } = await admin.auth.admin.getUserById(
            fullOrder.customer_id,
          );
          buyerEmail = authUser.user?.email ?? null;
        }

        await sendOrderNotificationEmail(
          fullOrder as unknown as OrderWithItems,
          buyerEmail,
        );
      });

      return redirect(`/odeme/basarili?order=${order.order_number}`);
    }

    await admin
      .from("orders")
      .update({ status: "failed", payment_raw_response: result.raw })
      .eq("id", order.id);

    return redirect(`/odeme/basarisiz?order=${order.order_number}`);
  } catch {
    return redirect("/odeme/basarisiz");
  }
}
