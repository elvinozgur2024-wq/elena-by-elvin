import Image from "next/image";
import Link from "next/link";
import { Gift, Heart, Sparkle, Truck } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/storefront/reveal";
import { WaveDivider } from "@/components/storefront/wave-divider";
import { getCategories, getProducts } from "@/lib/data/products";
import { getSiteContent } from "@/lib/data/site-content";
import { productImageUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

const TINT_CLASS: Record<string, string> = {
  blush: "bg-tint-blush",
  sage: "bg-tint-sage",
  butter: "bg-tint-butter",
  sky: "bg-tint-sky",
  lavender: "bg-tint-lavender",
  mint: "bg-tint-mint",
};

// ISR: rebuild in the background at most once an hour instead of hitting
// Supabase on every request — meaningfully better TTFB for SEO/Core Web
// Vitals on a page that doesn't need per-visitor auth state.
export const revalidate = 3600;

export default async function HomePage() {
  // One catalog query (newest first) feeds both rows: the curated
  // "Öne Çıkanlar" grid and the automatic "Yeni Gelenler" row.
  const [categories, allProducts, content] = await Promise.all([
    getCategories(),
    getProducts(),
    getSiteContent(),
  ]);

  const featured = allProducts.filter((p) => p.is_featured);
  const products = featured.length > 0 ? featured : allProducts;
  const featuredRow = products.slice(0, 8);
  const shownIds = new Set(featuredRow.map((p) => p.id));
  const newArrivals = allProducts.filter((p) => !shownIds.has(p.id)).slice(0, 4);

  const heroImageSrc = content.hero_image_path
    ? `${productImageUrl(content.hero_image_path)}?v=${encodeURIComponent(content.updated_at)}`
    : "/marketing/hero-whale.jpg";
  const giftImageSrc = content.gift_image_path
    ? `${productImageUrl(content.gift_image_path)}?v=${encodeURIComponent(content.updated_at)}`
    : "/marketing/gift-box.jpg";

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <span className="inline-block rounded-full bg-tint-blush px-3 py-1 text-xs font-medium tracking-wide text-mocha uppercase">
              {content.hero_badge}
            </span>
            <h1 className="mt-4 font-serif text-3xl leading-[1.15] text-foreground sm:text-4xl">
              {content.hero_headline}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.hero_subheadline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/magaza">Koleksiyonu Keşfet</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="animate-float-soft relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-tint-lavender lg:mx-auto lg:max-w-[420px]">
              <Image
                src={heroImageSrc}
                alt={content.hero_headline}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category grid — full-width blush band with wavy edges */}
      <section className="mt-12 lg:mt-16">
        <WaveDivider position="top" className="text-wash-blush" />
        <div className="bg-wash-blush">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <Reveal>
              <div className="flex items-end justify-between">
                <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                  Kategoriler
                </h2>
                <Link
                  href="/magaza"
                  className="text-sm text-primary hover:underline"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {categories.map((category) =>
                  category.image_path ? (
                    <Link
                      key={category.id}
                      href={`/magaza/${category.slug}`}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-3xl transition-transform hover:scale-[1.02]",
                        TINT_CLASS[category.tint],
                      )}
                    >
                      <Image
                        src={productImageUrl(category.image_path)}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                      />
                      <span className="absolute inset-x-0 bottom-3 flex justify-center">
                        <span className="rounded-full bg-white/85 px-3.5 py-1.5 font-serif text-sm text-mocha shadow-sm backdrop-blur-sm sm:text-base">
                          {category.name}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <Link
                      key={category.id}
                      href={`/magaza/${category.slug}`}
                      className={cn(
                        "group flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center transition-transform hover:scale-[1.02]",
                        TINT_CLASS[category.tint],
                      )}
                    >
                      <Sparkle className="h-6 w-6 text-mocha/70" />
                      <span className="font-serif text-sm text-mocha sm:text-base">
                        {category.name}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </div>
        <WaveDivider position="bottom" className="text-wash-blush" />
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              Öne Çıkanlar
            </h2>
            <Link href="/magaza" className="text-sm text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredRow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* New arrivals — automatic: newest products not already shown above,
          on a full-width sky band with wavy edges */}
      {newArrivals.length > 0 ? (
        <section className="mt-10 lg:mt-14">
          <WaveDivider position="top" className="text-wash-sky" />
          <div className="bg-wash-sky">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
              <Reveal>
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                    Yeni Gelenler
                  </h2>
                  <Link
                    href="/magaza"
                    className="text-sm text-primary hover:underline"
                  >
                    Tümünü Gör
                  </Link>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} newBadge />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
          <WaveDivider position="bottom" className="text-wash-sky" />
        </section>
      ) : null}

      {/* Brand story teaser — excerpt of /hakkimizda */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[2.5rem] bg-tint-blush lg:grid-cols-2">
            <div className="order-2 p-8 lg:order-1 lg:p-12">
              <span className="text-[11px] uppercase tracking-[0.14em] text-primary">
                Hikâyemiz
              </span>
              <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
                Dünden Bugüne Bir Sevgi Hikâyesi
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Elena, bir annenin çocukluk anılarından bugünün çocuklarına
                uzanan sıcacık bir sevgi hikâyesinden doğdu…
              </p>
              <Button className="mt-6" variant="outline" asChild>
                <Link href="/hakkimizda">Hikâyemizi Okuyun</Link>
              </Button>
            </div>
            <div className="relative order-1 aspect-[4/3] w-full lg:order-2 lg:aspect-auto lg:h-full lg:min-h-[360px]">
              <Image
                src="/marketing/kid-stars.jpg"
                alt="Elena peluş yıldız oyuncağıyla oynayan çocuk"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Gift strip */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[2.5rem] bg-tint-butter lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[360px]">
              <Image
                src={giftImageSrc}
                alt={content.gift_headline}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 lg:p-12">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-mocha">
                <Gift className="h-4 w-4" /> {content.gift_badge}
              </span>
              <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
                {content.gift_headline}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {content.gift_body}
              </p>
              <Button className="mt-6" asChild>
                <Link href="/magaza">Hediye Seç</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Trust badges */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                750₺ Üzeri Ücretsiz Kargo
              </p>
              <p className="text-xs text-muted-foreground">Türkiye geneli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Bebek Güvenli Kumaşlar
              </p>
              <p className="text-xs text-muted-foreground">
                Yumuşak ve dayanıklı
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Hediye Paketi Seçeneği
              </p>
              <p className="text-xs text-muted-foreground">
                Kişisel not ekleyin
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
