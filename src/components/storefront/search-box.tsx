"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

export function SearchBox({ initialQuery }: { initialQuery: string }) {
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

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative"
    >
      <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => updateQuery(e.target.value)}
        placeholder="Ürün ara..."
        autoFocus
        className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-11 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => updateQuery("")}
          aria-label="Aramayı temizle"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      ) : null}
    </form>
  );
}
