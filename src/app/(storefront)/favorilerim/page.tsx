"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { useWishlistStore } from "@/lib/wishlist/store";
import { useHydrated } from "@/lib/use-hydrated";
import { getProductsByIds } from "@/lib/data/products";
import type { ProductWithImages } from "@/types/database.types";

export default function FavoritesPage() {
  const hydrated = useHydrated();
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<ProductWithImages[] | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }
    getProductsByIds(productIds).then(setProducts);
  }, [hydrated, productIds]);

  if (!hydrated || products === null) return null;

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
        <Heart className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-serif text-2xl text-foreground">
          Favori listeniz boş
        </h1>
        <p className="text-sm text-muted-foreground">
          Beğendiğiniz ürünleri kalp simgesine tıklayarak buraya
          ekleyebilirsiniz.
        </p>
        <Button asChild className="mt-2">
          <Link href="/magaza">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Favorilerim
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length} ürün
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
