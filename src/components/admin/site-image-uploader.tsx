"use client";

import Image from "next/image";
import { useRef, useTransition } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { productImageUrl } from "@/lib/supabase/storage";
import { uploadSiteImage } from "@/actions/admin-site-content";
import { toast } from "sonner";

export function SiteImageUploader({
  field,
  imagePath,
  updatedAt,
  label,
}: {
  field: "hero_image_path" | "gift_image_path";
  imagePath: string | null;
  updatedAt: string;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File | null) {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      try {
        await uploadSiteImage(field, formData);
        toast.success("Görsel güncellendi");
      } catch {
        toast.error("Görsel yüklenemedi");
      }
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative aspect-video w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-dashed border-border bg-secondary"
      >
        {imagePath ? (
          <Image
            src={`${productImageUrl(imagePath)}?v=${encodeURIComponent(updatedAt)}`}
            alt={label}
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <UploadSimple className="h-5 w-5" />
            Varsayılan görsel kullanılıyor
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/30 hover:opacity-100">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground">
            {isPending ? "Yükleniyor..." : "Değiştir"}
          </span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
