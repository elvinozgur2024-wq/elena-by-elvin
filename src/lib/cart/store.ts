import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductWithImages } from "@/types/database.types";

export interface CartItem {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  imagePath: string | null;
  stockQuantity: number;
}

/** What changed when a persisted cart was reconciled against the catalog. */
export interface CartSyncResult {
  priceChanged: { name: string; from: number; to: number }[];
  quantityReduced: { name: string; to: number }[];
  removed: string[];
}

export function hasCartChanges(result: CartSyncResult | null): boolean {
  if (!result) return false;
  return (
    result.priceChanged.length > 0 ||
    result.quantityReduced.length > 0 ||
    result.removed.length > 0
  );
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  /**
   * Reconcile the persisted cart against live catalog rows. Carts live in
   * localStorage indefinitely with the price frozen at add-time, so without
   * this a shopper can be shown a stale total and charged the current one
   * (checkout always recalculates server-side).
   */
  syncWithCatalog: (products: ProductWithImages[]) => CartSyncResult;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

function sameLine(
  a: { productId: string; variantId: string | null },
  b: { productId: string; variantId: string | null },
) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        const existing = get().items.find((line) => sameLine(line, item));

        if (existing) {
          const nextQty = Math.min(
            existing.quantity + quantity,
            existing.stockQuantity,
          );
          set({
            items: get().items.map((line) =>
              sameLine(line, item) ? { ...line, quantity: nextQty } : line,
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, quantity: Math.min(quantity, item.stockQuantity) },
            ],
          });
        }

        set({ isOpen: true });
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (line) => !sameLine(line, { productId, variantId }),
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((line) =>
            sameLine(line, { productId, variantId })
              ? { ...line, quantity: Math.min(quantity, line.stockQuantity) }
              : line,
          ),
        });
      },

      syncWithCatalog: (products) => {
        const byId = new Map(products.map((p) => [p.id, p]));
        const result: CartSyncResult = {
          priceChanged: [],
          quantityReduced: [],
          removed: [],
        };
        const next: CartItem[] = [];

        for (const line of get().items) {
          // getProductsByIds only returns active products, so a miss means
          // the product was deleted or hidden since it was added.
          const product = byId.get(line.productId);
          if (!product) {
            result.removed.push(line.name);
            continue;
          }

          let unitPrice = Number(product.base_price);
          let stock = product.stock_quantity;

          if (line.variantId) {
            const variant = product.product_variants.find(
              (v) => v.id === line.variantId,
            );
            if (!variant) {
              result.removed.push(line.name);
              continue;
            }
            unitPrice += Number(variant.price_delta);
            stock = variant.stock_quantity;
          }

          if (stock <= 0) {
            result.removed.push(line.name);
            continue;
          }

          const quantity = Math.min(line.quantity, stock);
          if (quantity < line.quantity) {
            result.quantityReduced.push({ name: product.name, to: quantity });
          }
          if (unitPrice !== line.unitPrice) {
            result.priceChanged.push({
              name: product.name,
              from: line.unitPrice,
              to: unitPrice,
            });
          }

          next.push({
            ...line,
            name: product.name,
            slug: product.slug,
            unitPrice,
            quantity,
            stockQuantity: stock,
          });
        }

        // Only write when something actually moved — an unconditional set()
        // would re-render every cart subscriber on each page view.
        if (hasCartChanges(result)) set({ items: next });
        return result;
      },

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "elena-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
