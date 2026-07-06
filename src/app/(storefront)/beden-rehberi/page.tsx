import type { Metadata } from "next";
import { SizeGuideContent } from "@/components/storefront/size-guide-content";

export const metadata: Metadata = {
  title: "Beden Rehberi",
  description:
    "Elena By Elvin peluş oyuncakları için boy ve ölçü rehberi — Küçük, Orta ve Büyük boy seçenekleri.",
  alternates: { canonical: "/beden-rehberi" },
};

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Beden Rehberi
      </h1>
      <div className="mt-6">
        <SizeGuideContent />
      </div>
    </div>
  );
}
