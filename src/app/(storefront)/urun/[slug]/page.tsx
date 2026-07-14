import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowCounterClockwise,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { AddToCartForm } from "@/components/storefront/add-to-cart-form";
import { SizeGuideDialog } from "@/components/storefront/size-guide-dialog";
import { ProductCard } from "@/components/storefront/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { productImageUrl } from "@/lib/supabase/storage";
import { absoluteUrl, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };

  const description = product.short_description ?? undefined;
  const primaryImage =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];
  const imageUrl = primaryImage
    ? productImageUrl(primaryImage.storage_path)
    : undefined;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: absoluteUrl(`/urun/${product.slug}`),
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 1200 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);
  const primaryImage =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];

  const breadcrumbItems = [
    { name: "Anasayfa", path: "/" },
    ...(product.category
      ? [{ name: product.category.name, path: `/magaza/${product.category.slug}` }]
      : []),
    { name: product.name, path: `/urun/${product.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          images={product.product_images}
          productName={product.name}
        />

        <div className="flex flex-col">
          {product.category ? (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </span>
          ) : null}
          <h1 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
            {product.name}
          </h1>
          {product.short_description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.short_description}
            </p>
          ) : null}

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              basePrice={product.base_price}
              stockQuantity={product.stock_quantity}
              variants={product.product_variants}
              imagePath={primaryImage?.storage_path ?? null}
            />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <SizeGuideDialog />
            {product.size ? (
              <span className="text-sm text-muted-foreground">
                Bu ürün: {product.size}
              </span>
            ) : null}
          </div>

          {/* Reassurance — claims mirror /kargo-ve-iade and the checkout flow */}
          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-secondary/60 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 sm:flex-col sm:gap-1.5 sm:text-center">
              <Truck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-muted-foreground">
                750₺ üzeri ücretsiz kargo
              </p>
            </div>
            <div className="flex items-center gap-2.5 sm:flex-col sm:gap-1.5 sm:text-center">
              <ArrowCounterClockwise className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-muted-foreground">
                14 gün içinde kolay iade
              </p>
            </div>
            <div className="flex items-center gap-2.5 sm:flex-col sm:gap-1.5 sm:text-center">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-muted-foreground">
                iyzico ile güvenli ödeme
              </p>
            </div>
          </div>

          {(product.description || product.care_instructions) && (
            <Accordion
              type="single"
              collapsible
              defaultValue={product.description ? "detay" : "bakim"}
              className="mt-8 border-t border-border pt-2"
            >
              {product.description ? (
                <AccordionItem value="detay">
                  <AccordionTrigger className="font-serif text-base text-foreground hover:no-underline">
                    Ürün Detayı
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {product.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ) : null}
              {product.care_instructions ? (
                <AccordionItem value="bakim">
                  <AccordionTrigger className="font-serif text-base text-foreground hover:no-underline">
                    Bakım Önerileri
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {product.care_instructions}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ) : null}
            </Accordion>
          )}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-foreground">
            Bunları da Beğenebilirsiniz
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
