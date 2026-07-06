"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, type ActionResult } from "@/actions/auth";

const initialState: ActionResult = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl text-foreground">Hesap Oluştur</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Siparişlerinizi takip etmek için birkaç saniyede kayıt olun.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div>
          <Label htmlFor="full_name">Ad Soyad</Label>
          <Input id="full_name" name="full_name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" name="password" type="password" required className="mt-1.5" />
        </div>
        {state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        <Button type="submit" size="lg" disabled={pending} className="mt-2">
          {pending ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="text-primary underline-offset-4 hover:underline">
          Giriş Yapın
        </Link>
      </p>
    </div>
  );
}
