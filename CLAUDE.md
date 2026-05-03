# Autodial-v2 — canonical fresh clone

This is the canonical Autodial-v2 working tree (correct remote: `FundLens-SG/Autodial-v2`). The older `C:\Creations\Autodial\` has the wrong remote — do NOT push from there.

## Where to start

The full project context lives in **`C:\Creations\ckgtools\CLAUDE.md`** under "Phase 7 — what's done" and the file map. Read that first. This file only captures Autodial-specific state that wouldn't be obvious from the code alone.

For generic editing rules and the Autodial product invariants (queue state, call state, persistence rules), read `AGENTS.md` next door.

## Current state — Phase 7B2 done, NOT pushed to GitHub

As of 2026-05-03, this clone has been **fully migrated** to the new ckgtools architecture:

- **Auth:** `_SB_HUB` and `_SB` collapsed into a single Supabase client pointed at `ckgtools-admin` (project ref `cbqbvctnrfbxjscgirpn`). `window._SB_HUB = _SB` kept as a back-compat alias.
- **Identity:** comes from the ckgtools.com hub (Google OAuth via `ckgtools-admin`). `authCheck()` reads the hub session, looks up role from `public.profiles`, bounces to `/` on miss. Email/password UI is gone.
- **Data:** all 151 legacy `_SB.from('autodial_admin_config').<…>` callsites have been converted or eliminated. Data lives in the `autodial.*` schema on ckgtools-admin (`autodial.sessions`, `autodial.call_log`, `autodial.appointments`, `autodial.user_settings`, `autodial.user_secrets`, `autodial.global_state`, `autodial.shared_admin_configs`, `autodial.shared_appointments`, `autodial.shared_scripts`, `autodial.supervisor_assignments`, `autodial.leads`, `autodial.lead_claims`, `autodial.notifications`, `autodial.user_config`, etc.). Full mapping in `ckgtools/CLAUDE.md` § "Phase 7B2 active state".
- **Drive OAuth:** still uses Autodial's existing Worker (`autodial-google-auth.chungakwanc.workers.dev`) for the broader scopes (`spreadsheets calendar.events drive.readonly`) — hub OAuth is `drive.file`-only and would trigger Google CASA verification if expanded. Plan: keep the Worker post-7B2.
- **User Management UI** (showApprovalModal's user list / Fix-missing SQL helper) **stripped** — admin lives at the hub now. The Modal still hosts the Owner-only Danger Zone (Nuclear Reset), which now operates against autodial source tables.
- **`profiles` callsites reduced from 13 → 3** (the only legitimate ones: `_uidByEmail` helper, `authCheck`, cross-user discovery batch). All other reads/writes to `public.profiles` are gone.

## Required SQL migrations (must be applied to ckgtools-admin before this code works)

1. `ckgtools/sql/05_autodial_schema.sql` — schema, RLS, realtime publication, owner row seed.
2. `ckgtools/sql/06_autodial_uid_by_email.sql` — `autodial.uid_by_email(text)` + `autodial.emails_by_uids(uuid[])` security-definer RPCs (cross-user uuid resolution; `public.profiles` is email-keyed and RLS-locked so client-side joins on `auth.users` are impossible). Also relaxes `call_log.session_id` to text, bumps `user_settings.sync_version` to bigint, and reloads PostgREST schema cache.

Both already ran on ckgtools-admin (`cbqbvctnrfbxjscgirpn`). If you spin up a clean Supabase project, run them again.

## Things to know before editing

- **`window._uidByEmail(email)` is the canonical email→uuid resolver** (defined near the top of `index.html`, after `_initSupabaseClient`). Memoized per session. Calls the `autodial.uid_by_email` RPC. Use it before any cross-user write.
- **The Supabase polyfill in `_initSupabaseClient`** wraps `_SB.from(…)` AND `_SB.schema(…).from(…)` with two behaviors: (1) adds `.catch()` to the thenable returned by `upsert/insert/update/delete` (UMD bundle returns thenables that lack `.catch()`); (2) auto-logs `{error}` from supabase-js responses as `[supa <schema>.<table>.<method>] <code> <message> <details> <hint>`. **Don't add raw upserts that bypass this** — the auto-error-logging is how we caught the migration bugs.
- **Eliminated keys** (no longer remotely persisted): `lb_*`, `dappt_*`, `live_*`, `apptlive_*`, `sess_*`, `asess_*`, `slog_*`, `slogclear_*`, `payh_*`, `bcyc_*`, `dsets_*`, `stars_*`, `prcv_*`, `promo_*`, `incv_*`, `ts_*`, `revoked_*`, `invite_*`. Most were caches derivable from source tables (`sessions`, `payments`, `incentives`, `appointments`); the rest were hub-handled (revocation/invites). If you need cross-device sync for a feature whose key got eliminated, query the source table or wire a new realtime channel — don't reintroduce a polymorphic blob.
- **Push-to-GitHub gate:** the canonical remote is `FundLens-SG/Autodial-v2`. The current local state has NOT been pushed yet. When you push, GitHub Actions (`notify-ckgtools.yml`) fires `repository_dispatch` to ckgtools, which auto-syncs `index.html` into `ckgtools/public/tools/autodial/`. Don't push without the user's say-so. The same `index.html` was already manually copied to `ckgtools/public/tools/autodial/index.html` so the live site (Cloudflare Pages dev-mode at `localhost:5173/tools/autodial/`) already runs the new code.

## Smoke test recipe

```powershell
cd C:\Creations\ckgtools
npm run dev
```

Open `http://localhost:5173/tools/autodial/`, sign in via the hub Google account, run a session, watch DevTools console + Network for:

- ✅ `[Auth] Hub user: <email>` appears
- ✅ Zero requests to `urwfmmgsfunbvwngejey.supabase.co` (the legacy project)
- ✅ Zero `[supa <table>.<method>]` warning lines
- Pre-existing noise (NOT migration-related): `apple-mobile-web-app-capable` deprecation, `[repairTabHeaders] Timesheet/Logs a1Col is not defined` (linked Google Sheet's tabs are missing expected header columns).

## Phase 8 follow-ups (deferred from 7B2)

- `usersList` / `pendingUsers` state vars are still declared but always empty after the UM strip. Remove the declarations + the `_acfgScrubbedRef`-style scrub effects in a tidy-up pass.
- Pay-tab admin sessions effect is now an empty no-op — wire it to query `autodial.sessions` directly when the pay tab opens.
- `pullAssignedLeads`/`pullLeads`/`pullAppts`/`pullLive` are no-ops. The realtime channel via `DB.subscribeLive` covers most cases; if you need pre-realtime initial state, add a one-time fetch on the appropriate effect (e.g. `DB.getLeads(uid)` on mount).
- `leaderboard` is now derived inline from `autodial.sessions` for today. Consider extracting into a dedicated `DB.getTodayLeaderboard()` helper.
- `[repairTabHeaders] a1Col is not defined` — pre-existing template-detection issue on linked Google Sheets. Not migration-related; investigate when convenient.
