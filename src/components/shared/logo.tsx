import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/elenaland-logo.png"
      alt="Elena By Elvin"
      width={2431}
      height={928}
      priority
      // Every usage renders at h-12 (≈126px wide). Without `sizes`, Next
      // derives the srcset from the 2431px intrinsic width and browsers
      // fetch the 3840px variant (~49KB) for a 126px logo.
      sizes="130px"
      className={cn("h-12 w-auto", className)}
    />
  );
}
