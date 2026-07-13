-- Adds a 6th category tint ("mint") so Anahtarlıklar no longer has to
-- share "sky" with Deniz Canlıları — every category gets a distinct color.
-- Finds the existing check constraint on tint dynamically rather than
-- assuming its auto-generated name, since it wasn't explicitly named in
-- 0001_init_schema.sql.
do $$
declare
  existing_constraint text;
begin
  select conname into existing_constraint
  from pg_constraint
  where conrelid = 'categories'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%tint%';

  if existing_constraint is not null then
    execute format('alter table categories drop constraint %I', existing_constraint);
  end if;
end $$;

alter table categories add constraint categories_tint_check
  check (tint in ('blush', 'sage', 'butter', 'sky', 'lavender', 'mint'));
