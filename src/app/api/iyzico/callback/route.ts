import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico/client";
import { env } from "@/lib/env";

// iyzico POSTs application/x-www-form-urlencoded { token } to this endpoint
// after the buyer finishes on the hosted payment page. We must call back into
// iyzico's retrieve API to get the authoritative result — never trust the
// callback payload alone.
export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString();

  if (!token) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz`);
  }

  const admin = createAdminClient();

  try {
    // conversationId isn't known yet at this point, so we look the order up by
    // token after a first retrieve call using an empty conversationId check —
    // iyzico's retrieve only strictly requires the token to resolve the result.
    const result = await retrieveCheckoutForm(token, "");
    const conversationId = (result.raw as { conversationId?: string })
      ?.conversationId;

    if (!conversationId) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz`,
      );
    }

    const { data: order } = await admin
      .from("orders")
      .select("id, order_number, status")
      .eq("id", conversationId)
      .single();

    if (!order) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz`,
      );
    }

    if (order.status === "paid") {
      // Already finalized (e.g. duplicate callback) — just send them to confirmation.
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_SITE_URL}/odeme/basarili?order=${order.order_number}`,
      );
    }

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

      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_SITE_URL}/odeme/basarili?order=${order.order_number}`,
      );
    }

    await admin
      .from("orders")
      .update({ status: "failed", payment_raw_response: result.raw })
      .eq("id", order.id);

    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?order=${order.order_number}`,
    );
  } catch {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz`);
  }
}
