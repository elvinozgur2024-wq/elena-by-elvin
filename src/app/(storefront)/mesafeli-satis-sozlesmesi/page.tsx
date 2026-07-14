import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  alternates: { canonical: "/mesafeli-satis-sozlesmesi" },
};

export default function DistanceSalesAgreementPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Mesafeli Satış Sözleşmesi
      </h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-lg text-foreground">1. Taraflar</h2>
          <p className="mt-2">
            <strong className="text-foreground">Satıcı:</strong> Elena
            Babywear Tekstil San. ve Tic. Ltd. Şti. — Güneştepe Mah. Çamlık
            Cad. No:148 A, Osmangazi / BURSA — E-posta:
            info@elenababywear.com.tr (&quot;Satıcı&quot;)
          </p>
          <p className="mt-1">
            <strong className="text-foreground">Alıcı:</strong> Sitemiz
            üzerinden sipariş veren kişi (&quot;Alıcı&quot;)
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">2. Konu</h2>
          <p className="mt-2">
            İşbu sözleşmenin konusu, Alıcı&apos;nın Satıcı&apos;ya ait
            elenababywear.com.tr internet sitesinden elektronik ortamda
            siparişini verdiği ürünlerin satışı ve teslimi ile ilgili olarak
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
            Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve
            yükümlülüklerinin belirlenmesidir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            3. Ödeme ve Teslimat
          </h2>
          <p className="mt-2">
            Ödemeler iyzico güvenli ödeme altyapısı üzerinden alınır. Ürünler,
            ödemenin onaylanmasının ardından 1-3 iş günü içinde kargoya
            verilir ve Alıcı&apos;nın belirttiği teslimat adresine anlaşmalı
            kargo firmaları aracılığıyla gönderilir. Teslimat süresi her
            halükarda siparişin verildiği tarihten itibaren 30 günü aşamaz;
            bu sürede teslim edilemeyen siparişlerde Alıcı sözleşmeyi
            feshedebilir ve ödediği tutar kendisine iade edilir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            4. Cayma Hakkı
          </h2>
          <p className="mt-2">
            Alıcı, ürünün teslim tarihinden itibaren 14 gün içinde herhangi
            bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden
            cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre
            içinde Satıcı&apos;ya e-posta (info@elenababywear.com.tr) veya{" "}
            <a
              href="/iletisim"
              className="text-primary underline-offset-4 hover:underline"
            >
              iletişim sayfası
            </a>{" "}
            üzerinden açık bir bildirimde bulunulması yeterlidir. Hijyen ve
            sağlık açısından, ambalajı açılmış/kullanılmış peluş oyuncaklarda
            cayma hakkı, ilgili mevzuat gereği kullanılamaz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            5. İade Prosedürü ve Ücret İadesi
          </h2>
          <p className="mt-2">
            Cayma bildirimini takiben ürün, 10 gün içinde Satıcı&apos;nın
            yukarıda belirtilen adresine (Güneştepe Mah. Çamlık Cad. No:148 A,
            Osmangazi / BURSA) gönderilir. İade gönderimi Satıcı&apos;nın
            anlaşmalı kargo firması aracılığıyla yapıldığında kargo ücreti
            Satıcı&apos;ya aittir. Satıcı, cayma bildiriminin kendisine
            ulaştığı tarihten itibaren 14 gün içinde ödemenin tamamını,
            siparişte kullanılan ödeme aracına uygun şekilde ve Alıcı&apos;ya
            herhangi bir masraf yüklemeksizin iade eder.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            6. Uyuşmazlıkların Çözümü
          </h2>
          <p className="mt-2">
            İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca
            her yıl belirlenen parasal sınırlar dahilinde Alıcı&apos;nın veya
            Satıcı&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri, bu
            sınırları aşan uyuşmazlıklarda ise Tüketici Mahkemeleri
            yetkilidir.
          </p>
        </section>
      </div>
    </div>
  );
}
