"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Package,
  Tag,
  ShoppingBag,
  ChatCircleText,
  Image as ImageIcon,
  SignOut,
} from "@phosphor-icons/react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/actions/auth";

const NAV = [
  { href: "/admin", label: "Panel", icon: SquaresFour },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tag },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: ChatCircleText },
  { href: "/admin/site-icerigi", label: "Site İçeriği", icon: ImageIcon },
];

export function AdminSidebar({
  unreadMessages = 0,
}: {
  unreadMessages?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6">
      <Link href="/admin">
        <Logo />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
              {item.href === "/admin/mesajlar" && unreadMessages > 0 ? (
                <span
                  className={cn(
                    "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium",
                    active
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {unreadMessages}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <form action={adminLogout}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <SignOut className="h-4.5 w-4.5" /> Çıkış Yap
        </button>
      </form>
    </aside>
  );
}
