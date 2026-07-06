// Seeds a fresh Supabase project with real Elena Babywear product photography
// and a working admin login, so the client can log into /admin and start
// managing their real catalog immediately after the migrations are applied.
//
// Usage: npm run seed   (requires .env.local — see .env.example)

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@elenababywear.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error("Missing SEED_ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Source images live in .claude/ at the project root — real product
// photography the client provided when the site was commissioned.
const ASSETS_DIR = path.join(process.cwd(), ".claude");

interface SeedImage {
  file: string;
  alt: string;
}

interface SeedVariant {
  label: string;
  sku_suffix: string;
  price_delta: number;
  stock_quantity: number;
  image?: SeedImage;
}

interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  short_description: string;
  description: string;
  base_price: number;
  compare_at_price?: number;
  sku: string;
  stock_quantity: number;
  size: string;
  care_instructions: string;
  is_featured: boolean;
  images: SeedImage[];
  variants?: SeedVariant[];
}

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  tint: "blush" | "sage" | "butter" | "sky" | "lavender";
  sort_order: number;
}

const CATEGORIES: SeedCategory[] = [
  {
    name: "Ayılar ve Hayvanlar",
    slug: "ayilar-ve-hayvanlar",
    description: "Sarılması en tatlı orman ve hayvanat bahçesi dostları.",
    tint: "butter" as const,
    sort_order: 1,
  },
  {
    name: "Deniz Canlıları",
    slug: "deniz-canlilari",
    description: "Okyanusun en yumuşak sakinleri.",
    tint: "sky" as const,
    sort_order: 2,
  },
  {
    name: "Doğa & Fantastik",
    slug: "doga-fantastik",
    description: "Yıldızlardan dinozorlara, hayal gücünü besleyen dostlar.",
    tint: "sage" as const,
    sort_order: 3,
  },
  {
    name: "Mutfak Serisi",
    slug: "mutfak-serisi",
    description: "Lezzetli görünümlü, sarılması bir o kadar keyifli peluşlar.",
    tint: "blush" as const,
    sort_order: 4,
  },
  {
    name: "Uyku Arkadaşları",
    slug: "uyku-arkadaslari",
    description: "Bebeğinizin uyku ve oyun saatlerine eşlik eden yumuşak arkadaşlar.",
    tint: "lavender" as const,
    sort_order: 5,
  },
  {
    name: "Anahtarlıklar",
    slug: "anahtarliklar",
    description: "Çantanıza sevimlilik katan minik peluş anahtarlıklar.",
    tint: "sky" as const,
    sort_order: 6,
  },
];

