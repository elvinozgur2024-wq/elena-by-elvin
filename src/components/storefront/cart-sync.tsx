"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "@phosphor-icons/react";
import { getProductsByIds } from "@/lib/data/products";
import {
  hasCartChanges,
  useCartStore,
  type CartSyncResult,
} from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";

/**
 * Refreshes the persisted cart against the live catalog and reports what
 * changed. Runs once each time `enabled` flips true (page mount, or the cart
 * drawer opening), so a shopper never sees a stale price on the total they're
 * about to pay.
 */
export function useCartSync(enabled: boolean): CartSyncResult | null {
  const syncWithCatalog = useCartStore((s) => s.syncWithCatalog);
  const hydrated = useHydrated();
  const [result, setResult] = useState<CartSyncResult | null>(null);
  const ranFor = useRef(false);

  useEffect(() => {
    if (!enabled) {
      ranFor.current = false;
      return;
    }
    if (!hydrated || ranFor.current) return;

    // Read straight from the store rather than subscribing — subscribing to
    // items would re-run this effect on the very update it performs.
    const ids = [
      ...new Set(useCartStore.getState().items.map((i) => i.productId)),
    ];
    if (ids.length === 0) return;

    ranFor.current = true;
    let cancelled = false;

    getProductsByIds(ids)
      .then((products) => {
        if (cancelled) return;
        const changes = syncWithCatalog(products);
        if (hasCartChanges(changes)) setResult(changes);
      })
      .catch(() => {
        // Offline or Supabase hiccup: leave the cart as-is. Checkout still
        // validates server-side, so this can only ever be a display lag.
        ranFor.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, hydrated, syncWithCatalog]);

  return result;
}

export function CartSyncNotice({
  result,
  className,
}: {
  result: CartSyncResult | null;
  className?: string;
}) {
  if (!hasCartChanges(result) || !result) return null;

  return (
    <div
      role="status"
      className={`flex gap-2.5 rounded-xl bg-tint-butter px-4 py-3 text-xs leading-relaxed text-mocha ${className ?? ""}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        {result.priceChanged.length > 0 ? (
          <p>
            <span className="font-medium">Fiyatlar güncellendi:</span>{" "}
            {result.priceChanged
              .map(
                (c) => `${c.name} ${formatPrice(c.from)} → ${formatPrice(c.to)}`,
              )
              .join(", ")}
          </p>
        ) : null}
        {result.quantityReduced.length > 0 ? (
          <p>
            <span className="font-medium">Stok nedeniyle adet azaltıldı:</span>{" "}
            {result.quantityReduced.map((c) => `${c.name} (${c.to})`).join(", ")}
          </p>
        ) : null}
        {result.removed.length > 0 ? (
          <p>
            <span className="font-medium">Sepetten çıkarıldı:</span>{" "}
            {result.removed.join(", ")} — ürün artık mevcut değil.
          </p>
        ) : null}
      </div>
    </div>
  );
}
