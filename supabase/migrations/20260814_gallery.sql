-- StyleKit Public Gallery
-- Lets signed-in users publish an extraction to a public, shareable, searchable
-- gallery. Anyone can browse/read; only the authenticated owner can publish or
-- remove their own entries. Clone/view counters are incremented through a
-- SECURITY DEFINER function so the public can't directly UPDATE rows.

create table if not exists public.gallery_extractions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_label text not null default 'a StyleKit user',
  title text not null check (char_length(title) between 1 and 100),
  source_host text not null,
  source_url text not null,
  category text not null check (category in (
    'SaaS / Product', 'E-commerce', 'Marketing / Landing', 'Blog / Content',
    'Portfolio', 'Dashboard / Admin', 'Other'
  )),
  tokens jsonb not null,
  clone_count integer not null default 0,
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_extractions_created_at_idx on public.gallery_extractions (created_at desc);
create index if not exists gallery_extractions_category_idx on public.gallery_extractions (category);
create index if not exists gallery_extractions_author_id_idx on public.gallery_extractions (author_id);

alter table public.gallery_extractions enable row level security;

-- Anyone (including anonymous visitors) can read published entries.
create policy "gallery_extractions_public_read"
  on public.gallery_extractions for select
  to anon, authenticated
  using (true);

-- Only a signed-in user can publish, and only as themselves.
create policy "gallery_extractions_owner_insert"
  on public.gallery_extractions for insert
  to authenticated
  with check (auth.uid() = author_id);

-- Only the owner can remove their own published entry ("unpublish").
create policy "gallery_extractions_owner_delete"
  on public.gallery_extractions for delete
  to authenticated
  using (auth.uid() = author_id);

-- Atomic counters, callable by anyone, without exposing a general UPDATE policy.
create or replace function public.increment_gallery_clone_count(row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.gallery_extractions set clone_count = clone_count + 1 where id = row_id;
end;
$$;

create or replace function public.increment_gallery_view_count(row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.gallery_extractions set view_count = view_count + 1 where id = row_id;
end;
$$;

grant execute on function public.increment_gallery_clone_count(uuid) to anon, authenticated;
grant execute on function public.increment_gallery_view_count(uuid) to anon, authenticated;
