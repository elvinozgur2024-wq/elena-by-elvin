"use client";

import Link from "next/link";
import { useState } from "react";
import { List, MagnifyingGlass, ShoppingBag, User, X } from "@phosphor-icons/react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useCartStore, cartCount } from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import type { Category } from "@/types/database.types";
import { cn } from "@/lib/utils";

export function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useHydrated();
  const { items, openCart } = useCartStore();

  const count = hydrated ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden -ml-2 p-2 text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menüyü aç"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>

        <Link href="/" className="lg:mr-8">
          <Logo />
        </Link>

        <nav className="hidden lg:flex flex-1 items-center gap-7 pl-4">
          <Link
            href="/magaza"
            className="text-sm text-foreground/90 hover:text-primary transition-colors"
          >
            Tüm Ürünler
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/magaza/${category.slug}`}
              className="text-sm text-foreground/90 hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/beden-rehberi"
            className="text-sm text-foreground/90 hover:text-primary transition-colors"
          >
            Beden Rehberi
          </Link>
          <Link
            href="/hakkimizda"
            className="text-sm text-foreground/90 hover:text-primary transition-colors"
          >
            Hakkımızda
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
            <Link href="/magaza" aria-label="Ara">
              <MagnifyingGlass className="h-5 w-5" />
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

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border bg-background transition-[max-height] duration-200",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          <Link
            href="/magaza"
            className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(false)}
          >
            Tüm Ürünler
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/magaza/${category.slug}`}
              className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/beden-rehberi"
            className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(false)}
          >
            Beden Rehberi
          </Link>
          <Link
            href="/hakkimizda"
            className="rounded-lg px-2 py-2.5 text-sm text-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(false)}
          >
            Hakkımızda
          </Link>
        </nav>
      </div>
    </header>
  );
}
