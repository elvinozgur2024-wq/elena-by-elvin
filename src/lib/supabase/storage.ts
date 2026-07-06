const BUCKET = "product-images";

// Builds a public Supabase Storage URL from a stored path. Product photography
// lives in the "product-images" bucket, seeded by scripts/seed.ts.
//
// Reads NEXT_PUBLIC_SUPABASE_URL directly (not via lib/env) because this
// module is imported from Client Components (cart drawer, product gallery) —
// importing the shared `env` object would pull server-only secret validation
// into the browser bundle, where those vars are undefined and validation
// throws.
export function productImageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
