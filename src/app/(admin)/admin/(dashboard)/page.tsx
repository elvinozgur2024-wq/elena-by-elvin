import Link from "next/link";
import { Package, ShoppingBag, Warning } from "@phosphor-icons/react/dist/ssr";
import { getDashboardStats } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">Panel</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/urunler"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:bg-secondary/60"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint-blush">
            <Package className="h-5 w-5 text-mocha" />
          </div>
          <div>
            <p className="text-2xl font-medium text-foreground">
              {stats.productCount}
            </p>
            <p className="text-sm text-muted-foreground">Ürün</p>
          </div>
        </Link>

        <Link
          href="/admin/siparisler"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:bg-secondary/60"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint-sky">
            <ShoppingBag className="h-5 w-5 text-mocha" />
          </div>
          <div>
            <p className="text-2xl font-medium text-foreground">
              {stats.orderCount}
            </p>
            <p className="text-sm text-muted-foreground">Sipariş</p>
          </div>
        </Link>
      </div>

      {stats.lowStockProducts.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-tint-butter p-5">
          <h2 className="flex items-center gap-2 font-serif text-base text-foreground">
            <Warning className="h-5 w-5 text-primary" /> Düşük Stok
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="text-sm text-mocha">
                <Link
                  href={`/admin/urunler/${p.id}`}
                  className="hover:underline"
                >
                  {p.name}
                </Link>{" "}
                — {p.stock_quantity} adet kaldı
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
