-- ScriptLyra — auth, writer profiles and the blog
-- Paste this whole file into the Supabase SQL editor (SQL → New query → Run).
-- It is safe to re-run: every object is guarded with "if not exists" / "drop
-- ... if exists" so a second run will not error.

-- ---------------------------------------------------------------------------
-- profiles: one public row per auth user
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text not null unique,
  name       text not null,
  blurb      text,
  bio        text,
  genre      text,
  based      text,
  links      jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- posts: user-written blog pieces
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null references public.profiles (id) on delete cascade,
  slug             text not null,
  title            text not null,
  standfirst       text,
  kind             text not null default 'Essay',
  body_md          text not null default '',
  status           text not null default 'draft' check (status in ('draft', 'published')),
  reading_minutes  integer not null default 1,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- A slug is unique per author, so /blog/[username]/[slug] is unambiguous and
  -- two writers may both have a post called "first-draft".
  unique (author_id, slug)
);

create index if not exists posts_author_idx on public.posts (author_id);
create index if not exists posts_feed_idx on public.posts (status, published_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- profiles: world-readable, self-writable.
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public"
  on public.profiles for select
  using (true);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- posts: published rows are world-readable; an author additionally sees their
-- own drafts. Writes are restricted to the author.
drop policy if exists "read published or own posts" on public.posts;
create policy "read published or own posts"
  on public.posts for select
  using (status = 'published' or author_id = auth.uid());

drop policy if exists "insert own posts" on public.posts;
create policy "insert own posts"
  on public.posts for insert
  with check (author_id = auth.uid());

drop policy if exists "update own posts" on public.posts;
create policy "update own posts"
  on public.posts for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "delete own posts" on public.posts;
create policy "delete own posts"
  on public.posts for delete
  using (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- keep updated_at honest
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- provision a profile whenever a user signs up
-- Runs as the definer (bypasses RLS) so the row is created before the user has
-- a session. Username is the email local-part, slugified, with a numeric
-- suffix on collision. Display name comes from the sign-up metadata.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate     text;
  suffix        integer := 1;
begin
  base_username := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g');
  base_username := trim(both '-' from base_username);
  if base_username = '' or base_username is null then
    base_username := 'writer';
  end if;

  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base_username || '-' || suffix;
    suffix := suffix + 1;
  end loop;

  insert into public.profiles (id, username, name)
  values (
    new.id,
    candidate,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), candidate)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
