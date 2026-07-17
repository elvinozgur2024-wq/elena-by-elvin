import { cn } from "@/lib/utils";

/**
 * Hand-drawn plush blob for empty states — a sleepy round friend with ears,
 * drawn in the brand's mocha/coral line style. `tint` picks the body color
 * (use the category tint hexes so each page gets its own pastel).
 */
function PlushBlob({ tint, className }: { tint: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 220 170"
      aria-hidden="true"
      className={cn("h-auto w-44", className)}
    >
      {/* ground shadow */}
      <ellipse cx="110" cy="158" rx="54" ry="8" fill="#4a3f3a" opacity="0.07" />
      {/* ears */}
      <circle cx="63" cy="54" r="17" fill={tint} />
      <circle cx="157" cy="54" r="17" fill={tint} />
      <circle cx="63" cy="52" r="8" fill="#e06a6a" opacity="0.2" />
      <circle cx="157" cy="52" r="8" fill="#e06a6a" opacity="0.2" />
      {/* body */}
      <ellipse cx="110" cy="100" rx="70" ry="60" fill={tint} />
      {/* closed happy eyes */}
      <path
        d="M84 94 Q90 86 96 94"
        fill="none"
        stroke="#4a3f3a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M124 94 Q130 86 136 94"
        fill="none"
        stroke="#4a3f3a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* smile */}
      <path
        d="M102 108 Q110 116 118 108"
        fill="none"
        stroke="#4a3f3a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* blush cheeks */}
      <ellipse cx="77" cy="108" rx="7" ry="5" fill="#e06a6a" opacity="0.22" />
      <ellipse cx="143" cy="108" rx="7" ry="5" fill="#e06a6a" opacity="0.22" />
      {/* sparkles */}
      <path
        d="M30 34 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5 Z"
        fill="#e06a6a"
        opacity="0.45"
      />
      <path
        d="M192 60 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z"
        fill="#4a3f3a"
        opacity="0.2"
      />
      <path
        d="M178 22 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z"
        fill="#e06a6a"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * Branded empty state: sleepy plush illustration, warm title, supporting
 * line, and a call to action. Pure presentational — usable from both server
 * and client components; pass `icon` from the page (it appears in a small
 * white badge next to the plush).
 */
export function EmptyState({
  title,
  description,
  tint = "#f6ded8",
  icon,
  action,
  compact = false,
  titleAs: TitleTag = "h2",
  className,
}: {
  title: string;
  description?: string;
  tint?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  /** Tighter layout for drawers/sidebars. */
  compact?: boolean;
  titleAs?: "h1" | "h2" | "p";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "gap-1 py-6" : "gap-2 py-16",
        className,
      )}
    >
      <div className="relative">
        <PlushBlob tint={tint} className={compact ? "w-28" : undefined} />
        {icon ? (
          <span
            className={cn(
              "absolute flex items-center justify-center rounded-full bg-white text-primary shadow-sm",
              compact
                ? "-right-1 bottom-4 h-8 w-8"
                : "right-0 bottom-6 h-10 w-10",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <TitleTag
        className={cn(
          "font-serif text-foreground",
          compact ? "mt-2 text-lg" : "mt-4 text-2xl",
        )}
      >
        {title}
      </TitleTag>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className={compact ? "mt-3" : "mt-5"}>{action}</div> : null}
    </div>
  );
}
