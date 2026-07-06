import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database.types";

export function CategoryTabs({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/magaza"
        className={cn(
          "rounded-full border px-4 py-2 text-sm transition-colors",
          !activeSlug
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-foreground hover:bg-secondary",
        )}
      >
        Tümü
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/magaza/${category.slug}`}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            activeSlug === category.slug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:bg-secondary",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
