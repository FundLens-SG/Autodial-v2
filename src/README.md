# AutoDial v2 Source Plan

This folder is the landing zone for moving AutoDial v2 out of the compiled `index.html` monolith.

Near-term rule:
- Keep production behavior in `index.html` until a real build step exists.
- Add new source modules here first when a feature is large enough to split safely.
- Mirror any production patch with `npm run validate` before publishing.

Suggested first extraction order:
1. `src/state` for role, sync, session, and lead helpers.
2. `src/components/dial` for the caller workspace.
3. `src/components/manage` for live activity, tracking, payroll, and settings.
4. `src/components/script` for script editor, reference notes, and version history.
