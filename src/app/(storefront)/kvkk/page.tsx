import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        KVKK Aydınlatma Metni
      </h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          uyarınca, veri sorumlusu sıfatıyla Elena Babywear Tekstil San. ve
          Tic. Ltd. Şti. (Güneştepe Mah. Çamlık Cad. No:148 A, Osmangazi /
          BURSA) olarak kişisel verilerinizi aşağıda açıklanan kapsamda
          işlemekteyiz.
        </p>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            İşlenen Veriler
          </h2>
          <p className="mt-2">
            Kimlik, iletişim, adres ve sipariş bilgileriniz; sözleşmenin
            kurulması ve ifası, yasal yükümlülüklerimizin yerine getirilmesi
            hukuki sebeplerine dayanarak işlenmektedir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Haklarınız
          </h2>
          <p className="mt-2">
            KVKK&apos;nın 11. maddesi kapsamında; verilerinizin işlenip
            işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
            düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Bu
            haklarınızı kullanmak için{" "}
            <a href="/iletisim" className="text-primary underline-offset-4 hover:underline">
              iletişim
            </a>{" "}
            sayfamızdan bize başvurabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
