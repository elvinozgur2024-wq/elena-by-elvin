-- Elena Babywear — editable homepage content (hero + gift section)
-- Singleton row pattern: id is always `true`, so there's exactly one row.

create table site_content (
  id boolean primary key default true check (id = true),
  hero_badge text not null default 'Yeni Sezon',
  hero_headline text not null default 'Sarılmaya değer yumuşacık anılar',
  hero_subheadline text not null default 'Elena Babywear, bebeğinizin ilk gülüşlerine eşlik edecek özenle seçilmiş peluş oyuncaklar sunar. Her biri sevgiyle tasarlandı, sarılmak için can atıyor.',
  hero_image_path text,
  gift_badge text not null default 'Elenaland Hediye Paketi',
  gift_headline text not null default 'Sevdiklerinize özel bir sürpriz hazırlayın',
  gift_body text not null default 'Ödeme sırasında hediye paketi seçeneğini işaretleyin, kişisel notunuzu ekleyin — gerisini bize bırakın.',
  gift_image_path text,
  updated_at timestamptz not null default now()
);

insert into site_content (id) values (true);

create trigger site_content_set_updated_at
  before update on site_content
  for each row execute procedure public.set_updated_at();

alter table site_content enable row level security;

create policy "site_content_public_read" on site_content
  for select using (true);

create policy "site_content_admin_write" on site_content
  for update using (public.is_admin()) with check (public.is_admin());
