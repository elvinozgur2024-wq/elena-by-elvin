import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      // Pre-sized WebP (512px wide, 16KB) rather than the 2431px/351KB
      // master: every usage renders at h-12 (≈126px), and images are served
      // unoptimized, so the file that ships must already be the right size.
      src="/brand/elenaland-logo.webp"
      alt="Elena By Elvin"
      width={512}
      height={195}
      priority
      className={cn("h-12 w-auto", className)}
    />
  );
}
