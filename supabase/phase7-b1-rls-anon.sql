-- ═══════════════════════════════════════════════════════════════
-- Phase 7 (B1) — Loosen RLS on the legacy AutoDial Supabase project
-- (project ref: urwfmmgsfunbvwngejey)
-- ═══════════════════════════════════════════════════════════════
-- WHY: AutoDial's authentication has moved to the ckgtools.com hub
-- (project: cbqbvctnrfbxjscgirpn). The hub session does NOT carry an
-- authenticated JWT for this legacy project, so every existing RLS
-- policy that requires `to authenticated` rejects the request.
--
-- B1 keeps AutoDial's data on this legacy project as a transitional
-- step. To make queries work, we add `anon` read/write access to all
-- AutoDial tables. This is intentionally permissive — appropriate for
-- an in-house tool whose anon key is already in the static client
-- bundle and which is gated by ckgtools.com role checks before reaching
-- this surface.
--
-- WHEN B2 LANDS: this entire project becomes obsolete. All data moves
-- to `autodial` schema in ckgtools-admin with proper user_id RLS, and
-- this anon access can be revoked.
--
-- HOW TO APPLY: open Supabase SQL Editor for the LEGACY autodial
-- project (urwfmmgsfunbvwngejey) — NOT ckgtools-admin — and run this
-- file. Idempotent.
-- ═══════════════════════════════════════════════════════════════

-- The 11 AutoDial tables (autodial_admin_config + autodial_*) plus
-- profiles. Each gets a permissive "B1 transitional" policy for anon.
do $$
declare
  t text;
  tbls text[] := array[
    'profiles',
    'autodial_admin_config',
    'autodial_appointments',
    'autodial_calendar_shares',
    'autodial_call_log',
    'autodial_cb_queue',
    'autodial_incentives',
    'autodial_notifications',
    'autodial_payments',
    'autodial_sessions',
    'autodial_wa_templates'
  ];
begin
  foreach t in array tbls
  loop
    -- Drop any prior B1 policy so re-runs are clean
    execute format(
      'drop policy if exists "phase7 b1 anon access" on public.%I',
      t
    );
    -- Permissive anon policy. Authenticated users keep whatever existing
    -- policies they have (Postgres OR-combines permissive policies).
    execute format(
      'create policy "phase7 b1 anon access" on public.%I '
      'for all to anon using (true) with check (true)',
      t
    );
    raise notice 'phase7-b1: anon access granted on %', t;
  end loop;
end $$;

-- Also explicitly grant table-level DML to anon. RLS controls per-row
-- access, but the role still needs the underlying table grants.
grant select, insert, update, delete on
  public.profiles,
  public.autodial_admin_config,
  public.autodial_appointments,
  public.autodial_calendar_shares,
  public.autodial_call_log,
  public.autodial_cb_queue,
  public.autodial_incentives,
  public.autodial_notifications,
  public.autodial_payments,
  public.autodial_sessions,
  public.autodial_wa_templates
to anon;

-- Sanity audit query (optional). After running the script, verify:
--   select schemaname, tablename, policyname, roles
--   from pg_policies
--   where tablename like 'autodial_%' or tablename = 'profiles'
--   order by tablename, policyname;
-- The "phase7 b1 anon access" policy should appear on every table.
