"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAddress } from "@/actions/addresses";
import type { ActionResult } from "@/actions/auth";

const initialState: ActionResult = {};

export function AddressForm() {
  const [state, formAction, pending] = useActionState(
    createAddress,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-border p-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <Label htmlFor="label">Adres Başlığı</Label>
        <Input id="label" name="label" placeholder="Ev, İş..." className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="a_full_name">Ad Soyad</Label>
        <Input id="a_full_name" name="full_name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="a_phone">Telefon</Label>
        <Input id="a_phone" name="phone" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="a_city">İl</Label>
        <Input id="a_city" name="city" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="a_district">İlçe</Label>
        <Input id="a_district" name="district" required className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="a_address_line">Açık Adres</Label>
        <Textarea id="a_address_line" name="address_line" required className="mt-1.5" rows={2} />
      </div>
      {state.error ? (
        <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Kaydediliyor..." : "Adres Ekle"}
      </Button>
    </form>
  );
}
