import { cn } from "@/lib/utils";

export function Logo({
  className,
  markClassName,
  showTagline = true,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, next/image's optimizer doesn't apply here */}
      <img
        src="/brand/poppy-mark.svg"
        alt=""
        className={cn("h-7 w-7 shrink-0", markClassName)}
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl tracking-wide text-mocha">
          ELENA
        </span>
        {showTagline ? (
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-0.5">
            By Elvin
          </span>
        ) : null}
      </span>
    </span>
  );
}
