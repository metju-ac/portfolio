# Agent Workflow Guidelines

> Rules and conventions for AI agents working on this codebase.

## Commit Discipline

- **Each logical task gets its own separate git commit.** Do not bundle unrelated changes.
- **Always run `npm run build`** before committing and verify it succeeds. Do not commit broken builds.
- **Write clear commit messages** that explain what changed and why, not just what files were touched.

## Documentation

- **Update `PROJECT_MAP.md`** after any change that affects the project structure, window count, technology stack, directory layout, or key file references. Keep it accurate.
- **Create or update guides in `docs/`** when adding features that may need future reference (e.g., `docs/ADDING_MUSIC.md` already exists as an example). If a task involves non-obvious setup or conventions, document it.

## Adding / Removing a Window

The window system is data-driven. To add or remove a window, you must edit multiple files:

1. **`src/data/windows-data.json`** — add/remove the window definition entry
2. **`src/views/Office.vue`** — add/remove:
   - The component import
   - The entry in the `components` map object
   - The `@toggle-{id}` event binding on both `<Header>` and `<DesktopAppsLayout>`
3. **`src/data/header-menu-data.json`** — add/remove custom menu bar if the window has one (otherwise it uses `"default"`)
4. **Component file** in `src/components/Windows/` — create or delete
5. **Icons** in `public/img/icons/` — add or delete
6. **`src/locales/en.json`** — add/remove translation keys under `windows.{id}`
7. **`src/stores/goBackStore.js`** and **`src/components/Windows/WindowHeaderTools.vue`** — if the window uses back navigation (like projects, documents, services)
8. **`PROJECT_MAP.md`** — update the window count and table

## Adding External Links (Desktop / Start Menu)

External links (like GitHub, LinkedIn) are NOT windows — they are entries in `windows-data.json` with `"isExternalLink": true` and a `"url"` field. They appear on the desktop and/or start menu but open in a new browser tab instead of creating a window.

Check existing external link entries in `windows-data.json` for the pattern.

## Adding Text Files (Desktop .txt files)

Text files use a shared `TextFileViewer.vue` component. To add a new `.txt` file to the desktop:

1. **`src/data/text-files-data.json`** — add a new key with `title` and `content` fields
2. **`src/data/windows-data.json`** — add a window entry with `"component": "TextFileViewer"` and `"textFileId": "<key>"` matching the key from step 1
3. **`src/views/Office.vue`** — add `@toggle-{id}="openWindow('{id}')"` on both `<Header>` and `<DesktopAppsLayout>`

No new component file is needed. Check existing text file entries for the pattern.

## World Map (Visited Countries)

The `WorldMap.vue` component uses `vue-svg-map` + `@svg-maps/world`. Visited country IDs live in `src/data/visited-countries-data.json`. To update the list of visited countries, just edit that JSON array — no code changes needed.

Valid country IDs can be listed with: `node -e "import('@svg-maps/world').then(m => m.default.locations.forEach(l => console.log(l.id, l.name)))"`

## Verification Checklist

Before committing any change:

1. `npm run build` passes
2. No unintended files are staged (check `git status`)
3. `PROJECT_MAP.md` is updated if structural changes were made
4. No leftover references to removed features (search with `rg` or grep)

## Code Conventions

- Vue 3 Composition API with `<script setup>` syntax
- JavaScript only (no TypeScript)
- Tailwind CSS for styling, custom SCSS in `sass/` for complex styles
- Static JSON data files in `src/data/` drive the UI — prefer data-driven changes over hardcoding
- All locale strings in `src/locales/en.json` — use `$t()` in templates, `t()` in scripts
- Image assets go in `public/img/` (served as-is, referenced with absolute paths like `/img/...`)

## Environment

- Build: `npm run build` (outputs to `dist/`)
- Dev: `npm run dev:all` (Vite + SCSS watch in parallel)
- No backend, no SSR — pure static SPA
