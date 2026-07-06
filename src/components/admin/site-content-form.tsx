"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SiteImageUploader } from "@/components/admin/site-image-uploader";
import { updateSiteContent } from "@/actions/admin-site-content";
import type { ActionResult } from "@/actions/auth";
import type { SiteContent } from "@/types/database.types";

const initialState: ActionResult = {};

export function SiteContentForm({ content }: { content: SiteContent }) {
  const [state, formAction, pending] = useActionState(
    updateSiteContent,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section>
        <h2 className="font-serif text-lg text-foreground">Ana Vitrin (Hero)</h2>
        <div className="mt-4 flex flex-col gap-4">
          <SiteImageUploader
            field="hero_image_path"
            imagePath={content.hero_image_path}
            updatedAt={content.updated_at}
            label="Vitrin Görseli"
          />
          <div>
            <Label htmlFor="hero_badge">Rozet Metni</Label>
            <Input
              id="hero_badge"
              name="hero_badge"
              defaultValue={content.hero_badge}
              className="mt-1.5 max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="hero_headline">Başlık</Label>
            <Input
              id="hero_headline"
              name="hero_headline"
              defaultValue={content.hero_headline}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="hero_subheadline">Alt Metin</Label>
            <Textarea
              id="hero_subheadline"
              name="hero_subheadline"
              rows={3}
              defaultValue={content.hero_subheadline}
              className="mt-1.5"
            />
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="font-serif text-lg text-foreground">Hediye Bölümü</h2>
        <div className="mt-4 flex flex-col gap-4">
          <SiteImageUploader
            field="gift_image_path"
            imagePath={content.gift_image_path}
            updatedAt={content.updated_at}
            label="Hediye Bölümü Görseli"
          />
          <div>
            <Label htmlFor="gift_badge">Rozet Metni</Label>
            <Input
              id="gift_badge"
              name="gift_badge"
              defaultValue={content.gift_badge}
              className="mt-1.5 max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="gift_headline">Başlık</Label>
            <Input
              id="gift_headline"
              name="gift_headline"
              defaultValue={content.gift_headline}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="gift_body">Açıklama</Label>
            <Textarea
              id="gift_body"
              name="gift_body"
              rows={3}
              defaultValue={content.gift_body}
              className="mt-1.5"
            />
          </div>
        </div>
      </section>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        {pending ? "Kaydediliyor..." : "Metinleri Kaydet"}
      </Button>
    </form>
  );
}
