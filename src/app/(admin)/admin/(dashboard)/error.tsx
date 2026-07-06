"use client";

import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <WarningCircle className="h-10 w-10 text-primary" />
      <h1 className="mt-4 font-serif text-xl text-foreground">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Veriler yüklenirken bir sorun oluştu.
      </p>
      <Button onClick={reset} className="mt-6">
        Tekrar Dene
      </Button>
    </div>
  );
}
