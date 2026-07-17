import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/storefront/empty-state";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground">Siparişlerim</h1>

      {!orders || orders.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Henüz siparişin yok"
          description="İlk yumuşacık dostunu seçmeye ne dersin?"
          tint="#d9e8dc"
          icon={<Package className="h-5 w-5" />}
          action={
            <Button size="lg" asChild>
              <Link href="/magaza">Koleksiyonu Keşfet</Link>
            </Button>
          }
        />
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/hesabim/siparislerim/${order.id}`}
                className="flex items-center justify-between rounded-2xl border border-border p-4 hover:bg-secondary/60"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-medium">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
