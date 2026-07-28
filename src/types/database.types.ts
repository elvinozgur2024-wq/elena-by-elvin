// Hand-authored to match supabase/migrations/0001_init_schema.sql.
// Once the Supabase project is live, regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export type CategoryTint = "blush" | "sage" | "butter" | "sky" | "lavender" | "mint";

export type CustomerRole = "customer" | "admin";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tint: CategoryTint;
  sort_order: number;
  image_path: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  base_price: number;
  compare_at_price: number | null;
  sku: string;
  stock_quantity: number;
  size: string | null;
  care_instructions: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  sku_suffix: string;
  price_delta: number;
  stock_quantity: number;
  image_id: string | null;
}

export interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: CustomerRole;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string | null;
  address_line: string;
  postal_code: string | null;
  is_default: boolean;
}

export interface ShippingAddressSnapshot {
  full_name: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string | null;
  address_line: string;
  postal_code: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  subtotal: number;
  gift_wrap_fee: number;
  shipping_fee: number;
  total: number;
  is_gift_wrapped: boolean;
  gift_note: string | null;
  shipping_address: ShippingAddressSnapshot;
  billing_address: ShippingAddressSnapshot | null;
  iyzico_payment_id: string | null;
  iyzico_conversation_id: string | null;
  iyzico_token: string | null;
  payment_raw_response: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_label: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  product_image_path: string | null;
}

export interface SiteContent {
  id: true;
  hero_badge: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_image_path: string | null;
  gift_badge: string;
  gift_headline: string;
  gift_body: string;
  gift_image_path: string | null;
  updated_at: string;
}

// Convenience joined shapes used throughout the storefront/admin
export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  category: Category | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}
