
/* =========================================================
   HAWKMOVIES — SUPABASE DATABASE
   YOUR WORLD. YOUR CINEMA.
========================================================= */


/* 1. ENABLE UUID GENERATION */

create extension if not exists pgcrypto;


/* 2. CREATE MOVIES TABLE */

create table if not exists public.movies (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    slug text unique not null,

    description text,

    poster_url text,

    backdrop_url text,

    video_url text,

    trailer_url text,

    year integer,

    rating numeric(3,1) default 0,

    age_rating text default 'PG',

    genre text not null,

    content_type text not null default 'Movie'
        check (content_type in ('Movie', 'Series')),

    is_featured boolean default false,

    is_published boolean not null default false,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()

);


/* 3. CREATE INDEXES FOR FAST SEARCHING */

create index if not exists movies_created_at_idx
on public.movies (created_at desc);

create index if not exists movies_genre_idx
on public.movies (genre);

create index if not exists movies_content_type_idx
on public.movies (content_type);

create index if not exists movies_featured_idx
on public.movies (is_featured)
where is_featured = true;

create index if not exists movies_published_idx
on public.movies (is_published);


/* 4. AUTOMATIC UPDATED_AT FUNCTION */

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin

    new.updated_at = now();

    return new;

end;
$$;


/* 5. AUTOMATICALLY UPDATE TIMESTAMP */

drop trigger if exists update_movies_updated_at
on public.movies;

create trigger update_movies_updated_at

before update on public.movies

for each row

execute function public.update_updated_at();


/* 6. ENABLE ROW LEVEL SECURITY */

alter table public.movies enable row level security;


/* 7. REMOVE OLD PUBLIC POLICIES */

drop policy if exists "Public can view published movies"
on public.movies;

drop policy if exists "Authenticated admins can manage movies"
on public.movies;


/* 8. PUBLIC CAN VIEW PUBLISHED MOVIES */

create policy "Public can view published movies"

on public.movies

for select

to anon, authenticated

using (is_published = true);


/* 9. ADMIN ROLE
   Create an admin role using Supabase SQL Editor.
   Only users with the admin role can manage movies.
*/

create policy "Authenticated admins can manage movies"

on public.movies

for all

to authenticated

using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)

with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


/* 10. STORAGE BUCKET FOR MOVIE POSTERS */

insert into storage.buckets (
    id,
    name,
    public
)

values (
    'movie-posters',
    'movie-posters',
    true
)

on conflict (id) do nothing;


/* 11. STORAGE BUCKET FOR MOVIE VIDEOS */

insert into storage.buckets (
    id,
    name,
    public
)

values (
    'movie-videos',
    'movie-videos',
    false
)

on conflict (id) do nothing;


/* 12. PUBLIC POSTER VIEWING */

drop policy if exists "Public can view movie posters"
on storage.objects;

create policy "Public can view movie posters"

on storage.objects

for select

to anon, authenticated

using (
    bucket_id = 'movie-posters'
);


/* 13. ADMIN POSTER UPLOADS */

drop policy if exists "Admins can upload movie posters"
on storage.objects;

create policy "Admins can upload movie posters"

on storage.objects

for insert

to authenticated

with check (
    bucket_id = 'movie-posters'
    and
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


/* 14. ADMIN VIDEO UPLOADS */

drop policy if exists "Admins can upload movie videos"
on storage.objects;

create policy "Admins can upload movie videos"

on storage.objects

for insert

to authenticated

with check (
    bucket_id = 'movie-videos'
    and
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


/* 15. ADMIN VIDEO ACCESS */

drop policy if exists "Admins can manage movie videos"
on storage.objects;

create policy "Admins can manage movie videos"

on storage.objects

for all

to authenticated

using (
    bucket_id = 'movie-videos'
    and
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)

with check (
    bucket_id = 'movie-videos'
    and
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


/* =========================================================
   HAWKMOVIES DATABASE READY
========================================================= */
