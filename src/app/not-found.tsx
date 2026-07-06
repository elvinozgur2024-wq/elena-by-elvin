import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <Logo />
      <h1 className="mt-2 font-serif text-3xl text-foreground">
        Sayfa Bulunamadı
      </h1>
      <p className="text-sm text-muted-foreground">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Anasayfaya Dön</Link>
      </Button>
    </div>
  );
}