const PRODUCTS: SeedProduct[] = [
  {
    name: "Kahverengi Ayı Peluş",
    slug: "kahverengi-ayi-pelus",
    categorySlug: "ayilar-ve-hayvanlar",
    short_description: "Yuvarlak hatları ve pembe yanaklarıyla sarılmaya hazır.",
    description:
      "Yumuşacık kahverengi tüyü ve tatlı gülümsemesiyle bu ayıcık, ilk sarılma anlarınızda bebeğinizin en sadık dostu olacak. Hipoalerjenik, bebek güvenli kumaştan üretilmiştir.",
    base_price: 349,
    sku: "EB-AYI-001",
    stock_quantity: 25,
    size: "Orta (M) — 28 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [
      { file: "ayı.jpeg", alt: "Kahverengi ayı peluş oyuncak, önden görünüm" },
      { file: "ayıayakta.jpeg", alt: "Kahverengi ayı peluş oyuncak, ayakta duruş" },
      { file: "yaşlıayı.jpeg", alt: "Kahverengi ayı peluş oyuncak, detay" },
    ],
  },
  {
    name: "Gülümseyen Balina Peluş",
    slug: "gulumseyen-balina-pelus",
    categorySlug: "deniz-canlilari",
    short_description: "Pastel pembe kuyruğuyla okyanusun en sevimli hali.",
    description:
      "Bukle dokulu kumaşı ve kocaman kuyruğuyla bu balina, hem yastık hem oyun arkadaşı olarak kullanılabilir. Büyük boyutuyla kucaklamaya doyum olmuyor.",
    base_price: 389,
    compare_at_price: 449,
    sku: "EB-BAL-001",
    stock_quantity: 18,
    size: "Büyük (L) — 45 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [
      { file: "balinaön.jpeg", alt: "Beyaz balina peluş oyuncak, önden görünüm" },
      { file: "balinayan.jpeg", alt: "Beyaz balina peluş oyuncak, yandan görünüm" },
      { file: "balinadiğeryan.jpeg", alt: "Beyaz balina peluş oyuncak, diğer yan" },
    ],
  },
  {
    name: "Sevimli Kapibara Peluş",
    slug: "sevimli-kapibara-pelus",
    categorySlug: "ayilar-ve-hayvanlar",
    short_description: "Sakin duruşu ve pembe yanaklarıyla yeni gözde.",
    description:
      "Yumuşacık kahverengi tüyleri ve sakin ifadesiyle kapibara, çocukların yeni favori uyku arkadaşı. Kalın dikişleri sayesinde uzun yıllar dayanıklı kullanım sunar.",
    base_price: 329,
    sku: "EB-KAP-001",
    stock_quantity: 20,
    size: "Orta (M) — 26 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: false,
    images: [
      { file: "kapibara.jpeg", alt: "Kapibara peluş oyuncak" },
      { file: "kabibarakalemli.jpeg", alt: "Kapibara peluş kalem kutusu" },
    ],
  },
  {
    name: "Sevimli Panda Peluş",
    slug: "sevimli-panda-pelus",
    categorySlug: "ayilar-ve-hayvanlar",
    short_description: "Kocaman patileri ve tatlı diliyle kucaklama şampiyonu.",
    description:
      "Siyah-beyaz desenli yumuşacık tüyü ve kocaman patileriyle bu panda, odanızın en şirin sakini olacak. Ekstra yumuşak dolgusu sayesinde kucaklamak bir başka keyifli.",
    base_price: 379,
    sku: "EB-PAN-001",
    stock_quantity: 14,
    size: "Büyük (L) — 40 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [{ file: "pandaçıkmamış.jpeg", alt: "Panda peluş oyuncak" }],
  },
  {
    name: "Sarı Civciv Peluş",
    slug: "sari-civciv-pelus",
    categorySlug: "ayilar-ve-hayvanlar",
    short_description: "Küçük patileri ve turuncu gagasıyla bahar müjdecisi.",
    description:
      "Parlak sarı tüyü ve minik turuncu ayaklarıyla bu civciv, en küçük ellere bile uygun boyutuyla ilk oyuncak seçimi için mükemmel.",
    base_price: 259,
    sku: "EB-CIV-001",
    stock_quantity: 22,
    size: "Küçük (S) — 20 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: false,
    images: [
      { file: "civciv1.jpeg", alt: "Sarı civciv peluş oyuncak" },
      { file: "civciv2.jpeg", alt: "Sarı civciv peluş oyuncak, diğer açı" },
    ],
  },
  {
    name: "Kalpli Avokado Peluş",
    slug: "kalpli-avokado-pelus",
    categorySlug: "mutfak-serisi",
    short_description: "Göğsündeki kalple sevgi dolu bir hediye.",
    description:
      "Yeşil tüylü gövdesi ve kalp desenli göbeğiyle bu avokado, hem dekoratif hem de eğlenceli bir oyun arkadaşı. Sevdiklerinize tatlı bir sürpriz olarak da hediye edilebilir.",
    base_price: 269,
    sku: "EB-AVO-001",
    stock_quantity: 30,
    size: "Küçük (S) — 24 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [
      { file: "avokado.jpeg", alt: "Kalpli avokado peluş oyuncak" },
      { file: "avokadoyan.jpeg", alt: "Kalpli avokado peluş oyuncak, yandan" },
    ],
  },
  {
    name: "Kruvasan Peluş Yastık",
    slug: "kruvasan-pelus-yastik",
    categorySlug: "mutfak-serisi",
    short_description: "Sarılması lezzetli, dekoratif bir yastık arkadaşı.",
    description:
      "Altın kahverengi tüyü ve tatlı gülümsemesiyle bu kruvasan, hem oyuncak hem de sevimli bir dekoratif yastık olarak kullanılabilir.",
    base_price: 299,
    sku: "EB-KRU-001",
    stock_quantity: 16,
    size: "Orta (M) — 30 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: false,
    images: [{ file: "kruvasan.jpeg", alt: "Kruvasan peluş yastık" }],
  },
  {
    name: "Renkli Dinozor Peluş",
    slug: "renkli-dinozor-pelus",
    categorySlug: "doga-fantastik",
    short_description: "Üç tatlı renk seçeneğiyle mini bir dinozor dostu.",
    description:
      "Yumuşacık tüylü, kıvrık kuyruklu bu dinozor üç farklı pastel renk seçeneğiyle sunulur. Kapalı gözleriyle huzurlu bir ifadeye sahiptir.",
    base_price: 359,
    sku: "EB-DIN-001",
    stock_quantity: 37,
    size: "Orta (M) — 22 cm",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [{ file: "dinazor.jpeg", alt: "Yeşil dinozor peluş oyuncak" }],
    variants: [
      {
        label: "Yeşil",
        sku_suffix: "GRN",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "dinazor.jpeg", alt: "Yeşil dinozor peluş oyuncak" },
      },
      {
        label: "Beyaz",
        sku_suffix: "WHT",
        price_delta: 0,
        stock_quantity: 10,
        image: { file: "beyazdinazor.jpeg", alt: "Beyaz dinozor peluş oyuncak" },
      },
      {
        label: "Pembe",
        sku_suffix: "PNK",
        price_delta: 0,
        stock_quantity: 12,
        image: { file: "pembedinazor.jpeg", alt: "Pembe dinozor peluş oyuncak" },
      },
    ],
  },
  {
    name: "Uyku Arkadaşım Peluş Bebek",
    slug: "uyku-arkadasim-pelus-bebek",
    categorySlug: "uyku-arkadaslari",
    short_description: "Muslin kumaşı ve kulaklarıyla bebeğinizin uyku dostu.",
    description:
      "Yumuşak muslin battaniyesi ve tatlı yüz ifadesiyle bu uyku arkadaşı, bebeğinizin uyku ve oyun saatlerine sadık bir dost olarak eşlik eder. Kız ve erkek renk seçenekleriyle sunulur.",
    base_price: 449,
    sku: "EB-UYK-001",
    stock_quantity: 24,
    size: "Küçük (S) — 20 cm (battaniye 30x30 cm)",
    care_instructions: "30°C'de hassas yıkama. Ütülemeyin, kurutma makinesi kullanmayın.",
    is_featured: true,
    images: [{ file: "uykuarkadaşı.jpeg", alt: "Uyku arkadaşı peluş bebek" }],
    variants: [
      {
        label: "Kız (Emi)",
        sku_suffix: "GIRL",
        price_delta: 0,
        stock_quantity: 12,
        image: { file: "kızuykuarkadaşıkutulu.jpeg", alt: "Kız uyku arkadaşı, kutulu" },
      },
      {
        label: "Erkek (Edi)",
        sku_suffix: "BOY",
        price_delta: 0,
        stock_quantity: 12,
        image: { file: "erkekuykuarkadaşıkutulu.jpeg", alt: "Erkek uyku arkadaşı, kutulu" },
      },
    ],
  },
  {
    name: "Hayvan Figürlü Anahtarlık Koleksiyonu",
    slug: "hayvan-figurlu-anahtarlik-koleksiyonu",
    categorySlug: "anahtarliklar",
    short_description: "Çantanıza sevimlilik katacak minik peluş dostlar.",
    description:
      "Metal anahtarlık halkasıyla gelen bu minik peluşlar, çanta veya sırt çantalarına takılabilir. Yedi farklı karakter seçeneğiyle sunulur.",
    base_price: 129,
    sku: "EB-KEY-001",
    stock_quantity: 105,
    size: "Küçük (S) — 10 cm",
    care_instructions: "Nemli bezle silerek temizleyin.",
    is_featured: false,
    images: [{ file: "ayıanahtarlık.jpeg", alt: "Ayı figürlü anahtarlık" }],
    variants: [
      {
        label: "Ayı",
        sku_suffix: "BEAR",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "ayıanahtarlık.jpeg", alt: "Ayı figürlü anahtarlık" },
      },
      {
        label: "Panda",
        sku_suffix: "PANDA",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "pandaanahtarlık.jpeg", alt: "Panda figürlü anahtarlık" },
      },
      {
        label: "Kurbağa",
        sku_suffix: "FROG",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "kurbağaanahtarlık.jpeg", alt: "Kurbağa figürlü anahtarlık" },
      },
      {
        label: "Kedi",
        sku_suffix: "CAT",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "kedianahtarlık.jpeg", alt: "Kedi figürlü anahtarlık" },
      },
      {
        label: "Çilek",
        sku_suffix: "STRAW",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "çilekanahtarlık.jpeg", alt: "Çilek figürlü anahtarlık" },
      },
      {
        label: "Yıldız",
        sku_suffix: "STAR",
        price_delta: 0,
        stock_quantity: 15,
        image: { file: "yıldızanahtarlık.jpeg", alt: "Yıldız figürlü anahtarlık" },
      },
      {
        label: "Avokado",
        sku_suffix: "AVO",
        price_delta: 10,
        stock_quantity: 15,
        image: { file: "avakadoanahtarlık.jpeg", alt: "Avokado figürlü anahtarlık" },
      },
    ],
  },
];

