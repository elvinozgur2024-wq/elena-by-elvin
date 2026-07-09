import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { INSTAGRAM_URL } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[220px] text-sm text-muted-foreground">
              Bebekler ve çocuklar için özenle tasarlanmış, yumuşacık peluş
              oyuncaklar ve uyku arkadaşları.
            </p>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-muted-foreground hover:text-primary"
              aria-label="Instagram"
            >
              <InstagramLogo className="h-5 w-5" />
            </Link>
          </div>

          <div>
            <h4 className="font-serif text-sm text-foreground">Mağaza</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/magaza" className="hover:text-primary">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/beden-rehberi" className="hover:text-primary">
                  Beden Rehberi
                </Link>
              </li>
              <li>
                <Link href="/hesabim/siparislerim" className="hover:text-primary">
                  Siparişlerim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-foreground">Kurumsal</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/hakkimizda" className="hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-primary">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kargo-ve-iade" className="hover:text-primary">
                  Kargo &amp; İade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-foreground">Yasal</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-primary">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-primary">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link
                  href="/mesafeli-satis-sozlesmesi"
                  className="hover:text-primary"
                >
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Elena Babywear Tekstil San. ve Tic. Ltd. Şti. — Güneştepe Mah.
            Çamlık Cad. No:148 A, Osmangazi / BURSA
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Elena By Elvin. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
