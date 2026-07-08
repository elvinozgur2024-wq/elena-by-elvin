const BUCKET = "product-images";

// Bump when product photos are overwritten in place at the SAME storage path
// (e.g. the one-time ML background-removal migration). Appended as ?v= so the
// CDN, Next image optimizer, and browsers fetch the new bytes instead of a
// stale cached copy. New admin uploads land on fresh UUID paths and don't
// rely on this.
export const PRODUCT_IMAGE_VERSION = "2026-07-08-cutout";

// Builds a public Supabase Storage URL from a stored path. Product photography
// lives in the "product-images" bucket, seeded by scripts/seed.ts.
//
// Reads NEXT_PUBLIC_SUPABASE_URL directly (not via lib/env) because this
// module is imported from Client Components (cart drawer, product gallery) —
// importing the shared `env` object would pull server-only secret validation
// into the browser bundle, where those vars are undefined and validation
// throws.
export function productImageUrl(storagePath: string, version?: string): string {
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
  return version ? `${base}?v=${encodeURIComponent(version)}` : base;
}
