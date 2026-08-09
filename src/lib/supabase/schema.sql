-- =========================================================
-- SUPABASE BLOG - FINAL SETUP
-- =========================================================


-- =========================================================
-- 1. BLOG TABLE
-- =========================================================

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),

  author_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null
    check (char_length(trim(title)) > 0),

  slug text not null unique
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  content text not null
    check (char_length(trim(content)) > 0),

  -- Simpan STORAGE PATH, bukan full URL
  -- contoh:
  -- user-uuid/abc123.webp
  image text,

  like_count bigint not null default 0
    check (like_count >= 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- =========================================================
-- 2. INDEX
-- =========================================================

-- Homepage / pagination:
-- order by created_at desc

create index if not exists blogs_created_at_idx
on public.blogs (created_at desc);


-- Untuk query milik author/admin

create index if not exists blogs_author_id_idx
on public.blogs (author_id);


-- slug sudah otomatis mempunyai unique index
-- karena kolom slug memakai UNIQUE.


-- =========================================================
-- 3. AUTO UPDATE updated_at
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;


drop trigger if exists blogs_set_updated_at
on public.blogs;


create trigger blogs_set_updated_at
before update
on public.blogs
for each row
execute function public.set_updated_at();


-- =========================================================
-- 4. ENABLE RLS
-- =========================================================

alter table public.blogs
enable row level security;


-- =========================================================
-- 5. CLEAN OLD POLICIES
-- =========================================================

drop policy if exists "Public can read blogs"
on public.blogs;

drop policy if exists "Authenticated users can create own blogs"
on public.blogs;

drop policy if exists "Authors can update own blogs"
on public.blogs;

drop policy if exists "Authors can delete own blogs"
on public.blogs;

drop policy if exists "Only authenticated author can create blog"
on public.blogs;

drop policy if exists "Only authenticated author can update blog"
on public.blogs;

drop policy if exists "Only authenticated author can delete blog"
on public.blogs;


-- =========================================================
-- 6. PUBLIC READ
-- =========================================================

-- Homepage, pagination, getBySlug dapat dibaca
-- tanpa login.

create policy "Public can read blogs"
on public.blogs
for select
to anon, authenticated
using (true);


-- =========================================================
-- 7. CREATE
-- =========================================================

-- User authenticated hanya boleh membuat blog
-- dengan author_id = user login.

create policy "Only authenticated author can create blog"
on public.blogs
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = author_id
);


-- =========================================================
-- 8. UPDATE
-- =========================================================

create policy "Only authenticated author can update blog"
on public.blogs
for update
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = author_id
)
with check (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = author_id
);


-- =========================================================
-- 9. DELETE
-- =========================================================

create policy "Only authenticated author can delete blog"
on public.blogs
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and
  (select auth.uid()) = author_id
);


-- =========================================================
-- 10. DATA API PERMISSIONS
-- =========================================================

grant usage
on schema public
to anon, authenticated;


-- Public hanya boleh SELECT

grant select
on public.blogs
to anon;


-- Admin/user login boleh CRUD

grant select, insert, update, delete
on public.blogs
to authenticated;


-- Explicitly pastikan anon tidak bisa CRUD langsung

revoke insert, update, delete
on public.blogs
from anon;


-- =========================================================
-- 11. LIKE FUNCTION
-- =========================================================

-- Jangan lakukan:
--
-- SELECT like_count
-- lalu
-- UPDATE like_count + 1
--
-- karena dapat terkena race condition.
--
-- Gunakan database function supaya increment atomic.


create or replace function public.increment_blog_like(
  p_slug text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_like_count bigint;
begin

  update public.blogs
  set like_count = like_count + 1
  where slug = p_slug
  returning like_count
  into new_like_count;


  if new_like_count is null then
    raise exception 'Blog not found';
  end if;


  return new_like_count;

end;
$$;


-- Jangan beri semua orang execute secara implisit

revoke all
on function public.increment_blog_like(text)
from public;


-- Pengunjung maupun admin boleh like

grant execute
on function public.increment_blog_like(text)
to anon, authenticated;


-- =========================================================
-- 12. STORAGE BUCKET
-- =========================================================

-- Public bucket untuk gambar blog.
--
-- 5 MB = 5 * 1024 * 1024 = 5242880 bytes

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id)
do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- =========================================================
-- 13. CLEAN STORAGE POLICIES
-- =========================================================

drop policy if exists "Authenticated users can upload blog images"
on storage.objects;

drop policy if exists "Users can read own blog images"
on storage.objects;

drop policy if exists "Users can update own blog images"
on storage.objects;

drop policy if exists "Users can delete own blog images"
on storage.objects;


-- =========================================================
-- 14. STORAGE SELECT
-- =========================================================

-- Public bucket TIDAK membutuhkan policy SELECT
-- untuk menampilkan gambar publik.
--
-- Tetapi authenticated user membutuhkan SELECT
-- untuk operasi seperti remove/list metadata.

create policy "Users can read own blog images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'blog-images'
  and
  owner_id = (select auth.uid()::text)
);


-- =========================================================
-- 15. STORAGE UPLOAD
-- =========================================================

-- Struktur file wajib:
--
-- blog-images/
--   USER_UUID/
--     RANDOM_UUID.webp

create policy "Authenticated users can upload blog images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and
  (storage.foldername(name))[1]
    = (select auth.uid()::text)
);


-- =========================================================
-- 16. STORAGE UPDATE
-- =========================================================

create policy "Users can update own blog images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-images'
  and
  owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'blog-images'
  and
  owner_id = (select auth.uid()::text)
);


-- =========================================================
-- 17. STORAGE DELETE
-- =========================================================

create policy "Users can delete own blog images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-images'
  and
  owner_id = (select auth.uid()::text)
);
