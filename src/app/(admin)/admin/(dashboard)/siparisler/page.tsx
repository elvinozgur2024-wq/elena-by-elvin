import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { getOrdersAdmin } from "@/lib/data/admin";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminOrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">Siparişler</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Alıcı</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const shipping = order.shipping_address as { full_name: string };
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/siparisler/${order.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {order.order_number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shipping?.full_name ?? order.guest_email ?? "—"}
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {orders.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Henüz sipariş yok.
          </p>
        ) : null}
      </div>
    </div>
  );
}
