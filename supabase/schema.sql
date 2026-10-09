-- Execute once in the Supabase SQL Editor. Review before applying to an existing database.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9_-]{2,29}$' and username not in ('admin','api','go','login')),
  display_name text not null default 'Novo perfil' check (char_length(display_name) between 1 and 80),
  bio text check (char_length(bio) <= 280),
  avatar_url text,
  favicon_url text,
  verified boolean not null default false,
  theme jsonb not null default '{"preset":"neo-tokyo"}'::jsonb,
  socials jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  url text not null check (url ~* '^https?://'),
  icon text check (char_length(icon) <= 40),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  embed_type text not null default 'none' check (embed_type in ('none','spotify','youtube','soundcloud','apple_music')),
  position integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  constraint valid_schedule check (starts_at is null or ends_at is null or starts_at < ends_at)
);
create index if not exists links_owner_position on public.links(user_id, position, created_at);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references public.links(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('page_view','link_click')),
  country text check (country ~ '^[A-Z]{2}$'),
  device text check (device in ('desktop','mobile','tablet','other')),
  created_at timestamptz not null default now(),
  constraint event_link_consistency check ((event_type = 'page_view' and link_id is null) or (event_type = 'link_click' and link_id is not null))
);
create index if not exists analytics_profile_time on public.analytics_events(profile_id, created_at desc);
create index if not exists analytics_link_time on public.analytics_events(link_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.analytics_events enable row level security;

create policy "Public profiles are readable" on public.profiles for select to anon, authenticated using (true);
create policy "Owners create profiles" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Owners update profiles" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Owners delete profiles" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy "Published links are readable" on public.links for select to anon using (
  is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())
);
create policy "Published or owned links are readable" on public.links for select to authenticated using (
  (select auth.uid()) = user_id or (is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()))
);
create policy "Owners create links" on public.links for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Owners update links" on public.links for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Owners delete links" on public.links for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Owners read analytics" on public.analytics_events for select to authenticated using ((select auth.uid()) = profile_id);
-- No direct INSERT/UPDATE/DELETE policies: events are written through the constrained function below.

create or replace function public.record_event(p_profile_id uuid, p_link_id uuid, p_event_type text, p_country text default null, p_device text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_event_type not in ('page_view', 'link_click') then raise exception 'Invalid event type'; end if;
  if p_country is not null and p_country !~ '^[A-Z]{2}$' then p_country := null; end if;
  if p_device not in ('desktop','mobile','tablet','other') then p_device := 'other'; end if;
  if not exists (select 1 from public.profiles where id = p_profile_id) then raise exception 'Profile not found'; end if;
  if p_event_type = 'page_view' then
    if p_link_id is not null then raise exception 'Page view cannot have a link'; end if;
  elsif p_link_id is null or not exists (
    select 1 from public.links where id = p_link_id and user_id = p_profile_id and is_active
      and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())
  ) then raise exception 'Link unavailable'; end if;
  insert into public.analytics_events(profile_id, link_id, event_type, country, device)
  values (p_profile_id, p_link_id, p_event_type, p_country, p_device);
end;
$$;
revoke all on function public.record_event(uuid,uuid,text,text,text) from public;
grant execute on function public.record_event(uuid,uuid,text,text,text) to anon, authenticated;

create or replace function public.analytics_summary(p_profile_id uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'views', count(*) filter (where event_type = 'page_view'),
    'clicks', count(*) filter (where event_type = 'link_click'),
    'by_day', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'views', views, 'clicks', clicks) order by day) from (
      select date_trunc('day', created_at)::date as day,
        count(*) filter (where event_type = 'page_view') as views,
        count(*) filter (where event_type = 'link_click') as clicks
      from public.analytics_events where profile_id = p_profile_id and created_at >= now() - interval '30 days'
      group by 1
    ) d), '[]'::jsonb),
    'by_link', coalesce((select jsonb_agg(jsonb_build_object('link_id', link_id, 'clicks', clicks)) from (
      select link_id, count(*) as clicks from public.analytics_events
      where profile_id = p_profile_id and event_type = 'link_click' group by link_id
    ) l), '[]'::jsonb),
    'by_country', coalesce((select jsonb_agg(jsonb_build_object('country', country, 'count', total)) from (
      select coalesce(country, '??') as country, count(*) as total from public.analytics_events
      where profile_id = p_profile_id group by 1 order by 2 desc limit 8
    ) c), '[]'::jsonb),
    'by_device', coalesce((select jsonb_agg(jsonb_build_object('device', device, 'count', total)) from (
      select coalesce(device, 'other') as device, count(*) as total from public.analytics_events
      where profile_id = p_profile_id group by 1 order by 2 desc
    ) v), '[]'::jsonb)
  ) from public.analytics_events where profile_id = p_profile_id;
$$;
revoke all on function public.analytics_summary(uuid) from public;
grant execute on function public.analytics_summary(uuid) to authenticated;

create or replace function public.set_link_order(p_ids uuid[])
returns void language plpgsql security invoker set search_path = '' as $$
declare owner_id uuid := (select auth.uid());
begin
  if owner_id is null or coalesce(array_length(p_ids, 1), 0) <> (select count(*) from public.links where user_id = owner_id)
    or (select count(distinct requested.id) from unnest(p_ids) as requested(id)) <> coalesce(array_length(p_ids, 1), 0)
    or exists (select 1 from unnest(p_ids) as requested(id) where not exists (select 1 from public.links where links.id = requested.id and user_id = owner_id))
  then raise exception 'Invalid link order'; end if;
  update public.links as link set position = ordered.ordinality - 1
  from unnest(p_ids) with ordinality as ordered(id, ordinality)
  where link.id = ordered.id and link.user_id = owner_id;
end;
$$;
revoke all on function public.set_link_order(uuid[]) from public;
grant execute on function public.set_link_order(uuid[]) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-assets', 'profile-assets', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
create policy "Public profile images" on storage.objects for select to anon, authenticated using (bucket_id = 'profile-assets');
create policy "Owners upload images" on storage.objects for insert to authenticated with check (
  bucket_id = 'profile-assets' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Owners replace images" on storage.objects for update to authenticated using (
  bucket_id = 'profile-assets' and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Owners remove images" on storage.objects for delete to authenticated using (
  bucket_id = 'profile-assets' and (storage.foldername(name))[1] = (select auth.uid())::text
);
