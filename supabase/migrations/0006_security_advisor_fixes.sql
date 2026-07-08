-- Resolves Supabase Security Advisor findings.
--
-- Summary of what each block fixes and why it's safe:
--   1. set_updated_at(): pin search_path (was the only function missing it).
--   2. Stock RPCs: they are SECURITY DEFINER and were still executable by
--      anon/authenticated via the default PUBLIC grant (0003 only revoked from
--      anon/authenticated, not PUBLIC, so membership in PUBLIC still leaked
--      access). Anyone could call /rest/v1/rpc/decrement_*_stock and zero out
--      inventory. Lock execute down to service_role, which is the only caller
--      (the iyzico callback uses the service-role key).
--   3. handle_new_user(): a trigger function that never needs to be a public
--      RPC. Revoke execute from PUBLIC — the on_auth_user_created trigger still
--      fires (trigger execution does not check EXECUTE on the caller).
--   4. contact_messages insert: replace WITH CHECK (true) with real bounds so
--      the policy isn't "always true" and empty/oversized spam is rejected at
--      the DB. Anonymous submits from the contact form still pass.
--   5. product-images bucket: drop the broad SELECT policy that let clients
--      LIST every file. Public object URLs keep working (public buckets serve
--      objects without a SELECT policy); only enumeration is removed.
--
-- Not changed here: is_admin() is still reported as a public/authenticated
-- SECURITY DEFINER function, but it must stay executable by anon+authenticated
-- because the RLS policies reference it, and it must stay SECURITY DEFINER to
-- avoid infinite recursion on the customers table. It only ever returns the
-- caller's own admin boolean, so it is safe to dismiss in the advisor. Moving
-- it to a non-exposed schema is a possible follow-up if a clean report matters.

-- 1. Function search_path ------------------------------------------------------
alter function public.set_updated_at() set search_path = public;

-- 2. Stock RPCs: service_role only --------------------------------------------
revoke execute on function public.decrement_product_stock(uuid, int) from public;
revoke execute on function public.decrement_variant_stock(uuid, int) from public;
grant execute on function public.decrement_product_stock(uuid, int) to service_role;
grant execute on function public.decrement_variant_stock(uuid, int) to service_role;

-- 3. Trigger helper: not a public RPC -----------------------------------------
revoke execute on function public.handle_new_user() from public;

-- 4. Tighten the contact_messages insert policy -------------------------------
drop policy if exists "contact_messages_public_insert" on contact_messages;
create policy "contact_messages_public_insert" on contact_messages
  for insert
  with check (
    char_length(name) between 2 and 200
    and char_length(email) between 3 and 320
    and position('@' in email) > 1
    and char_length(message) between 10 and 10000
  );

-- 5. Storage: stop bucket file listing ----------------------------------------
drop policy if exists "product_images_bucket_public_read" on storage.objects;
