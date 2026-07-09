import type { ProductWithImages } from "@/types/database.types";
import { productImageUrl } from "@/lib/supabase/storage";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "Elena By Elvin";
export const INSTAGRAM_URL = "https://www.instagram.com/elenababywear";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Organization/LocalBusiness structured data — helps Google associate the
// site with the real business (address, name) in search results.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/marketing/hero-whale.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Güneştepe Mah. Çamlık Cad. No:148 A",
      addressLocality: "Osmangazi",
      addressRegion: "Bursa",
      addressCountry: "TR",
    },
    sameAs: [INSTAGRAM_URL],
  };
}

// Product structured data — enables rich results (price, availability) in
// Google search and Google Shopping surfaces.
export function productJsonLd(product: ProductWithImages) {
  const images = product.product_images.map((img) =>
    productImageUrl(img.storage_path),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/urun/${product.slug}`),
      priceCurrency: "TRY",
      price: product.base_price,
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
