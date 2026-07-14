-- Each category can carry its own photo for the homepage category grid,
-- replacing the generic sparkle icon. Nullable: categories without a photo
-- fall back to the icon-on-tint look.
alter table categories add column if not exists image_path text;
