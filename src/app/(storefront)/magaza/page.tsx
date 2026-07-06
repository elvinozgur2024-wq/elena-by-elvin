import type { Metadata } from "next";
import { CategoryTabs } from "@/components/storefront/category-tabs";
import { ProductCard } from "@/components/storefront/product-card";
import { getCategories, getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Mağaza",
  description:
    "Elena By Elvin peluş oyuncak koleksiyonunu keşfedin — ayılar, deniz canlıları, uyku arkadaşları ve daha fazlası.",
  alternates: { canonical: "/magaza" },
};
export const revalidate = 3600;

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Tüm Ürünler
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length} ürün
      </p>

      <div className="mt-6">
        <CategoryTabs categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Şu anda ürün bulunmuyor, yakında burada olacak.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
