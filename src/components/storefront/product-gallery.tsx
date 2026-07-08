"use client";

import Image from "next/image";
import { useState } from "react";
import { productImageUrl, PRODUCT_IMAGE_VERSION } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/database.types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!images.length) {
    return (
      <div className="aspect-square w-full rounded-3xl border border-border/60 bg-white" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/60 bg-white">
        <Image
          key={active.id}
          src={productImageUrl(active.storage_path, PRODUCT_IMAGE_VERSION)}
          alt={active.alt_text ?? productName}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-contain p-6"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors",
                i === activeIndex ? "border-primary" : "border-border/60",
              )}
              aria-label={`Görsel ${i + 1}`}
            >
              <Image
                src={productImageUrl(image.storage_path, PRODUCT_IMAGE_VERSION)}
                alt={image.alt_text ?? productName}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
