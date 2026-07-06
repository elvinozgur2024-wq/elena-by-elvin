import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { getCategories } from "@/lib/data/products";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The nav shouldn't take the whole storefront down if Supabase is
  // briefly unreachable — individual pages still surface their own errors.
  const categories = await getCategories().catch(() => []);

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
