import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Gizlilik Politikası
      </h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Elena Babywear Tekstil San. ve Tic. Ltd. Şti. olarak, elenababywear.com
          üzerinden topladığımız kişisel verilerinizin gizliliğine önem
          veriyoruz. Bu politika, hangi verileri topladığımızı ve nasıl
          kullandığımızı açıklar.
        </p>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Topladığımız Veriler
          </h2>
          <p className="mt-2">
            Sipariş verirken ad-soyad, adres, telefon ve e-posta bilgilerinizi
            topluyoruz. Ödeme bilgileriniz doğrudan iyzico&apos;nun güvenli
            altyapısında işlenir; kart bilgileriniz sunucularımızda
            saklanmaz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Verilerin Kullanımı
          </h2>
          <p className="mt-2">
            Bilgileriniz yalnızca siparişinizin işlenmesi, kargo takibi ve
            müşteri hizmetleri iletişimi için kullanılır; açık rızanız
            olmadan üçüncü taraflarla pazarlama amacıyla paylaşılmaz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">Çerezler</h2>
          <p className="mt-2">
            Sitemiz, sepetinizi hatırlamak ve deneyiminizi iyileştirmek için
            temel çerezler kullanır.
          </p>
        </section>
        <p>
          Sorularınız için{" "}
          <a href="/iletisim" className="text-primary underline-offset-4 hover:underline">
            bize ulaşabilirsiniz
          </a>
          .
        </p>
      </div>
    </div>
  );
}
