"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { productImageUrl, PRODUCT_IMAGE_VERSION } from "@/lib/supabase/storage";
import { useCartStore } from "@/lib/cart/store";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import type { ProductWithImages } from "@/types/database.types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithImages }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];
  const hasVariants = product.product_variants.length > 0;
  const onSale = product.compare_at_price != null;
  const soldOut = !hasVariants && product.stock_quantity <= 0;
  const discountPercent = onSale
    ? Math.round(
        (1 - product.base_price / product.compare_at_price!) * 100,
      )
    : null;

  function handleAction(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    // Products with options can't be resolved from the grid — send the
    // shopper to the product page to choose. Simple products add straight
    // to the bag (addItem opens the cart drawer on its own).
    if (hasVariants) {
      router.push(`/urun/${product.slug}`);
      return;
    }
    addItem({
      productId: product.id,
      variantId: null,
      slug: product.slug,
      name: product.name,
      variantLabel: null,
      unitPrice: product.base_price,
      imagePath: primaryImage?.storage_path ?? null,
      stockQuantity: product.stock_quantity,
    });
  }

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col rounded-3xl bg-card shadow-none transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(74,63,58,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-secondary">
        {primaryImage ? (
          <Image
            src={productImageUrl(primaryImage.storage_path, PRODUCT_IMAGE_VERSION)}
            alt={primaryImage.alt_text ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        ) : null}

        {soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-background">
            Stokta Yok
          </span>
        ) : product.is_featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-foreground">
            Çok Satılan
          </span>
        ) : null}

        {discountPercent ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-foreground">
            -%{discountPercent}
          </span>
        ) : null}

        <WishlistButton
          productId={product.id}
          revealOnHover
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pb-1 pt-4">
        {product.category ? (
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {product.category.name}
          </span>
        ) : null}
        <h3 className="font-serif text-[17px] leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-sm font-medium text-foreground">
            {formatPrice(product.base_price)}
          </span>
          {product.compare_at_price ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAction}
          disabled={soldOut}
          className={cn(
            "mt-3 w-full rounded-full border py-2.5 text-sm font-medium tracking-wide transition-colors duration-200",
            soldOut
              ? "cursor-not-allowed border-border text-muted-foreground"
              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
          )}
        >
          {soldOut ? "Stokta Yok" : hasVariants ? "Seçenekleri Gör" : "Sepete Ekle"}
        </button>
      </div>
    </Link>
  );
}
