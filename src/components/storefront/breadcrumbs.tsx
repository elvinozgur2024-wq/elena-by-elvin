import Link from "next/link";
import { Fragment } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

/**
 * Visible breadcrumb trail (the JSON-LD variant lives in lib/seo). The last
 * item is the current page and renders as plain text.
 */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Sayfa yolu">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.path}>
              {index > 0 ? (
                <li aria-hidden="true">
                  <CaretRight className="h-3 w-3" />
                </li>
              ) : null}
              <li className={isLast ? "min-w-0" : undefined}>
                {isLast ? (
                  <span
                    aria-current="page"
                    className="block max-w-[16rem] truncate text-foreground"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
