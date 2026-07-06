import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { Separator } from "@/components/ui/separator";
import type { OrderWithItems } from "@/types/database.types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as unknown as OrderWithItems;

  const shipping = order.shipping_address as {
    full_name: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string | null;
    address_line: string;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">
            {order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="mt-6 rounded-2xl border border-border p-5">
        <h2 className="font-serif text-base text-foreground">Ürünler</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.product_name}
                {item.variant_label ? ` (${item.variant_label})` : ""} ×{" "}
                {item.quantity}
              </span>
              <span>{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ara Toplam</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kargo</span>
            <span>
              {order.shipping_fee === 0
                ? "Ücretsiz"
                : formatPrice(order.shipping_fee)}
            </span>
          </div>
          {order.is_gift_wrapped ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hediye Paketi</span>
              <span>{formatPrice(order.gift_wrap_fee)}</span>
            </div>
          ) : null}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-base font-medium text-foreground">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border p-5">
        <h2 className="font-serif text-base text-foreground">
          Teslimat Adresi
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {shipping.full_name} · {shipping.phone}
          <br />
          {shipping.address_line}, {shipping.neighborhood}{" "}
          {shipping.district}/{shipping.city}
        </p>
        {order.is_gift_wrapped && order.gift_note ? (
          <p className="mt-3 rounded-xl bg-tint-blush px-3 py-2 text-sm text-mocha">
            Hediye Notu: {order.gift_note}
          </p>
        ) : null}
      </section>
    </div>
  );
}
