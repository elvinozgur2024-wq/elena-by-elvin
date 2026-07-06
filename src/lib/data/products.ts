import { createPublicClient } from "@/lib/supabase/public";
import type { Category, ProductWithImages } from "@/types/database.types";

const PRODUCT_SELECT = `
  *,
  product_images ( id, product_id, storage_path, alt_text, sort_order, is_primary ),
  product_variants ( id, product_id, label, sku_suffix, price_delta, stock_quantity, image_id ),
  category:categories ( id, name, slug, description, tint, sort_order, created_at )
`;

function sortProduct(product: ProductWithImages): ProductWithImages {
  return {
    ...product,
    product_images: [...product.product_images].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
}): Promise<ProductWithImages[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.categorySlug) {
    const category = await getCategoryBySlug(options.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductWithImages[]).map(sortProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithImages | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return sortProduct(data as unknown as ProductWithImages);
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeProductId: string,
  limit = 4,
): Promise<ProductWithImages[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .neq("id", excludeProductId)
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductWithImages[]).map(sortProduct);
}
