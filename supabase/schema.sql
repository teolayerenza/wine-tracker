-- Run this once in the Supabase project's SQL editor.
--
-- ponytail: sin login por ahora (un solo usuario). RLS abierta al anon key.
-- Cuando se agregue auth, sumar user_id + políticas por auth.uid() (ver
-- historial de git para la versión anterior con RLS).

create table wines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  winery text,
  varietal text,
  region text,
  vintage_year smallint,
  style text, -- e.g. "Gran Reserva", "Joven"
  photo_url text,
  created_at timestamptz not null default now()
);

create table tastings (
  id uuid primary key default gen_random_uuid(),
  wine_id uuid not null references wines(id) on delete cascade,
  tasted_on date not null default current_date,
  rating smallint not null check (rating between 1 and 5),
  occasion text, -- e.g. "Cena familiar", "Celebración"
  comment text,
  created_at timestamptz not null default now()
);

create index tastings_tasted_on_idx on tastings (tasted_on desc);
create index tastings_wine_idx on tastings (wine_id);

alter table wines enable row level security;
alter table tastings enable row level security;

create policy "Open access (single user, no auth yet)" on wines for all using (true) with check (true);
create policy "Open access (single user, no auth yet)" on tastings for all using (true) with check (true);

-- Storage bucket for wine photos.
insert into storage.buckets (id, name, public)
values ('wine-photos', 'wine-photos', true)
on conflict (id) do nothing;

create policy "Open access to wine photos (single user, no auth yet)"
  on storage.objects for all
  using (bucket_id = 'wine-photos')
  with check (bucket_id = 'wine-photos');
