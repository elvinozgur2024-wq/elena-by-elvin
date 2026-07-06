import { CategoryForm } from "@/components/admin/category-form";
import { CategoryList } from "@/components/admin/category-list";
import { getCategories } from "@/lib/data/products";
import { createCategory } from "@/actions/admin-categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">Kategoriler</h1>

      <div className="mt-6 max-w-2xl">
        <CategoryList categories={categories} />
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border border-dashed border-border p-6">
        <h2 className="font-serif text-base text-foreground">
          Yeni Kategori Ekle
        </h2>
        <div className="mt-4">
          <CategoryForm action={createCategory} />
        </div>
      </div>
    </div>
  );
}
