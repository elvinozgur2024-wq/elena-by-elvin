"use client";

import { useRef } from "react";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addVariant, deleteVariant } from "@/actions/admin-products";
import type { ProductVariant } from "@/types/database.types";

export function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariant[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {variants.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {variants.map((variant) => (
            <li
              key={variant.id}
              className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
            >
              <span>
                {variant.label}{" "}
                <span className="text-muted-foreground">
                  ({variant.stock_quantity} adet
                  {variant.price_delta !== 0
                    ? `, ${variant.price_delta > 0 ? "+" : ""}${variant.price_delta}₺`
                    : ""}
                  )
                </span>
              </span>
              <button
                onClick={() => deleteVariant(variant.id, productId)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Seçeneği sil"
                type="button"
              >
                <Trash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Bu ürün için henüz seçenek (varyant) eklenmedi.
        </p>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await addVariant(productId, formData);
          formRef.current?.reset();
        }}
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        <Input name="label" placeholder="Örn. Pembe" required />
        <Input name="sku_suffix" placeholder="SKU eki" required />
        <Input
          name="price_delta"
          type="number"
          step="0.01"
          placeholder="Fiyat farkı (₺)"
          defaultValue={0}
        />
        <Input
          name="stock_quantity"
          type="number"
          min="0"
          placeholder="Stok"
          defaultValue={0}
          required
        />
        <Button type="submit" variant="outline" className="col-span-2 sm:col-span-4">
          Seçenek Ekle
        </Button>
      </form>
    </div>
  );
}
