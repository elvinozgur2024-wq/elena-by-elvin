"use client";

import { Heart } from "@phosphor-icons/react";
import { useWishlistStore } from "@/lib/wishlist/store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  className,
  size = "sm",
  revealOnHover = false,
}: {
  productId: string;
  className?: string;
  size?: "sm" | "lg";
  /** Fade in only on card hover (or when active) — used on product grid cards. */
  revealOnHover?: boolean;
}) {
  const hydrated = useHydrated();
  const has = useWishlistStore((s) => s.has);
  const toggle = useWishlistStore((s) => s.toggle);
  const active = hydrated && has(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center rounded-full transition duration-200 ease-out",
        size === "sm" ? "h-9 w-9" : "h-11 w-11 border border-border",
        active
          ? "bg-white text-primary shadow-sm"
          : "bg-white/90 text-muted-foreground shadow-sm hover:text-primary",
        revealOnHover && !active
          ? "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:opacity-100"
          : "opacity-100",
        className,
      )}
    >
      <Heart
        className={size === "sm" ? "h-4.5 w-4.5" : "h-5 w-5"}
        weight={active ? "fill" : "regular"}
      />
    </button>
  );
}
