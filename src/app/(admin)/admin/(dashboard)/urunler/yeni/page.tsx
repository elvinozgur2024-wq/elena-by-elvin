import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data/products";
import { createProduct } from "@/actions/admin-products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">Yeni Ürün</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
