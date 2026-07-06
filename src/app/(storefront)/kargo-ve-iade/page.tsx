import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kargo & İade",
  description: "Elena By Elvin kargo süreleri ve iade koşulları hakkında bilgi alın.",
  alternates: { canonical: "/kargo-ve-iade" },
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Kargo &amp; İade
      </h1>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-lg text-foreground">Kargo</h2>
          <p className="mt-2">
            Siparişleriniz, ödemenin onaylanmasının ardından 1-3 iş günü
            içinde hazırlanıp anlaşmalı kargo firmamıza teslim edilir. 750₺ ve
            üzeri siparişlerde kargo ücretsizdir; altındaki siparişlerde
            49,90₺ sabit kargo ücreti uygulanır.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            İade &amp; Değişim
          </h2>
          <p className="mt-2">
            Ürünlerimizi, teslim tarihinden itibaren 14 gün içinde, kullanılmamış
            ve orijinal ambalajında olmak kaydıyla iade edebilirsiniz.
            Hijyenik ürün olması sebebiyle kullanılmış/yıkanmış peluş
            oyuncaklar iade kapsamı dışındadır. İade talepleriniz için{" "}
            <a href="/iletisim" className="text-primary underline-offset-4 hover:underline">
              iletişim
            </a>{" "}
            sayfamızdan bize ulaşabilirsiniz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Hasarlı Ürün
          </h2>
          <p className="mt-2">
            Kargodan hasarlı teslim alınan ürünler için, tutanak tutturularak
            48 saat içinde bizimle iletişime geçmeniz yeterlidir; ürün
            ücretsiz olarak değiştirilir.
          </p>
        </section>
      </div>
    </div>
  );
}
