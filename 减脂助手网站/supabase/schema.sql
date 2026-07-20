-- 在 Supabase SQL Editor 中执行。表不授予 anon/authenticated 访问权，只有 Edge Function 的 service role 可访问。
create table if not exists public.encrypted_profiles (
  sync_id uuid primary key,
  auth_hash text not null,
  bundle jsonb not null,
  revision integer not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.encrypted_profiles enable row level security;
revoke all on public.encrypted_profiles from anon, authenticated;

create table if not exists public.sync_rate_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  request_count integer not null default 1
);

alter table public.sync_rate_limits enable row level security;
revoke all on public.sync_rate_limits from anon, authenticated;

create or replace function public.consume_sync_quota(p_bucket text, p_limit integer default 60)
returns boolean language plpgsql security definer set search_path = public as $$
declare allowed boolean;
begin
  insert into sync_rate_limits(bucket, window_start, request_count)
  values (p_bucket, now(), 1)
  on conflict(bucket) do update set
    window_start = case when sync_rate_limits.window_start < now() - interval '1 hour' then now() else sync_rate_limits.window_start end,
    request_count = case when sync_rate_limits.window_start < now() - interval '1 hour' then 1 else sync_rate_limits.request_count + 1 end;
  select request_count <= p_limit into allowed from sync_rate_limits where bucket = p_bucket;
  return allowed;
end; $$;

revoke all on function public.consume_sync_quota(text, integer) from public, anon, authenticated;
