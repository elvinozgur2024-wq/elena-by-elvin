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
            Cad. No:148 A, Osmangazi / BURSA (&quot;Satıcı&quot;)
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
            elenababywear.com internet sitesinden elektronik ortamda
            siparişini verdiği ürünlerin satışı ve teslimi ile ilgili olarak
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
            Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve
            yükümlülüklerinin belirlenmesidir.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            3. Cayma Hakkı
          </h2>
          <p className="mt-2">
            Alıcı, ürünün teslim tarihinden itibaren 14 gün içinde herhangi
            bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden
            cayma hakkına sahiptir. Hijyen ve sağlık açısından, ambalajı
            açılmış/kullanılmış peluş oyuncaklarda cayma hakkı, ilgili
            mevzuat gereği kullanılamaz.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-lg text-foreground">
            4. Ödeme ve Teslimat
          </h2>
          <p className="mt-2">
            Ödemeler iyzico güvenli ödeme altyapısı üzerinden alınır. Ürünler
            belirtilen teslimat adresine anlaşmalı kargo firmaları
            aracılığıyla gönderilir.
          </p>
        </section>
      </div>
    </div>
  );
}
