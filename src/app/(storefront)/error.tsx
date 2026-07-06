"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <WarningCircle className="h-12 w-12 text-primary" />
      <h1 className="mt-4 font-serif text-2xl text-foreground">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button variant="outline" asChild>
          <Link href="/">Anasayfa</Link>
        </Button>
      </div>
    </div>
  );
}
