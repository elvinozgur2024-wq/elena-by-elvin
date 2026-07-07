import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initializeCheckoutForm } from "@/lib/iyzico/client";
import { shippingAddressSchema } from "@/lib/validations/checkout";
import { env } from "@/lib/env";
import { generateOrderNumber } from "@/lib/format";
import {
  calculateGiftWrapFee,
  calculateShippingFee,
} from "@/lib/checkout/pricing";

const requestSchema = z.object({
  email: z.string().email(),
  shipping: shippingAddressSchema,
  is_gift_wrapped: z.boolean(),
  gift_note: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().nullable(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Sepetiniz boş"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Geçersiz istek" },
      { status: 400 },
    );
  }

  const { email, shipping, is_gift_wrapped, gift_note, items } = parsed.data;

  const admin = createAdminClient();
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Re-validate every line against the live database — never trust client-supplied prices.
  const orderItems: {
    product_id: string;
    variant_id: string | null;
    product_name: string;
    variant_label: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
    product_image_path: string | null;
  }[] = [];

  for (const item of items) {
    const { data: product, error: productError } = await admin
      .from("products")
      .select(
        "id, name, base_price, stock_quantity, is_active, product_images(storage_path, is_primary, sort_order), product_variants(id, label, price_delta, stock_quantity)",
      )
      .eq("id", item.productId)
      .single();

    if (productError || !product || !product.is_active) {
      return NextResponse.json(
        { error: `Ürün artık mevcut değil: ${item.productId}` },
        { status: 409 },
      );
    }

    let unitPrice = Number(product.base_price);
    let variantLabel: string | null = null;
    let availableStock = product.stock_quantity;

    if (item.variantId) {
      const variant = product.product_variants.find(
        (v: { id: string }) => v.id === item.variantId,
      );
      if (!variant) {
        return NextResponse.json(
          { error: `Ürün seçeneği bulunamadı` },
          { status: 409 },
        );
      }
      unitPrice += Number(variant.price_delta);
      variantLabel = variant.label;
      availableStock = variant.stock_quantity;
    }

    if (availableStock < item.quantity) {
      return NextResponse.json(
        { error: `"${product.name}" için yeterli stok yok` },
        { status: 409 },
      );
    }

    const images = (product.product_images ?? []) as {
      storage_path: string;
      is_primary: boolean;
      sort_order: number;
    }[];
    const primaryImage =
      images.find((img) => img.is_primary) ??
      [...images].sort((a, b) => a.sort_order - b.sort_order)[0];

    orderItems.push({
      product_id: product.id,
      variant_id: item.variantId,
      product_name: product.name,
      variant_label: variantLabel,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: unitPrice * item.quantity,
      product_image_path: primaryImage?.storage_path ?? null,
    });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.line_total, 0);
  const shippingFee = calculateShippingFee(subtotal);
  const giftWrapFee = calculateGiftWrapFee(is_gift_wrapped);
  const total = subtotal + shippingFee + giftWrapFee;
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: user?.id ?? null,
      guest_email: user ? null : email,
      status: "pending",
      subtotal,
      gift_wrap_fee: giftWrapFee,
      shipping_fee: shippingFee,
      total,
      is_gift_wrapped,
      gift_note: is_gift_wrapped ? (gift_note ?? null) : null,
      shipping_address: shipping,
      billing_address: shipping,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı" },
      { status: 500 },
    );
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    orderItems.map((item) => ({ ...item, order_id: order.id })),
  );

  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Sipariş kalemleri oluşturulamadı" },
      { status: 500 },
    );
  }

  const basketItems = orderItems.map((item) => ({
    id: item.product_id,
    name: item.variant_label
      ? `${item.product_name} (${item.variant_label})`
      : item.product_name,
    category1: "Peluş Oyuncak",
    itemType: "PHYSICAL",
    price: item.line_total.toFixed(2),
  }));

  if (shippingFee > 0) {
    basketItems.push({
      id: "shipping",
      name: "Kargo Ücreti",
      category1: "Hizmet",
      itemType: "VIRTUAL",
      price: shippingFee.toFixed(2),
    });
  }

  if (giftWrapFee > 0) {
    basketItems.push({
      id: "gift-wrap",
      name: "Hediye Paketi",
      category1: "Hizmet",
      itemType: "VIRTUAL",
      price: giftWrapFee.toFixed(2),
    });
  }

  const fullAddress = `${shipping.address_line}, ${shipping.neighborhood ?? ""} ${shipping.district}/${shipping.city}`;

  try {
    const result = await initializeCheckoutForm({
      conversationId: order.id,
      price: total.toFixed(2),
      paidPrice: total.toFixed(2),
      basketId: order.order_number,
      callbackUrl: `${env.NEXT_PUBLIC_SITE_URL}/api/iyzico/callback`,
      buyer: {
        id: user?.id ?? `guest-${order.id}`,
        name: shipping.full_name.split(" ").slice(0, -1).join(" ") || shipping.full_name,
        surname: shipping.full_name.split(" ").slice(-1).join(" ") || "-",
        email,
        gsmNumber: shipping.phone,
        // TODO before going live: collect a real TC Kimlik No at checkout and use
        // it here — iyzico's fraud checks expect a genuine identity number for
        // production transactions. The sandbox accepts this placeholder for testing.
        identityNumber: "11111111111",
        registrationAddress: fullAddress,
        city: shipping.city,
        country: "Turkey",
        address: fullAddress,
        ip: request.headers.get("x-forwarded-for") ?? "85.34.78.112",
      },
      shippingAddress: {
        contactName: shipping.full_name,
        city: shipping.city,
        country: "Turkey",
        address: fullAddress,
      },
      billingAddress: {
        contactName: shipping.full_name,
        city: shipping.city,
        country: "Turkey",
        address: fullAddress,
      },
      basketItems,
    });

    if (result.status !== "success" || !result.paymentPageUrl) {
      await admin
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
      return NextResponse.json(
        { error: result.errorMessage ?? "Ödeme başlatılamadı" },
        { status: 502 },
      );
    }

    await admin
      .from("orders")
      .update({ iyzico_conversation_id: order.id })
      .eq("id", order.id);

    return NextResponse.json({ paymentPageUrl: result.paymentPageUrl });
  } catch {
    await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      { error: "Ödeme sağlayıcısına bağlanılamadı" },
      { status: 502 },
    );
  }
}
