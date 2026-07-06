import Link from "next/link";
import Image from "next/image";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllProductsAdmin } from "@/lib/data/admin";
import { formatPrice } from "@/lib/format";
import { productImageUrl } from "@/lib/supabase/storage";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Ürünler</h1>
        <Button asChild>
          <Link href="/admin/urunler/yeni">
            <Plus className="h-4 w-4" /> Yeni Ürün
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const primary =
                product.product_images.find((i) => i.is_primary) ??
                product.product_images[0];
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/admin/urunler/${product.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-tint-blush">
                        {primary ? (
                          <Image
                            src={productImageUrl(primary.storage_path)}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                          />
                        ) : null}
                      </div>
                      <span className="font-medium text-foreground hover:text-primary">
                        {product.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category?.name ?? "—"}
                  </TableCell>
                  <TableCell>{formatPrice(product.base_price)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock_quantity <= 5 ? "text-destructive" : undefined
                      }
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {products.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Henüz ürün eklenmedi.
          </p>
        ) : null}
      </div>
    </div>
  );
}
