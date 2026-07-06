"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage, type ContactActionResult } from "@/actions/contact";

const initialState: ContactActionResult = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  if (state.success) {
    return (
      <p className="rounded-2xl bg-tint-sage px-5 py-4 text-sm text-mocha">
        Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="c_name">Ad Soyad</Label>
        <Input id="c_name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="c_email">E-posta</Label>
        <Input id="c_email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="c_message">Mesajınız</Label>
        <Textarea id="c_message" name="message" required rows={5} className="mt-1.5" />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}
