import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { getOrderByIdAdmin } from "@/lib/data/admin";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdAdmin(id);
  if (!order) notFound();

  const shipping = order.shipping_address as {
    full_name: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string | null;
    address_line: string;
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">
            {order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusControl orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
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

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-base text-foreground">
            Teslimat Bilgileri
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {shipping.full_name} · {shipping.phone}
            <br />
            {shipping.address_line}, {shipping.neighborhood}{" "}
            {shipping.district}/{shipping.city}
          </p>
          {order.guest_email ? (
            <p className="mt-2 text-sm text-muted-foreground">
              E-posta: {order.guest_email}
            </p>
          ) : null}
          {order.is_gift_wrapped && order.gift_note ? (
            <p className="mt-3 rounded-xl bg-tint-blush px-3 py-2 text-sm text-mocha">
              Hediye Notu: {order.gift_note}
            </p>
          ) : null}
          {order.iyzico_payment_id ? (
            <p className="mt-3 text-xs text-muted-foreground">
              iyzico Ödeme ID: {order.iyzico_payment_id}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
