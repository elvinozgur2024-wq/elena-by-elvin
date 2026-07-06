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
