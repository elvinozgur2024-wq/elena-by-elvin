import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { productImageUrl } from "@/lib/supabase/storage";
import type { ProductWithImages } from "@/types/database.types";
import { cn } from "@/lib/utils";

const TINT_CLASS: Record<string, string> = {
  blush: "bg-tint-blush",
  sage: "bg-tint-sage",
  butter: "bg-tint-butter",
  sky: "bg-tint-sky",
  lavender: "bg-tint-lavender",
};

export function ProductCard({ product }: { product: ProductWithImages }) {
  const primaryImage =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];
  const tint = product.category?.tint ?? "blush";

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col rounded-3xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
    >
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-2xl",
          TINT_CLASS[tint],
        )}
      >
        {primaryImage ? (
          <Image
            src={productImageUrl(primaryImage.storage_path)}
            alt={primaryImage.alt_text ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : null}
        {product.compare_at_price ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            İndirim
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1 px-1 pb-1">
        {product.category ? (
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </span>
        ) : null}
        <h3 className="font-serif text-base leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm font-medium text-foreground">
            {formatPrice(product.base_price)}
          </span>
          {product.compare_at_price ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
