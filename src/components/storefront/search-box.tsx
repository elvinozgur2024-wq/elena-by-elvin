"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function SearchBox({
  initialQuery,
  autoFocus = true,
  size = "default",
  className,
}: {
  initialQuery: string;
  autoFocus?: boolean;
  size?: "default" | "compact";
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function updateQuery(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (next.trim()) params.set("q", next.trim());
      router.replace(`/arama${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });
    }, 300);
  }

  const compact = size === "compact";

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={cn("relative", className)}
    >
      <MagnifyingGlass
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          compact ? "left-3.5 h-4 w-4" : "left-4 h-5 w-5",
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => updateQuery(e.target.value)}
        placeholder="Ürün ara..."
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
          compact ? "py-2 pl-9.5 pr-8 text-sm" : "py-3.5 pl-12 pr-11 text-base",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => updateQuery("")}
          aria-label="Aramayı temizle"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            compact ? "right-3" : "right-4",
          )}
        >
          <X className={compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
        </button>
      ) : null}
    </form>
  );
}
