"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/format";
import type { ActionResult } from "@/actions/auth";
import type { Category, Product } from "@/types/database.types";

const initialState: ActionResult = {};

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  categories: Category[];
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Ürün Adı</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            className="mt-1.5"
            onChange={(e) => {
              const slugInput = document.getElementById(
                "slug",
              ) as HTMLInputElement | null;
              if (slugInput && !slugInput.dataset.touched) {
                slugInput.value = slugify(e.target.value);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            defaultValue={product?.slug}
            className="mt-1.5"
            onChange={(e) => {
              e.target.dataset.touched = "true";
            }}
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            required
            defaultValue={product?.sku}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <Select name="category_id" defaultValue={product?.category_id ?? undefined}>
            <SelectTrigger className="mt-1.5 w-full" id="category_id">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="base_price">Fiyat (₺)</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.base_price}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="compare_at_price">İndirim Öncesi Fiyat (₺, opsiyonel)</Label>
          <Input
            id="compare_at_price"
            name="compare_at_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.compare_at_price ?? undefined}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="stock_quantity">Stok Adedi</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            required
            defaultValue={product?.stock_quantity ?? 0}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="size">Boy (ör. Orta (M) — 30 cm)</Label>
          <Input
            id="size"
            name="size"
            defaultValue={product?.size ?? undefined}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="short_description">Kısa Açıklama</Label>
        <Textarea
          id="short_description"
          name="short_description"
          rows={2}
          defaultValue={product?.short_description ?? undefined}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="description">Ürün Açıklaması</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product?.description ?? undefined}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="care_instructions">Bakım Önerileri</Label>
        <Textarea
          id="care_instructions"
          name="care_instructions"
          rows={3}
          defaultValue={product?.care_instructions ?? undefined}
          className="mt-1.5"
        />
      </div>

      <div className="flex gap-8">
        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <Switch name="is_active" defaultChecked={product?.is_active ?? true} />
          Aktif (mağazada görünsün)
        </label>
        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <Switch name="is_featured" defaultChecked={product?.is_featured ?? false} />
          Öne Çıkan
        </label>
      </div>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? "Kaydediliyor..." : product ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
      </Button>
    </form>
  );
}
