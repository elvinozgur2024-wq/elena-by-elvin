import Link from "next/link";
import { Compass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { EmptyState } from "@/components/storefront/empty-state";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Logo />
      <EmptyState
        titleAs="h1"
        title="Bu sayfa kaybolmuş gibi görünüyor"
        description="Aradığın sayfa burada değil — belki yumuşacık dostlarımızın arasına karışmıştır."
        tint="#e9dff0"
        icon={<Compass className="h-5 w-5" />}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/">Anasayfaya Dön</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/magaza">Koleksiyonu Keşfet</Link>
            </Button>
          </div>
        }
        className="py-8"
      />
    </div>
  );
}