async function uploadImage(productSlug: string, image: SeedImage) {
  const source = await readFile(path.join(ASSETS_DIR, image.file));
  const optimized = await sharp(source)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const storagePath = `${productSlug}/${randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, optimized, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed for ${image.file}: ${error.message}`);
  return storagePath;
}

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const category of CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(category, { onConflict: "slug" })
      .select("id, slug")
      .single();
    if (error) throw error;
    categoryIdBySlug.set(data.slug, data.id);
  }
  console.log(`  ${CATEGORIES.length} categories ready.`);

  console.log("Seeding products...");
  for (const product of PRODUCTS) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) throw new Error(`Unknown category ${product.categorySlug}`);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", product.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  Skipping "${product.name}" (already seeded).`);
      continue;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("products")
      .insert({
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description,
        category_id: categoryId,
        base_price: product.base_price,
        compare_at_price: product.compare_at_price ?? null,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        size: product.size,
        care_instructions: product.care_instructions,
        is_active: true,
        is_featured: product.is_featured,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    const productId = inserted.id;

    for (const [i, image] of product.images.entries()) {
      const storagePath = await uploadImage(product.slug, image);
      const { error } = await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: storagePath,
        alt_text: image.alt,
        sort_order: i,
        is_primary: i === 0,
      });
      if (error) throw error;
    }

    if (product.variants) {
      for (const variant of product.variants) {
        let imageId: string | null = null;
        if (variant.image) {
          const storagePath = await uploadImage(product.slug, variant.image);
          const { data: imgRow, error } = await supabase
            .from("product_images")
            .insert({
              product_id: productId,
              storage_path: storagePath,
              alt_text: variant.image.alt,
              sort_order: product.images.length,
              is_primary: false,
            })
            .select("id")
            .single();
          if (error) throw error;
          imageId = imgRow.id;
        }

        const { error } = await supabase.from("product_variants").insert({
          product_id: productId,
          label: variant.label,
          sku_suffix: variant.sku_suffix,
          price_delta: variant.price_delta,
          stock_quantity: variant.stock_quantity,
          image_id: imageId,
        });
        if (error) throw error;
      }
    }

    console.log(`  Created "${product.name}".`);
  }

  console.log("Creating seed admin account...");
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let adminUser = existingUsers?.users.find((u) => u.email === ADMIN_EMAIL);

  if (!adminUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Elena Yönetici" },
    });
    if (error) throw error;
    adminUser = data.user;
    console.log(`  Created admin user ${ADMIN_EMAIL}.`);
  } else {
    console.log(`  Admin user ${ADMIN_EMAIL} already exists.`);
  }

  if (adminUser) {
    const { error } = await supabase
      .from("customers")
      .update({ role: "admin", full_name: "Elena Yönetici" })
      .eq("id", adminUser.id);
    if (error) throw error;
  }

  console.log("\nDone! Log into /admin/giris with:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: (the SEED_ADMIN_PASSWORD you set in .env.local)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
