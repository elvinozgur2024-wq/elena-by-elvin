"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/format";
import type { ActionResult } from "@/actions/auth";
import type { Category, CategoryTint } from "@/types/database.types";

const initialState: ActionResult = {};

const TINTS: { value: CategoryTint; label: string }[] = [
  { value: "blush", label: "Pudra Pembe" },
  { value: "sage", label: "Adaçayı Yeşili" },
  { value: "butter", label: "Tereyağı Sarısı" },
  { value: "sky", label: "Gök Mavisi" },
  { value: "lavender", label: "Lavanta" },
  { value: "mint", label: "Nane Yeşili" },
];

export function CategoryForm({
  action,
  category,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  category?: Category;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="cat_name">Ad</Label>
        <Input
          id="cat_name"
          name="name"
          required
          defaultValue={category?.name}
          className="mt-1.5"
          onChange={(e) => {
            const slugInput = document.getElementById(
              "cat_slug",
            ) as HTMLInputElement | null;
            if (slugInput && !slugInput.dataset.touched) {
              slugInput.value = slugify(e.target.value);
            }
          }}
        />
      </div>
      <div>
        <Label htmlFor="cat_slug">Slug</Label>
        <Input
          id="cat_slug"
          name="slug"
          required
          defaultValue={category?.slug}
          className="mt-1.5"
          onChange={(e) => {
            e.target.dataset.touched = "true";
          }}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="cat_description">Açıklama</Label>
        <Input
          id="cat_description"
          name="description"
          defaultValue={category?.description ?? undefined}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="cat_tint">Renk Tonu</Label>
        <Select name="tint" defaultValue={category?.tint ?? "blush"}>
          <SelectTrigger className="mt-1.5 w-full" id="cat_tint">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TINTS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="cat_sort_order">Sıralama</Label>
        <Input
          id="cat_sort_order"
          name="sort_order"
          type="number"
          defaultValue={category?.sort_order ?? 0}
          className="mt-1.5"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive sm:col-span-2">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2 w-fit">
        {pending ? "Kaydediliyor..." : category ? "Güncelle" : "Kategori Ekle"}
      </Button>
    </form>
  );
}
