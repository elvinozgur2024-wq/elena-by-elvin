"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { productImageUrl } from "@/lib/supabase/storage";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } =
    useCartStore();
  const subtotal = cartSubtotal(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sepetim</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Sepetiniz henüz boş.
            </p>
            <Button asChild onClick={closeCart} className="mt-2">
              <Link href="/magaza">Alışverişe Başla</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-tint-blush">
                      {item.imagePath ? (
                        <Image
                          src={productImageUrl(item.imagePath)}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1.5"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif text-sm leading-snug text-foreground">
                            {item.name}
                          </p>
                          {item.variantLabel ? (
                            <p className="text-xs text-muted-foreground">
                              {item.variantLabel}
                            </p>
                          ) : null}
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantId)
                          }
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Ürünü kaldır"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 rounded-full border border-border px-1">
                          <button
                            className="flex h-7 w-7 items-center justify-center text-foreground disabled:opacity-30"
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
                          <span className="w-4 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-7 w-7 items-center justify-center text-foreground disabled:opacity-30"
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
                        <span className="text-sm font-medium">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <Separator className="mb-2" />
              <Button asChild size="lg" onClick={closeCart}>
                <Link href="/sepet">Sepete Git</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
