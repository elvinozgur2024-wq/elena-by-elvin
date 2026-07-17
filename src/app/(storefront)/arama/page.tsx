import type { Metadata } from "next";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/storefront/empty-state";
import { SearchBox } from "@/components/storefront/search-box";
import { ProductCard } from "@/components/storefront/product-card";
import { searchProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Ürün Ara",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const products = query.trim() ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Ürün Ara
      </h1>

      <div className="mx-auto mt-6 max-w-xl lg:hidden">
        <SearchBox initialQuery={query} />
      </div>

      {!query.trim() ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Aramak istediğiniz ürünü yazın.
        </p>
      ) : products.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Aradığını bulamadık"
          description={`"${query}" için sonuç yok — ama keşfedilmeyi bekleyen başka dostlar var.`}
          tint="#d8e6ec"
          icon={<MagnifyingGlass className="h-5 w-5" />}
          action={
            <Button size="lg" asChild>
              <Link href="/magaza">Tüm Ürünlere Göz At</Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            &ldquo;{query}&rdquo; için {products.length} sonuç
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
