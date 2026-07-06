-- Elena Babywear — initial schema
-- Run via: npx supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  tint text not null default 'blush' check (tint in ('blush', 'sage', 'butter', 'sky', 'lavender')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  category_id uuid references categories(id) on delete set null,
  base_price numeric(10, 2) not null check (base_price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price >= 0),
  sku text not null unique,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  size text,
  care_instructions text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products(category_id);
create index products_is_active_idx on products(is_active);

-- ---------- product_images ----------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);

create index product_images_product_id_idx on product_images(product_id);

-- ---------- product_variants ----------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  sku_suffix text not null,
  price_delta numeric(10, 2) not null default 0,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  image_id uuid references product_images(id) on delete set null
);

create index product_variants_product_id_idx on product_variants(product_id);

-- ---------- customers (extends auth.users) ----------
create table customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a customers row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.customers (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- addresses ----------
create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  city text not null,
  district text not null,
  neighborhood text,
  address_line text not null,
  postal_code text,
  is_default boolean not null default false
);

create index addresses_customer_id_idx on addresses(customer_id);

-- ---------- orders ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  guest_email text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'failed')),
  subtotal numeric(10, 2) not null default 0,
  gift_wrap_fee numeric(10, 2) not null default 0,
  shipping_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  is_gift_wrapped boolean not null default false,
  gift_note text,
  shipping_address jsonb not null,
  billing_address jsonb,
  iyzico_payment_id text,
  iyzico_conversation_id text,
  payment_raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_id_idx on orders(customer_id);
create index orders_status_idx on orders(status);
create index orders_conversation_id_idx on orders(iyzico_conversation_id);

-- ---------- order_items ----------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  variant_label text,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null,
  product_image_path text
);

create index order_items_order_id_idx on order_items(order_id);

-- ---------- contact_messages ----------
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

-- ---------- updated_at trigger ----------
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on products
  for each row execute procedure public.set_updated_at();

create trigger orders_set_updated_at
  before update on orders
  for each row execute procedure public.set_updated_at();
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
