"use client";

import { useState } from "react";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { deleteCategory, updateCategory } from "@/actions/admin-categories";
import type { Category } from "@/types/database.types";

const TINT_CLASS: Record<string, string> = {
  blush: "bg-tint-blush",
  sage: "bg-tint-sage",
  butter: "bg-tint-butter",
  sky: "bg-tint-sky",
  lavender: "bg-tint-lavender",
};

export function CategoryList({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);

  return (
    <>
      <ul className="flex flex-col gap-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-6 w-6 rounded-full ${TINT_CLASS[category.tint]}`}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {category.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  /magaza/{category.slug}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing(category)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Düzenle"
              >
                <PencilSimple className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Sil"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi Düzenle</DialogTitle>
          </DialogHeader>
          {editing ? (
            <CategoryForm
              action={updateCategory.bind(null, editing.id)}
              category={editing}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
