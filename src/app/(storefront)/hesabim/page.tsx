import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Package, SignOut } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/storefront/address-form";
import { DeleteAddressButton } from "@/components/storefront/delete-address-button";
import { logout } from "@/actions/auth";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const [{ data: customer }, { data: addresses }] = await Promise.all([
    supabase.from("customers").select("full_name").eq("id", user.id).single(),
    supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", user.id)
      .order("is_default", { ascending: false }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">
            Merhaba, {customer?.full_name ?? "Hoş geldiniz"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">
            <SignOut className="h-4 w-4" /> Çıkış Yap
          </Button>
        </form>
      </div>

      <Link
        href="/hesabim/siparislerim"
        className="mt-8 flex items-center gap-3 rounded-2xl border border-border p-5 hover:bg-secondary/60"
      >
        <Package className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Siparişlerim</p>
          <p className="text-xs text-muted-foreground">
            Geçmiş siparişlerinizi görüntüleyin
          </p>
        </div>
      </Link>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-serif text-lg text-foreground">
          <MapPin className="h-5 w-5 text-primary" /> Kayıtlı Adreslerim
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {(addresses ?? []).map((address) => (
            <div
              key={address.id}
              className="flex items-start justify-between rounded-2xl border border-border p-4"
            >
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {address.label} — {address.full_name}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {address.address_line}, {address.neighborhood}{" "}
                  {address.district}/{address.city}
                </p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>
              <DeleteAddressButton addressId={address.id} />
            </div>
          ))}
        </div>

        <AddressForm />
      </section>
    </div>
  );
}
