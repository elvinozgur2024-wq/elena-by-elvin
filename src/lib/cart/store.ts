import { create } from "zustand";
import { persist } from "zustand/middleware";

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
