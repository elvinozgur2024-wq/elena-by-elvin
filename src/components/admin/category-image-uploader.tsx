"use client";

import Image from "next/image";
import { useRef, useTransition } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { productImageUrl } from "@/lib/supabase/storage";
import { uploadCategoryImage } from "@/actions/admin-categories";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Category, CategoryTint } from "@/types/database.types";

const TINT_CLASS: Record<CategoryTint, string> = {
  blush: "bg-tint-blush",
  sage: "bg-tint-sage",
  butter: "bg-tint-butter",
  sky: "bg-tint-sky",
  lavender: "bg-tint-lavender",
  mint: "bg-tint-mint",
};

/**
 * Square thumbnail + click-to-replace uploader for a category's photo,
 * shown on the homepage category grid. Falls back to the tint swatch
 * while no photo is set.
 */
export function CategoryImageUploader({ category }: { category: Category }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File | null) {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      try {
        await uploadCategoryImage(category.id, formData);
        toast.success("Kategori görseli güncellendi");
      } catch {
        toast.error("Görsel yüklenemedi");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={`${category.name} için görsel yükle`}
        title="Kategori görseli yükle"
        className={cn(
          "group relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border",
          TINT_CLASS[category.tint],
        )}
      >
        {category.image_path ? (
          <Image
            src={productImageUrl(category.image_path)}
            alt={category.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : null}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/0 text-white transition group-hover:bg-black/35",
            isPending
              ? "bg-black/35 opacity-100"
              : "opacity-0 group-hover:opacity-100",
          )}
        >
          <UploadSimple
            className={cn("h-4 w-4", isPending && "animate-pulse")}
          />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </>
  );
}
