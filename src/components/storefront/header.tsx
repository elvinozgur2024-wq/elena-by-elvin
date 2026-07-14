"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  List,
  MagnifyingGlass,
  ShoppingBag,
  User,
  X,
} from "@phosphor-icons/react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/storefront/search-box";
import { useCartStore, cartCount } from "@/lib/cart/store";
import { useWishlistStore } from "@/lib/wishlist/store";
import { useHydrated } from "@/lib/use-hydrated";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/checkout/pricing";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/types/database.types";
import { cn } from "@/lib/utils";

export function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydrated();
  const { items, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const count = hydrated ? cartCount(items) : 0;
  const favCount = hydrated ? wishlistCount : 0;

  const navLinks = [
    { href: "/magaza", label: "Tüm Ürünler" },
    ...categories.map((category) => ({
      href: `/magaza/${category.slug}`,
      label: category.name,
    })),
    { href: "/beden-rehberi", label: "Beden Rehberi" },
    { href: "/hakkimizda", label: "Hakkımızda" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="border-b border-border bg-secondary/60">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] tracking-wide text-muted-foreground sm:px-6 lg:px-8">
          {formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri siparişlerde ücretsiz
          kargo
        </p>
      </div>

      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden -ml-2 p-2 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menüyü aç"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
          <div className="hidden w-full max-w-[220px] lg:block">
            <SearchBox initialQuery="" autoFocus={false} size="compact" />
          </div>
        </div>

        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="lg:hidden" asChild>
            <Link href="/arama" aria-label="Ara">
              <MagnifyingGlass className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/favorilerim" aria-label="Favorilerim">
              <Heart className="h-5 w-5" />
              {favCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {favCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/hesabim" aria-label="Hesabım">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label="Sepetim"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      <nav className="hidden items-center justify-center gap-7 border-t border-border py-3 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm tracking-wide text-foreground/90 transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Open cap is viewport-relative, not a fixed pixel value — the nav
          list grows with the category list, and a hardcoded max-height
          (formerly max-h-96) silently clips new entries. The inner nav
          scrolls if a short screen can't fit everything. */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border bg-background transition-[max-height] duration-200",
          mobileOpen ? "max-h-[75dvh]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex max-h-[75dvh] flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
