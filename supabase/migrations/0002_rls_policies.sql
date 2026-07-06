-- Elena Babywear — Row Level Security policies
-- Defense-in-depth: most writes go through Server Actions using the service-role
-- key (which bypasses RLS), but RLS still protects against direct client access
-- and buggy code paths.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;

-- Helper: is the current user an admin?
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from customers where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- categories: public read, admin write ----------
create policy "categories_public_read" on categories
  for select using (true);

create policy "categories_admin_write" on categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- products: public read active only, admin full ----------
create policy "products_public_read_active" on products
  for select using (is_active = true or public.is_admin());

create policy "products_admin_write" on products
  for insert with check (public.is_admin());

create policy "products_admin_update" on products
  for update using (public.is_admin()) with check (public.is_admin());

create policy "products_admin_delete" on products
  for delete using (public.is_admin());

-- ---------- product_images: public read, admin write ----------
create policy "product_images_public_read" on product_images
  for select using (true);

create policy "product_images_admin_write" on product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- product_variants: public read, admin write ----------
create policy "product_variants_public_read" on product_variants
  for select using (true);

create policy "product_variants_admin_write" on product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- customers: self read/update, admin full read ----------
create policy "customers_self_select" on customers
  for select using (id = auth.uid() or public.is_admin());

create policy "customers_self_update" on customers
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------- addresses: owner only, admin read ----------
create policy "addresses_owner_all" on addresses
  for all using (customer_id = auth.uid()) with check (customer_id = auth.uid());

create policy "addresses_admin_read" on addresses
  for select using (public.is_admin());

-- ---------- orders: owner read, admin full ----------
-- Inserts/updates happen server-side via the service-role key (checkout
-- creation, iyzico callback, admin status changes), so no public insert/update
-- policy is defined here on purpose.
create policy "orders_owner_read" on orders
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "orders_admin_update" on orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------- order_items: readable via parent order ownership ----------
create policy "order_items_owner_read" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

-- ---------- contact_messages: anyone can insert, admin can read ----------
create policy "contact_messages_public_insert" on contact_messages
  for insert with check (true);

create policy "contact_messages_admin_read" on contact_messages
  for select using (public.is_admin());

-- ---------- Storage: product-images bucket ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_bucket_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
