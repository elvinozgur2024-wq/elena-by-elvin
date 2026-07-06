import Link from "next/link";
import { XCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <XCircle className="h-14 w-14 text-destructive" weight="fill" />
      <h1 className="mt-4 font-serif text-3xl text-foreground">
        Ödeme Tamamlanamadı
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ödemeniz alınırken bir sorun oluştu. Kartınızdan herhangi bir tutar
        çekilmediyse tekrar deneyebilirsiniz.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/odeme">Tekrar Dene</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/iletisim">Bize Ulaşın</Link>
        </Button>
      </div>
    </div>
  );
}
