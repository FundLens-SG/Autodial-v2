# AutoDial Architecture Notes

AutoDial currently deploys as a pre-compiled single-file React app in `index.html`.
That is convenient for GitHub Pages, but it makes larger changes risky because
source components, build output, runtime constants, and deployment cache behavior
all live in one generated file.

## Current Rules For Production Fixes

- Keep `index.html` edits surgical.
- Bump `window.APP_VERSION` in `index.html` and `APP_VERSION` in `sw.js` together.
- Keep `manifest.json` as the single PWA manifest source.
- Sanitize any rich HTML before storing, syncing, or rendering it.
- Keep user API keys in per-user rows only, never in shared/global config.

## Recommended Source Layout

```text
src/
  app/
    App.jsx
    auth.js
    cloud-sync.js
    lead-import.js
    rich-text.js
    settings.jsx
  styles/
    app.css
public/
  manifest.json
  sw.js
  icon-180.png
  icon-192.png
  icon-512.png
dist/
  index.html
```

## Migration Path

1. Add a build tool such as Vite while keeping GitHub Pages output compatible.
2. Move pure helpers first: rich-text sanitization, cloud sync, key sync, lead
   parsing, status detection, and service-worker version constants.
3. Move UI sections into components only after helper extraction is stable.
4. Keep generated `dist/index.html` out of manual editing once the build exists.
5. Add a small smoke test that checks app version parity, manifest presence, and
   basic syntax before publishing.

The goal is not to rewrite the app in one pass. The safer path is to make each
future feature land in source files, compile to the deployed page, and leave the
current monolith as a compatibility bridge until it can be retired.
