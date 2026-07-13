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
      className={cn("h-12 w-auto", className)}
    />
  );
}
