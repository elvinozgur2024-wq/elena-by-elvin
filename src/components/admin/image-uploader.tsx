"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Star, Trash, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { productImageUrl, PRODUCT_IMAGE_VERSION } from "@/lib/supabase/storage";
import {
  deleteProductImage,
  setPrimaryImage,
  uploadProductImage,
} from "@/actions/admin-products";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/database.types";
import { toast } from "sonner";

export function ImageUploader({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const [removeBg, setRemoveBg] = useState(true);

  const [status, setStatus] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const shouldRemoveBg = removeBg;
    startTransition(async () => {
      // Load the ML background remover lazily (it pulls a ~40MB WASM model on
      // first use) so it never weighs down the rest of the admin panel, and
      // only when the option is actually enabled for this batch.
      const removeBackground = shouldRemoveBg
        ? (await import("@imgly/background-removal")).removeBackground
        : null;

      for (const file of Array.from(files)) {
        let uploadFile = file;

        if (removeBackground) {
          try {
            setStatus(`"${file.name}" arka planı kaldırılıyor...`);
            const cutout = await removeBackground(file, {
              output: { format: "image/png" },
            });
            uploadFile = new File(
              [cutout],
              file.name.replace(/\.[^.]+$/, ".png"),
              { type: "image/png" },
            );
          } catch (bgError) {
            // Some photos trip up the ML model (very large files, unusual
            // compression, etc.) — fall back to the original rather than
            // blocking the upload entirely.
            console.error("Background removal failed for", file.name, bgError);
            toast.warning(
              `"${file.name}" için arka plan kaldırılamadı, orijinal görsel yüklendi.`,
            );
          }
        }

        try {
          setStatus(`"${file.name}" yükleniyor...`);
          const formData = new FormData();
          formData.set("file", uploadFile);
          await uploadProductImage(productId, formData);
        } catch (uploadError) {
          console.error("Upload failed for", file.name, uploadError);
          toast.error(`"${file.name}" yüklenemedi`);
        }
      }
      setStatus(null);
    });
  }

  return (
    <div>
      <label className="mb-3 flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
        <Checkbox
          className="mt-0.5"
          checked={removeBg}
          onCheckedChange={(checked) => setRemoveBg(checked === true)}
        />
        <span>
          Arka planı otomatik kaldır
          <span className="block text-xs text-muted-foreground/80">
            İşaretliyse yüklenen görsel kesilip arka planı şeffaf hale
            getirilir. İşaretli değilse görsel olduğu gibi yüklenir.
          </span>
        </span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-primary bg-secondary" : "border-border",
        )}
      >
        <UploadSimple className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isPending
            ? (status ?? "Yükleniyor...")
            : "Görsel yüklemek için tıklayın veya sürükleyin"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-white"
            >
              <Image
                src={productImageUrl(image.storage_path, PRODUCT_IMAGE_VERSION)}
                alt={image.alt_text ?? ""}
                fill
                sizes="150px"
                className="object-contain p-1"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon-sm"
                  variant={image.is_primary ? "default" : "secondary"}
                  onClick={() => setPrimaryImage(image.id, productId)}
                  aria-label="Ana görsel yap"
                  type="button"
                >
                  <Star className="h-3.5 w-3.5" weight={image.is_primary ? "fill" : "regular"} />
                </Button>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => deleteProductImage(image.id, productId)}
                  aria-label="Sil"
                  type="button"
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
              {image.is_primary ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  Ana
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
