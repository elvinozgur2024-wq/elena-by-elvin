# Elena By Elvin

Full-stack e-commerce site for Elena By Elvin (legal entity: Elena Babywear Tekstil San. ve Tic. Ltd. Şti.) — Next.js (App Router) + Supabase + iyzico.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack) + TypeScript + Tailwind CSS + shadcn/ui
- **Supabase** — Postgres database, auth, storage
- **iyzico** — Turkish payment gateway (Checkout Form / hosted page integration)
- **Zustand** — client-side cart

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the three migration files in order (or use the Supabase CLI):
   - `supabase/migrations/0001_init_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_stock_functions.sql`
3. From **Project Settings → API**, copy the Project URL, `anon` key, and `service_role` key.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from step 2.
- `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` — get free sandbox test credentials at [sandbox-merchant.iyzipay.com](https://sandbox-merchant.iyzipay.com). Leave `IYZICO_BASE_URL` as the sandbox URL until you're ready to go live.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials for the first admin account (created by the seed script below).

## 4. Seed the database

Populates categories, ~10 real products (photographed catalog from `.claude/`), and the first admin account:

```bash
npm run seed
```

Log into `/admin/giris` with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set.

## 5. Run the dev server

```bash
npm run dev
```

Storefront: [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Managing the catalog

Once logged into `/admin`, you can add, edit, and delete products, categories, and view/update orders — no code changes needed. Upload product photos directly in the product editor; images are automatically resized and converted to WebP.

## Going live checklist

Before taking real payments, make sure to:

- [ ] Swap sandbox iyzico credentials for your real merchant account (`IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL=https://api.iyzipay.com`), and set `NEXT_PUBLIC_PAYMENTS_LIVE=true` to hide the test-mode banner.
- [ ] Collect a real **TC Kimlik No** (Turkish national ID) at checkout and pass it through to iyzico in `src/app/api/iyzico/checkout/route.ts` — currently a placeholder value is used, which iyzico only accepts in sandbox.
- [ ] Review and finalize the legal pages (`/kvkk`, `/gizlilik-politikasi`, `/mesafeli-satis-sozlesmesi`, `/kargo-ve-iade`) with your own counsel — the current text is a reasonable starting template, not legal advice.
- [ ] Point `NEXT_PUBLIC_SITE_URL` at your production domain (used for iyzico callback URLs).
- [ ] Deploy (Vercel recommended for Next.js) and add the same environment variables there.

## Project structure

```
src/
  app/
    (storefront)/    Public site — home, shop, product, cart, checkout, account, legal pages
    (admin)/admin/    Admin panel — products, categories, orders (auth-gated)
    api/iyzico/       Payment initiation + callback routes
  actions/            Server Actions (auth, checkout data, admin CRUD)
  components/         storefront/, admin/, shared/, ui/ (shadcn)
  lib/                Supabase clients, cart store, validation schemas, formatting
  types/              Hand-authored database types (regenerate via Supabase CLI once live)
supabase/migrations/  SQL schema + RLS policies
scripts/seed.ts       Seeds categories/products/admin user from real photos in .claude/
```
