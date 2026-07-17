import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/storefront/category-tabs";
import { EmptyState } from "@/components/storefront/empty-state";
import { ProductCard } from "@/components/storefront/product-card";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/data/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.name ?? "Mağaza",
    description: category?.description ?? undefined,
    alternates: { canonical: `/magaza/${slug}` },
  };
}

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const [categories, category] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
  ]);

  if (!category) notFound();

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        {category.name}
      </h1>
      {category.description ? (
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {category.description}
        </p>
      ) : null}

      <div className="mt-6">
        <CategoryTabs categories={categories} activeSlug={slug} />
      </div>

      {products.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Yeni dostlar yolda!"
          description="Bu kategori çok yakında doluyor — bu arada diğer dostlarımıza göz atabilirsin."
          tint="#dce5d3"
          icon={<Sparkle className="h-5 w-5" />}
          action={
            <Button size="lg" asChild>
              <Link href="/magaza">Tüm Ürünlere Göz At</Link>
            </Button>
          }
        />
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
