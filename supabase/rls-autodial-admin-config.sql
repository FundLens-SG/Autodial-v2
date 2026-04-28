-- AutoDial per-user Claude key RLS.
--
-- Apply this in the Supabase SQL editor for the live project.
-- Important: if the table currently has broad SELECT/INSERT/UPDATE policies,
-- remove or replace those broad policies. Supabase combines permissive policies
-- with OR, so an old "allow all authenticated users" policy can still expose
-- claude_<email> rows.

alter table public.autodial_admin_config enable row level security;

drop policy if exists "autodial config read non claude rows" on public.autodial_admin_config;
drop policy if exists "autodial config read own claude key" on public.autodial_admin_config;
drop policy if exists "autodial config insert non claude rows" on public.autodial_admin_config;
drop policy if exists "autodial config insert own claude key" on public.autodial_admin_config;
drop policy if exists "autodial config update non claude rows" on public.autodial_admin_config;
drop policy if exists "autodial config update own claude key" on public.autodial_admin_config;
drop policy if exists "autodial config delete non claude rows" on public.autodial_admin_config;
drop policy if exists "autodial config delete own claude key" on public.autodial_admin_config;

create policy "autodial config read non claude rows"
on public.autodial_admin_config
for select
to authenticated
using (admin_email not like 'claude_%');

create policy "autodial config read own claude key"
on public.autodial_admin_config
for select
to authenticated
using (admin_email = 'claude_' || lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "autodial config insert non claude rows"
on public.autodial_admin_config
for insert
to authenticated
with check (admin_email not like 'claude_%');

create policy "autodial config insert own claude key"
on public.autodial_admin_config
for insert
to authenticated
with check (admin_email = 'claude_' || lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "autodial config update non claude rows"
on public.autodial_admin_config
for update
to authenticated
using (admin_email not like 'claude_%')
with check (admin_email not like 'claude_%');

create policy "autodial config update own claude key"
on public.autodial_admin_config
for update
to authenticated
using (admin_email = 'claude_' || lower(coalesce(auth.jwt() ->> 'email', '')))
with check (admin_email = 'claude_' || lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "autodial config delete non claude rows"
on public.autodial_admin_config
for delete
to authenticated
using (admin_email not like 'claude_%');

create policy "autodial config delete own claude key"
on public.autodial_admin_config
for delete
to authenticated
using (admin_email = 'claude_' || lower(coalesce(auth.jwt() ->> 'email', '')));

-- Optional audit query: run this after applying the policies and confirm there
-- are no remaining broad policies that expose claude_<email> rows.
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'autodial_admin_config'
order by policyname;
