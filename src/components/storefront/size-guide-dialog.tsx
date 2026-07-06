"use client";

import { Ruler } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SizeGuideContent } from "@/components/storefront/size-guide-content";

export function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
          <Ruler className="h-4 w-4" />
          Beden Rehberi
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Beden Rehberi</DialogTitle>
        </DialogHeader>
        <SizeGuideContent />
      </DialogContent>
    </Dialog>
  );
}
