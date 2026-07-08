"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";
import { productImageUrl, PRODUCT_IMAGE_VERSION } from "@/lib/supabase/storage";
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from "@/lib/checkout/pricing";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const hydrated = useHydrated();

  const subtotal = hydrated ? cartSubtotal(items) : 0;
  const shipping = calculateShippingFee(subtotal);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-serif text-2xl text-foreground">
          Sepetiniz boş
        </h1>
        <p className="text-sm text-muted-foreground">
          Yumuşacık arkadaşlarımıza göz atmaya ne dersiniz?
        </p>
        <Button asChild className="mt-2">
          <Link href="/magaza">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground">Sepetim</h1>

      {remaining > 0 ? (
        <p className="mt-3 rounded-xl bg-tint-sage px-4 py-2.5 text-sm text-mocha">
          {formatPrice(remaining)} daha ekleyin, kargo ücretsiz olsun!
        </p>
      ) : (
        <p className="mt-3 rounded-xl bg-tint-sage px-4 py-2.5 text-sm text-mocha">
          Ücretsiz kargo hakkı kazandınız 🎉
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <ul className="flex flex-col gap-5 lg:col-span-2">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-4 rounded-2xl border border-border p-4"
            >
              <Link
                href={`/urun/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-white"
              >
                {item.imagePath ? (
                  <Image
                    src={productImageUrl(item.imagePath, PRODUCT_IMAGE_VERSION)}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/urun/${item.slug}`}
                      className="font-serif text-base text-foreground hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.variantLabel ? (
                      <p className="text-xs text-muted-foreground">
                        {item.variantLabel}
                      </p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Ürünü kaldır"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 rounded-full border border-border px-1">
                    <button
                      className="flex h-8 w-8 items-center justify-center"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1,
                        )
                      }
                      aria-label="Azalt"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1,
                        )
                      }
                      disabled={item.quantity >= item.stockQuantity}
                      aria-label="Artır"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-serif text-lg text-foreground">Sipariş Özeti</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ara Toplam</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kargo</span>
              <span>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-medium text-foreground">
            <span>Toplam</span>
            <span>{formatPrice(subtotal + shipping)}</span>
          </div>
          <Button size="lg" className="mt-6 w-full" asChild>
            <Link href="/odeme">Ödemeye Geç</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
