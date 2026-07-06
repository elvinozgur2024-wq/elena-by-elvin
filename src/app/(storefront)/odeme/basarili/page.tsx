import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { ClearCartOnMount } from "@/components/storefront/clear-cart-on-mount";
import type { OrderWithItems } from "@/types/database.types";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  let order: OrderWithItems | null = null;

  if (orderNumber) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    order = data as unknown as OrderWithItems | null;
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <CheckCircle className="h-14 w-14 text-primary" weight="fill" />
      <h1 className="mt-4 font-serif text-3xl text-foreground">
        Siparişiniz Alındı!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Teşekkür ederiz, siparişiniz en kısa sürede hazırlanmaya başlanacak.
      </p>

      {order ? (
        <div className="mt-8 w-full rounded-2xl border border-border p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sipariş No</span>
            <span className="font-medium">{order.order_number}</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium">
            <span>Toplam</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/magaza">Alışverişe Devam Et</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/hesabim/siparislerim">Siparişlerim</Link>
        </Button>
      </div>
    </div>
  );
}
