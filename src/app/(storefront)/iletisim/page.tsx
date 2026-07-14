import type { Metadata } from "next";
import Link from "next/link";
import {
  EnvelopeSimple,
  InstagramLogo,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/storefront/contact-form";
import { INSTAGRAM_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Elena By Elvin ile iletişime geçin — sorularınız için buradayız.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
        İletişim
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sorularınız, önerileriniz veya sipariş süreciyle ilgili her konuda
            bize ulaşabilirsiniz.
          </p>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              Güneştepe Mah. Çamlık Cad. No:148 A, Osmangazi / BURSA
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <EnvelopeSimple className="mt-0.5 h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              info@elenababywear.com.tr
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <InstagramLogo className="mt-0.5 h-5 w-5 text-primary" />
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              @elenababywear
            </Link>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
