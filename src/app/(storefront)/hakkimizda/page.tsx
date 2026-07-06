import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Elena By Elvin, Bursa'da bebekler için sevgiyle tasarlanmış peluş oyuncaklar üretir. Hikayemizi keşfedin.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Hakkımızda
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-tint-butter">
          <Image
            src="/marketing/kid-stars.jpg"
            alt="Elena peluş yıldız oyuncağıyla oynayan çocuk"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Elena By Elvin, Bursa&apos;da küçük bir atölyede, bebeklerin ilk
            arkadaşlarını yaratma tutkusuyla kuruldu. Her peluş oyuncağımız,
            yumuşacık dokusuyla hem oyun hem de uyku saatlerinde çocuklara
            eşlik etmesi için özenle tasarlanır.
          </p>
          <p>
            Bebek güvenli kumaşlar ve titiz dikiş kontrolünden geçen
            ürünlerimiz, sevgiyle sarılmaya hazır. Küçük detaylara verdiğimiz
            önem, her bir oyuncağın kendine has bir karaktere sahip olmasını
            sağlıyor.
          </p>
          <p>
            Ailenizin bir parçası olmaktan mutluluk duyuyoruz — Elena By
            Elvin ile büyüyen her anıya eşlik etmek dileğiyle.
          </p>
        </div>
      </div>

      <div className="mt-14 rounded-2xl border border-border p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">
          Elena Babywear Tekstil San. ve Tic. Ltd. Şti.
        </p>
        <p className="mt-1">
          Güneştepe Mah. Çamlık Cad. No:148 A, Osmangazi / BURSA
        </p>
      </div>
    </div>
  );
}
