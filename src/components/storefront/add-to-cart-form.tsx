"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/database.types";

export function AddToCartForm({
  productId,
  slug,
  name,
  basePrice,
  stockQuantity,
  variants,
  imagePath,
}: {
  productId: string;
  slug: string;
  name: string;
  basePrice: number;
  stockQuantity: number;
  variants: ProductVariant[];
  imagePath: string | null;
}) {
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const activeVariant = variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = basePrice + (activeVariant?.price_delta ?? 0);
  const stock = activeVariant?.stock_quantity ?? stockQuantity;
  const outOfStock = stock <= 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-2xl font-medium text-foreground">
        {formatPrice(unitPrice)}
      </div>

      {variants.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Seçenek</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setVariantId(variant.id)}
                disabled={variant.stock_quantity <= 0}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  variant.id === variantId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-secondary",
                )}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-full border border-border px-2">
          <button
            className="flex h-9 w-9 items-center justify-center text-foreground disabled:opacity-30"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Azalt"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-5 text-center">{quantity}</span>
          <button
            className="flex h-9 w-9 items-center justify-center text-foreground disabled:opacity-30"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            aria-label="Artır"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1"
          disabled={outOfStock}
          onClick={() =>
            addItem(
              {
                productId,
                variantId,
                slug,
                name,
                variantLabel: activeVariant?.label ?? null,
                unitPrice,
                imagePath,
                stockQuantity: stock,
              },
              quantity,
            )
          }
        >
          {outOfStock ? "Stokta Yok" : "Sepete Ekle"}
        </Button>
      </div>
      {!outOfStock && stock <= 5 ? (
        <p className="text-xs text-primary">Son {stock} ürün!</p>
      ) : null}
    </div>
  );
}
