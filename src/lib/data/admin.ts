import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems, ProductWithImages } from "@/types/database.types";

const PRODUCT_SELECT = `
  *,
  product_images ( id, product_id, storage_path, alt_text, sort_order, is_primary ),
  product_variants ( id, product_id, label, sku_suffix, price_delta, stock_quantity, image_id ),
  category:categories ( id, name, slug, description, tint, sort_order, created_at )
`;

export async function getAllProductsAdmin(): Promise<ProductWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as ProductWithImages[];
}

export async function getProductByIdAdmin(
  id: string,
): Promise<ProductWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithImages | null;
}

export async function getOrdersAdmin(): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as OrderWithItems[];
}

export async function getOrderByIdAdmin(
  id: string,
): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as OrderWithItems | null;
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: orderCount }, { data: lowStock }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id, name, stock_quantity")
        .lt("stock_quantity", 5)
        .eq("is_active", true),
    ]);

  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
    lowStockProducts: lowStock ?? [],
  };
}
