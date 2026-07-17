import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Elenaland'in hikâyesi: bir annenin çocukluk anılarından bugünün çocuklarına uzanan, sevgiyle tasarlanmış peluş kahramanların dünyası.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        Dünden Bugüne Bir Sevgi Hikâyesi
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
          <p className="font-serif text-base leading-relaxed text-foreground">
            Elena, bir annenin çocukluk anılarından bugünün çocuklarına uzanan
            sıcacık bir sevgi hikâyesinden doğdu.
          </p>
          <p>
            Elenaland; kurucusunun içinde yaşattığı çocuk Elena’nın
            hayallerinin, kendi çocuğundan aldığı ilham ve anne titizliğiyle
            buluşmasıyla hayat buldu. Bir çocuğun merakı ve sadık bir dostun
            neşesi de bu hikâyeye eşlik edince Elena, Uygar ve Maya’nın
            merkezinde yer aldığı büyülü bir dünya ortaya çıktı.
          </p>
          <p>
            Bu dünyadaki her karakter; küçük bir duyguyu, güzel bir değeri ve
            çocukluğa ait unutulmaz bir anı taşıyor. Kimi cesareti
            hatırlatıyor, kimi dostluğu… Kimi ise yalnızca sessizce sarılarak
            bir çocuğa kendini güvende hissettiriyor.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Çünkü bizce bir oyuncak, oyunlara eşlik eden bir eşyadan çok daha
          fazlasıdır. Bazen uykuya dalarken tutulan yumuşacık bir el, bazen
          anlatılmamış sırların en güvenilir dinleyicisi, bazen de yıllar
          sonra hatırlandığında insanın yüzünde beliren sıcacık bir
          gülümsemedir.
        </p>
        <p>
          Bu yüzden her Elenaland kahramanı; kumaşından dikişine, dolgusundan
          en küçük ayrıntısına kadar çocukların rahatlığı ve güvenliği
          gözetilerek, anne hassasiyetiyle hazırlanır. Sevgi dolu oyunlara
          eşlik etmesi ve zamanla kıymetli bir çocukluk hatırasına dönüşmesi
          için tasarlanır.
        </p>
        <p>
          Elenaland; sevginin, iyiliğin, hayal gücünün ve içten gülümsemelerin
          yaşadığı küçük, masum ve büyülü bir dünya…
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-tint-blush px-8 py-10 text-center">
        <p className="font-serif text-xl text-mocha sm:text-2xl">
          Elenaland’e hoş geldiniz.
        </p>
        <p className="mt-3 text-sm italic text-mocha/80">
          Bir gülümsemeden ilhamla, minik kalpler için tasarlandı.
        </p>
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
