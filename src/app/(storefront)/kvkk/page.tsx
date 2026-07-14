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
            Kimlik, iletişim, adres, sipariş ve işlem güvenliği bilgileriniz;
            sözleşmenin kurulması ve ifası, yasal yükümlülüklerimizin yerine
            getirilmesi hukuki sebeplerine dayanarak işlenmektedir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Verilerin Aktarılması
          </h2>
          <p className="mt-2">
            Kişisel verileriniz; ödeme işlemlerinin gerçekleştirilmesi
            amacıyla ödeme kuruluşu iyzico&apos;ya, siparişinizin teslimi
            amacıyla anlaşmalı kargo firmalarına ve yasal yükümlülükler
            kapsamında yetkili kamu kurumlarına aktarılabilmektedir. Sitemizin
            barındırma ve veri tabanı hizmetleri, sunucuları yurt dışında
            bulunan hizmet sağlayıcılardan alınmakta olup verileriniz bu
            kapsamda KVKK&apos;nın 9. maddesine uygun olarak yurt dışına
            aktarılabilmektedir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Saklama Süresi
          </h2>
          <p className="mt-2">
            Verileriniz, üyelik ve sözleşme ilişkisi süresince ve ilgili
            mevzuatta öngörülen yasal saklama süreleri (vergi ve e-ticaret
            mevzuatı uyarınca 10 yıla kadar) boyunca saklanır; sürelerin
            dolmasının ardından silinir, yok edilir veya anonim hale
            getirilir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            Haklarınız
          </h2>
          <p className="mt-2">
            KVKK&apos;nın 11. maddesi kapsamında; kişisel verilerinizin
            işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi
            talep etme, işlenme amacını ve amacına uygun kullanılıp
            kullanılmadığını öğrenme, yurt içinde veya yurt dışında
            aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse
            düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu
            işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini
            isteme, münhasıran otomatik sistemlerle analiz edilmesi
            suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve
            kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın
            giderilmesini talep etme haklarına sahipsiniz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">Başvuru</h2>
          <p className="mt-2">
            Bu haklarınıza ilişkin taleplerinizi, kimliğinizi tevsik edici
            belgelerle birlikte yukarıdaki adresimize yazılı olarak veya
            info@elenababywear.com.tr adresine e-posta ile iletebilirsiniz.
            Başvurunuz, niteliğine göre en geç 30 gün içinde ücretsiz olarak
            sonuçlandırılır. Ayrıca{" "}
            <a
              href="/iletisim"
              className="text-primary underline-offset-4 hover:underline"
            >
              iletişim
            </a>{" "}
            sayfamızdan da bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
