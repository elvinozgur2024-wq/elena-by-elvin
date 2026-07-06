"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type ActionResult } from "@/actions/auth";

const initialState: ActionResult = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl text-foreground">Giriş Yap</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Siparişlerinizi ve adreslerinizi görüntülemek için giriş yapın.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
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
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="text-primary underline-offset-4 hover:underline">
          Kayıt Olun
        </Link>
      </p>
    </div>
  );
}
