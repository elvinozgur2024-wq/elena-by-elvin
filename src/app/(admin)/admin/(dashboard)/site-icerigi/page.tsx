import { SiteContentForm } from "@/components/admin/site-content-form";
import { getSiteContent } from "@/lib/data/site-content";

export default async function AdminSiteContentPage() {
  const content = await getSiteContent();

  return (
    <div>
      <h1 className="font-serif text-2xl text-foreground">Site İçeriği</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Anasayfadaki vitrin ve hediye bölümünü buradan güncelleyebilirsiniz.
      </p>
      <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6">
        <SiteContentForm content={content} />
      </div>
    </div>
  );
}
