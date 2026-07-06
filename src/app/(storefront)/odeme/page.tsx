"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gift, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { calculateGiftWrapFee, calculateShippingFee, GIFT_WRAP_FEE } from "@/lib/checkout/pricing";

const PAYMENTS_LIVE = process.env.NEXT_PUBLIC_PAYMENTS_LIVE === "true";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const hydrated = useHydrated();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      is_gift_wrapped: false,
      shipping: {},
    },
  });

  const isGiftWrapped = useWatch({ control, name: "is_gift_wrapped" });
  const subtotal = hydrated ? cartSubtotal(items) : 0;
  const shippingFee = calculateShippingFee(subtotal);
  const giftWrapFee = calculateGiftWrapFee(isGiftWrapped);
  const total = subtotal + shippingFee + giftWrapFee;

  async function onSubmit(values: CheckoutInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/iyzico/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          shipping: values.shipping,
          is_gift_wrapped: values.is_gift_wrapped,
          gift_note: values.gift_note,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Bir hata oluştu");
        setSubmitting(false);
        return;
      }

      // eslint-disable-next-line react-hooks/immutability -- intentional browser navigation after a user-initiated submit
      window.location.href = data.paymentPageUrl;
    } catch {
      setServerError("Sunucuya bağlanılamadı, lütfen tekrar deneyin");
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Sepetiniz boş.</p>
        <Button asChild className="mt-4">
          <Link href="/magaza">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground">Ödeme</h1>

      {!PAYMENTS_LIVE ? (
        <div className="mt-4 rounded-xl border border-primary/30 bg-tint-butter px-4 py-2.5 text-sm text-mocha">
          Test modu — gerçek ödeme alınmayacak. iyzico test kartlarını
          kullanabilirsiniz.
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section>
            <h2 className="font-serif text-lg text-foreground">
              İletişim Bilgileri
            </h2>
            <div className="mt-3">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" className="mt-1.5" {...register("email")} />
              {errors.email ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground">
              Teslimat Adresi
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">Ad Soyad</Label>
                <Input
                  id="full_name"
                  className="mt-1.5"
                  {...register("shipping.full_name")}
                />
                {errors.shipping?.full_name ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.shipping.full_name.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  placeholder="05XX XXX XX XX"
                  className="mt-1.5"
                  {...register("shipping.phone")}
                />
                {errors.shipping?.phone ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.shipping.phone.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="city">İl</Label>
                <Input id="city" className="mt-1.5" {...register("shipping.city")} />
                {errors.shipping?.city ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.shipping.city.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="district">İlçe</Label>
                <Input
                  id="district"
                  className="mt-1.5"
                  {...register("shipping.district")}
                />
                {errors.shipping?.district ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.shipping.district.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="neighborhood">Mahalle (opsiyonel)</Label>
                <Input
                  id="neighborhood"
                  className="mt-1.5"
                  {...register("shipping.neighborhood")}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address_line">Açık Adres</Label>
                <Textarea
                  id="address_line"
                  className="mt-1.5"
                  rows={3}
                  {...register("shipping.address_line")}
                />
                {errors.shipping?.address_line ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.shipping.address_line.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="postal_code">Posta Kodu (opsiyonel)</Label>
                <Input
                  id="postal_code"
                  className="mt-1.5"
                  {...register("shipping.postal_code")}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <Controller
                name="is_gift_wrapped"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Gift className="h-4 w-4 text-primary" /> Hediye paketi ekle
                </span>
                <span className="block text-xs text-muted-foreground">
                  Elenaland kutusunda, kurdeleli hediye paketi — {formatPrice(GIFT_WRAP_FEE)}
                </span>
              </span>
            </label>
            {isGiftWrapped ? (
              <div className="mt-3">
                <Label htmlFor="gift_note">Hediye Notu (opsiyonel)</Label>
                <Textarea
                  id="gift_note"
                  className="mt-1.5"
                  rows={2}
                  maxLength={300}
                  placeholder="Kutuya eklenecek kişisel notunuz..."
                  {...register("gift_note")}
                />
              </div>
            ) : null}
          </section>

          <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Controller
              name="accepts_terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  className="mt-0.5"
                  checked={field.value === true}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <span>
              <Link href="/mesafeli-satis-sozlesmesi" className="text-primary underline-offset-4 hover:underline">
                Mesafeli satış sözleşmesini
              </Link>{" "}
              okudum, onaylıyorum.
            </span>
          </label>
          {errors.accepts_terms ? (
            <p className="-mt-4 text-xs text-destructive">
              {errors.accepts_terms.message}
            </p>
          ) : null}

          {serverError ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {serverError}
            </p>
          ) : null}
        </div>

        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-serif text-lg text-foreground">Sipariş Özeti</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId}`}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ara Toplam</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kargo</span>
              <span>{shippingFee === 0 ? "Ücretsiz" : formatPrice(shippingFee)}</span>
            </div>
            {isGiftWrapped ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hediye Paketi</span>
                <span>{formatPrice(giftWrapFee)}</span>
              </div>
            ) : null}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-medium text-foreground">
            <span>Toplam</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
            {submitting ? "Yönlendiriliyor..." : "Ödemeyi Tamamla"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Güvenli ödeme — iyzico ile şifrelenir
          </p>
        </div>
      </form>
    </div>
  );
}
