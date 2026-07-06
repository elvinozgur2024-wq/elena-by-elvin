-- Atomic stock decrements, called from the iyzico callback route after a
-- payment is confirmed. Using RPCs (rather than read-then-write from the
-- app) avoids a race condition between two concurrent successful payments
-- for the last unit of stock.

create function public.decrement_product_stock(product_id uuid, qty int)
returns void
language sql
security definer set search_path = public
as $$
  update products
  set stock_quantity = greatest(stock_quantity - qty, 0)
  where id = product_id;
$$;

create function public.decrement_variant_stock(variant_id uuid, qty int)
returns void
language sql
security definer set search_path = public
as $$
  update product_variants
  set stock_quantity = greatest(stock_quantity - qty, 0)
  where id = variant_id;
$$;

-- Both functions run as SECURITY DEFINER so they can be safely called by the
-- service-role key from the callback route; they are not exposed for public
-- RPC use beyond that (no execute grant needed for anon since the route uses
-- the service role, which bypasses grants entirely).
revoke execute on function public.decrement_product_stock(uuid, int) from anon, authenticated;
revoke execute on function public.decrement_variant_stock(uuid, int) from anon, authenticated;
