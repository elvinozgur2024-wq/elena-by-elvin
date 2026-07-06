import { createBrowserClient } from "@supabase/ssr";

// Reads NEXT_PUBLIC_* vars directly rather than importing lib/env — this
// runs in the browser, and lib/env also validates server-only secrets that
// are undefined on the client.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
