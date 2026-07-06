import { notFound } from "next/navigation";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { ProductForm } from "@/components/admin/product-form";
import { ImageUploader } from "@/components/admin/image-uploader";
import { VariantManager } from "@/components/admin/variant-manager";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/data/products";
import { getProductByIdAdmin } from "@/lib/data/admin";
import { deleteProduct, updateProduct } from "@/actions/admin-products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductByIdAdmin(id),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">{product.name}</h1>
        <form
          action={async () => {
            "use server";
            await deleteProduct(id);
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-destructive hover:underline"
          >
            <Trash className="h-4 w-4" /> Ürünü Sil
          </button>
        </form>
      </div>

      <section className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg text-foreground">Görseller</h2>
        <div className="mt-4">
          <ImageUploader productId={id} images={product.product_images} />
        </div>
      </section>

      <section className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg text-foreground">Seçenekler (Varyantlar)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Renk, kız/erkek gibi seçenekleri buradan yönetin. Seçenek eklemezseniz
          ürün, yukarıdaki stok adedini doğrudan kullanır.
        </p>
        <div className="mt-4">
          <VariantManager productId={id} variants={product.product_variants} />
        </div>
      </section>

      <Separator className="my-6 max-w-2xl" />

      <section className="max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg text-foreground">Ürün Bilgileri</h2>
        <div className="mt-4">
          <ProductForm action={boundUpdate} categories={categories} product={product} />
        </div>
      </section>
    </div>
  );
}
