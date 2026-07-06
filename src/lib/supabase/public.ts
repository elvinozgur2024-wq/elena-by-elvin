import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free client for public, unauthenticated reads (product/category
// browsing, sitemap generation). Unlike lib/supabase/server.ts, this never
// calls next/headers' cookies(), so pages using it can be statically
// rendered / ISR'd instead of forced into fully dynamic rendering — meaningfully
// better TTFB for SEO and Core Web Vitals on pages that don't need auth state.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
