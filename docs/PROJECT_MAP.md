# Project Map: PortfolioXP

> This document is a comprehensive reference for AI agents working on this codebase.
> Last updated: 2026-03-03 (removed MyCV window; removed My Pictures window; fixed YouTube player in USA travel folder; fixed image aspect ratio in TravelPhotos)

## 1. Project Overview

**What it is:** A Windows XP desktop simulator serving as a personal portfolio website.
**Author:** Matej Klima (matej.klima5@gmail.com)
**Original author:** Paul Jaguin -- [PortfolioXP](https://github.com/UnMugViolet/portfolio)
**License:** MIT (dual copyright: Paul Jaguin 2024 original, Matej Klima 2026 fork)

The application presents a faithful recreation of the Windows XP desktop environment, complete with
draggable/resizable windows, a taskbar, start menu, and multiple "applications" (projects,
contact form, music player, Minesweeper, terminal, etc.).

## 2. Technology Stack

| Layer            | Technology                                                                   |
| ---------------- | ---------------------------------------------------------------------------- |
| Language         | JavaScript (ES modules, no TypeScript)                                       |
| UI Framework     | Vue 3 (Composition API, `<script setup>`)                                    |
| Build System     | Vite 7.x                                                                     |
| State Management | Pinia 3.x                                                                    |
| Routing          | Vue Router 4.x (history mode)                                                |
| CSS              | Tailwind CSS 3.x + custom SCSS (Sass)                                        |
| i18n             | vue-i18n (English + Czech, with language switcher on lockscreen and desktop) |
| Analytics        | Matomo (vue-matomo, production only)                                         |
| Email            | EmailJS (@emailjs/browser, client-side only)                                 |
| Special          | vue-svg-map + @svg-maps/world (world map)                                    |
| Meta/SEO         | @vueuse/head                                                                 |

**Note:** `axios` is declared in package.json but **never imported or used** anywhere.

## 3. Architecture Type

This is a **100% client-side Single Page Application (SPA)**. There is:

- No server-side rendering (SSR)
- No backend API
- No database
- No server-side form processing
- No WebSockets or real-time features
- No authentication (the "login" is purely cosmetic)

The production build produces **static files only** (HTML, JS, CSS, assets).

## 4. Directory Structure

```
portfolio/
├── index.html              # SPA entry point (custom fonts)
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite config (Vue, JSX, DevTools, i18n plugins)
├── tailwind.config.js      # Tailwind theme (XP colors, fonts, cursors, gradients)
├── postcss.config.js       # PostCSS (tailwindcss + autoprefixer)
├── .eslintrc.cjs           # ESLint config
├── .prettierrc.json        # Prettier config
├── .env.example            # Environment variable template
├── LICENSE                 # MIT (dual copyright)
├── README.md               # Project readme
├── PROJECT_MAP.md          # This file
│
├── docs/                   # GUIDES & DOCUMENTATION
│   ├── ADDING_MUSIC.md        # How to add music tracks
│   ├── ADDING_TRAVEL_PHOTOS.md # How to add/manage travel photo folders via Cloudinary
│   └── AGENT_GUIDELINES.md    # Workflow rules for AI agents
│
├── src/                    # APPLICATION SOURCE CODE
│   ├── main.js             # Vue app bootstrap (plugins, Matomo, i18n, router)
│   ├── App.vue             # Root component (MetaUpdater + RouterView)
│   ├── MetaUpdater.vue     # Dynamic SEO meta tags via @vueuse/head
│   ├── index.css           # Tailwind directives + global styles
│   │
│   ├── router/
│   │   └── index.js        # 2 routes: "/" (Loader) and "/office" (Office)
│   │
│   ├── views/
│   │   ├── Loader.vue      # Boot/login screen (XP startup sequence)
│   │   └── Office.vue      # Main desktop (window orchestrator, taskbar, start menu)
│   │
│   ├── stores/             # Pinia state management
│   │   ├── windowsStore.js # Open window IDs, localStorage persistence
│   │   ├── volumeStore.js  # Audio volume, HTML5 Audio management
│   │   ├── localeStore.js  # Current locale (en), syncs with vue-i18n
│   │   ├── goBackStore.js  # Active project/document for back navigation
│   │   └── connectionStore.js # Login state: restart -> loggedIn -> disconnected
│   │
│   ├── data/               # Static JSON data (drives the entire UI)
│   │   ├── windows-data.json       # 11 windows + 2 external links (see Section 6)
│   │   ├── visited-countries-data.json  # Country IDs for World Map (ISO 2-letter codes)
│   │   ├── text-files-data.json    # Content for TextFileViewer windows (beer_records, rivers)
│   │   ├── projects-data.json      # 7 portfolio projects (2 categories)
│   │   ├── playlist-data.json      # Music tracks metadata (currently empty)
│   │   ├── terminal-data.json      # Fake terminal command outputs
│   │   ├── travel-photos-data.json # Folder/trip structure for TravelPhotos window
│   │   ├── left-menu-data.json     # XP-style left sidebar menus (LinkedIn + GitHub links)
│   │   ├── header-tools-data.json  # Window toolbar button configs
│   │   └── header-menu-data.json   # Window menu bar items (File, Edit, View...)
│   │
│   ├── locales/            # Internationalization
│   │   ├── en.json         # English translations
│   │   └── cs.json         # Czech translations
│   │
│   ├── layouts/            # Reusable layout wrappers
│   │   ├── Window.vue      # Window chrome (dragging, resizing, title bar, tools)
│   │   ├── DesktopAppsLayout.vue  # Draggable, absolutely-positioned desktop icons (configurable via desktopPosition)
│   │   └── ContentCenter.vue      # Centered content wrapper
│   │
│   └── components/         # UI components
│       ├── ProfilePicture.vue      # Profile photo display
│       │
│       ├── Header/
│       │   ├── Header.vue           # Start menu items + desktop taskbar (handles external links)
│       │   └── RightFeatureLayout.vue # Right-side header feature layout
│       │
│       ├── Footer/
│       │   ├── Footer.vue           # Main footer/taskbar container
│       │   ├── FooterRight.vue      # System tray (clock, volume, fullscreen toggle)
│       │   ├── CurrentTime.vue      # Clock display
│       │   └── PelletApp.vue        # Open window tabs in taskbar
│       │
│       ├── Loading/
│       │   ├── Login.vue            # XP login form (cosmetic only)
│       │   ├── LoginForm.vue        # Login form fields
│       │   ├── LoadingBar.vue       # Animated loading bar
│       │   ├── Step1Loading.vue     # Black screen (300ms)
│       │   ├── Step2Loading.vue     # Loading bar (800ms)
│       │   └── Step3Loading.vue     # Blue screen (400ms)
│       │
│       ├── Windows/                 # One component per "application window"
│       │   ├── MyProjects.vue       # Project portfolio browser
│       │   ├── ContactMe.vue        # Contact form (EmailJS)
│       │   ├── Notepad.vue          # Simple text editor
│       │   ├── TextFileViewer.vue   # Read-only text file viewer (data-driven)
│       │   ├── WorldMap.vue        # Interactive world map showing visited countries
│       │   ├── TravelPhotos.vue     # Cloudinary-backed travel photo/video browser (two-level folder tree)
│       │   ├── Minesweeper.vue      # Full Minesweeper game
│       │   ├── Terminal.vue         # Fake Windows terminal
│       │   ├── WindowHeaderDropdown.vue  # Header dropdown menu
│       │   ├── WindowHeaderSearch.vue    # Header search bar
│       │   ├── WindowHeaderTools.vue     # Header toolbar buttons
│       │   ├── WindowLeftMenu.vue        # Left sidebar menu
│       │   │
│       │   ├── Documents/
│       │   │   ├── Documents.vue    # File browser (About, Legal)
│       │   │   ├── About.vue        # About page (bio + attribution)
│       │   │   └── Legal.vue        # Legal page
│       │   │
│       │   ├── Music/
│       │   │   ├── Music.vue        # Spotify-like music player
│       │   │   └── Player.vue       # Audio player controls
│       │   │
│       │   └── MyProjects/          # Project detail sub-views
│       │       ├── AidellaContent.vue
│       │       ├── ClenchContent.vue
│       │       ├── Emc2Content.vue
│       │       ├── FannyContent.vue
│       │       ├── HomeserverContent.vue
│       │       ├── LogmaContent.vue
│       │       └── PangaiaContent.vue
│       │
│       ├── Modals/
│       │   ├── LanguageModal.vue    # Language selector popup
│       │   └── MusicVolumeModal.vue # Volume control popup
│       │
│       ├── Buttons/
│       │   ├── Button.vue           # Reusable XP-style button
│       │   ├── StartButton.vue      # Start menu button
│       │   ├── HeaderLeftButton.vue  # Left header button
│       │   ├── HeaderRightButton.vue # Right header button
│       │   ├── HeaderDisconnect.vue  # Disconnect/logoff button
│       │   ├── HeaderShutdown.vue    # Shutdown button
│       │   ├── WindowClose.vue      # Window close button
│       │   ├── WindowMaximize.vue   # Window maximize button
│       │   ├── WindowMinimize.vue   # Window minimize button
│       │   └── WindowDropdown.vue   # Window dropdown button
│       │
│       └── icons/
│           ├── WindowsIcon.vue      # Inline SVG Windows logo
│           └── ShutdownIcon.vue     # Inline SVG shutdown icon
│
├── public/                 # STATIC ASSETS (served as-is)
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── .htaccess
│   ├── fonts/              # Windows XP-era TTF fonts (tahoma, trebuchet, verdana, etc.)
│   ├── sounds/             # startup/shutdown MP3s
│   ├── pdf/                # Downloadable CV (English)
│   ├── img/
│   │   ├── icons/          # 100+ WebP/SVG icons organized by window type
│   │   │   ├── github-icon-lg.webp  # GitHub desktop/external link icon
│   │   │   ├── world-map-icon-lg.webp  # World Map window icon (48px globe)
│   │   │   ├── world-map-icon-sm.webp  # World Map window icon (16px globe)
│   │   │   ├── side-menu/           # Left sidebar icons (github, linkedin, etc.)
│   │   │   ├── contact/
│   │   │   ├── documents/
│   │   │   ├── langs/
│   │   │   ├── minesweeper/
│   │   │   ├── music/
│   │   │   ├── notepad/
│   │   │   ├── pictures/
│   │   │   ├── projects/
│   │   │   └── windows-header-tools/
│   │   ├── projects/       # Project screenshots (aidella, pangaia)
│   │   └── *.webp          # Logos, profile picture, branding
│
├── sass/                   # SCSS source files
│   ├── main.scss           # Entry point (imports abstracts + components)
│   ├── abstracts/          # Variables, mixins
│   └── components/         # Component-specific SCSS
│
└── css/                    # Compiled CSS output
    ├── main.css
    └── main.css.map
```

## 5. Routes

| Path      | View Component | Description                           |
| --------- | -------------- | ------------------------------------- |
| `/`       | `Loader.vue`   | XP boot sequence -> login screen      |
| `/office` | `Office.vue`   | Main desktop with all windows/taskbar |

Vue Router uses **history mode** (requires SPA fallback on the server).

## 6. Window System

`Office.vue` is the central orchestrator. It renders windows based on `windows-data.json` and
the `windowsStore`. Each window gets the `Window.vue` layout wrapper (drag, resize, title bar)
and renders the appropriate content component.

### 11 Windows + 1 External Link + 1 External mailto Link

| ID           | Component      | Type          | Description                                    |
| ------------ | -------------- | ------------- | ---------------------------------------------- |
| myProjects   | MyProjects     | window        | Portfolio with 7 project detail sub-views      |
| contact      | --             | external link | Opens mailto:matej.klima5@gmail.com            |
| music        | Music          | window        | Spotify-like player (currently empty playlist) |
| documents    | Documents      | window        | File browser (About, Legal pages)              |
| minesweeper  | Minesweeper    | window        | Full Minesweeper game                          |
| notepad      | Notepad        | window        | Simple text editor                             |
| terminal     | Terminal       | window        | Fake terminal with hardcoded responses         |
| beerRecords  | TextFileViewer | window        | Read-only text file (beer_records.txt)         |
| rivers       | TextFileViewer | window        | Read-only text file (rivers.txt)               |
| worldMap     | WorldMap       | window        | Interactive SVG world map of visited countries |
| travelPhotos | TravelPhotos   | window        | Cloudinary-backed travel photo/video browser   |
| github       | --             | external link | Opens https://github.com/metju-ac in new tab   |

### External Links Pattern

Entries in `windows-data.json` with `"isExternalLink": true` and a `"url"` field are treated
as external links rather than windows. They appear on the desktop and start menu but open a
new browser tab instead of a window. The logic is in:

- `DesktopAppsLayout.vue` -- `removeFilterAndToggle()` checks `entity.isExternalLink`
- `Header.vue` -- `toggleWindow()` checks `entity.isExternalLink`

External links do NOT require: component imports, event bindings in `Office.vue`, or store entries.

### Text File Viewer Pattern

Multiple desktop `.txt` files share a single `TextFileViewer.vue` component. Each file has its
own entry in `windows-data.json` with `"component": "TextFileViewer"` and a `"textFileId"` field
that references a key in `src/data/text-files-data.json`.

To add a new text file:

1. Add an entry to `text-files-data.json` with a key, title, and content
2. Add a window entry to `windows-data.json` with `"component": "TextFileViewer"` and `"textFileId": "<key>"`
3. Add toggle event bindings in `Office.vue` on `<Header>` and `<DesktopAppsLayout>`

No new component file is needed.

### World Map Pattern

The `WorldMap.vue` component uses `vue-svg-map` with `@svg-maps/world` to render an interactive
SVG world map. Visited countries are listed in `src/data/visited-countries-data.json` as an array
of ISO 2-letter country codes (e.g., `"cz"`, `"de"`, `"at"`).

- Visited countries are highlighted in blue (#3a7bd5), others in grey (#d4d4d4)
- Hovering over any country shows a tooltip with the country name
- The `locationAttributes` prop function applies per-country styling
- To add/remove visited countries, just edit `visited-countries-data.json`
- Full list of valid country IDs: run `node -e "import('@svg-maps/world').then(m => m.default.locations.forEach(l => console.log(l.id, l.name)))"`

### Desktop Icon Positioning

Desktop icons are placed on a virtual grid. Each icon's default grid cell is configured via
`desktopGridPos: { col, row }` (1-indexed) in `windows-data.json`.

- `DesktopAppsLayout.vue` converts `{ col, row }` to pixels using: `left = 20 + (col-1)*100`, `top = 20 + (row-1)*100`
- Grid cell size is 100×100px; origin is offset 20px from the top-left corner of the desktop
- If `desktopGridPos` is omitted, defaults to `{ col: 1, row: 1 }`
- Each icon has a fixed width of 80px (set via CSS)
- **Icons are draggable at runtime** — users can drag icons to reposition them
- While dragging, movement is smooth (live pixel tracking); on mouse release the icon **snaps to the nearest grid cell**
- Runtime positions are stored in a reactive `iconGridPos` map (NOT persisted — reloading restores config positions)
- A 5px drag threshold prevents accidental drags when clicking/double-clicking

## 7. State Management (Pinia Stores)

| Store           | File               | Purpose                                     | Persistence  |
| --------------- | ------------------ | ------------------------------------------- | ------------ |
| windowsStore    | windowsStore.js    | Tracks open window IDs                      | localStorage |
| volumeStore     | volumeStore.js     | Audio volume, Audio element management      | localStorage |
| localeStore     | localeStore.js     | Current locale (en/cs), syncs with vue-i18n | localStorage |
| goBackStore     | goBackStore.js     | Active project/document for back navigation | (none)       |
| connectionStore | connectionStore.js | Login state machine                         | (none)       |

## 8. External Service Dependencies

| Service | Library          | Purpose                  | When             |
| ------- | ---------------- | ------------------------ | ---------------- |
| EmailJS | @emailjs/browser | Send contact form emails | Runtime (client) |
| Matomo  | vue-matomo       | Analytics tracking       | Production only  |
| Figma   | iframe embeds    | Project design mockups   | Runtime (client) |

**All external calls are client-side.** No server-side dependencies exist.

## 9. Environment Variables

All use Vite's `import.meta.env` (build-time injection via `VITE_*` prefix):

| Variable                        | Used In                            | Purpose                                          |
| ------------------------------- | ---------------------------------- | ------------------------------------------------ |
| VITE_APP_PORTFOLIO_DOMAIN_NAME  | PangaiaContent, ClenchContent      | Figma embed origin                               |
| VITE_APP_ADMIN_NAME             | ContactMe                          | EmailJS recipient name                           |
| VITE_APP_ADMIN_EMAIL_ADDRESS    | ContactMe                          | Contact email, mailto                            |
| VITE_APP_PUBLIC_API_EMAILJS_KEY | ContactMe                          | EmailJS public API key                           |
| VITE_APP_EMAILJS_SERVICE_ID     | ContactMe                          | EmailJS service ID                               |
| VITE_APP_EMAILJS_TEMPLATE_ID    | ContactMe                          | EmailJS template ID                              |
| NODE_ENV                        | main.js (via import.meta.env.MODE) | Matomo conditional init                          |
| VITE_APP_CLOUDINARY_CLOUD_NAME  | TravelPhotos                       | Cloudinary cloud name for public asset list URLs |

## 10. Build & Scripts

| Script  | Command                                        | Purpose                   |
| ------- | ---------------------------------------------- | ------------------------- |
| dev     | `vite --host`                                  | Dev server                |
| sass    | `sass --watch sass/main.scss:css/main.css`     | Watch/compile SCSS        |
| dev:all | `npm-run-all --parallel dev sass`              | Dev + SCSS in parallel    |
| build   | `vite build`                                   | Production build -> dist/ |
| preview | `vite preview`                                 | Preview production build  |
| lint    | `eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix` | Lint and auto-fix         |
| format  | `prettier --write src/`                        | Format source             |

## 11. Deployment Architecture

Docker/Jenkins/Nginx deployment has been removed. The project is now a pure static SPA build.
Run `npm run build` to produce `dist/` which can be deployed to any static hosting (GitHub Pages,
Netlify, Vercel, etc.). SPA fallback for `/office` route is needed (e.g., copy index.html to 404.html).

## 12. Key Files for Common Changes

| Task                     | Files to modify                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Add a new window/app     | `windows-data.json`, new component in `Windows/`, `Office.vue`, `en.json`          |
| Add an external link     | `windows-data.json` (with `isExternalLink: true`, `url`). No component needed.     |
| Add a new text file      | `text-files-data.json` + `windows-data.json` + toggle events in `Office.vue`       |
| Add a new project        | `projects-data.json`, new component in `MyProjects/`                               |
| Change styling/theme     | `tailwind.config.js`, `sass/`, component styles                                    |
| Modify routes            | `src/router/index.js`                                                              |
| Update translations      | `src/locales/en.json`, `src/locales/cs.json`                                       |
| Update music playlist    | `src/data/playlist-data.json`, add MP3/cover to public/ (see docs/ADDING_MUSIC.md) |
| Modify terminal commands | `src/data/terminal-data.json`                                                      |
| Change environment vars  | `.env.example`                                                                     |
| Modify SEO/meta tags     | `MetaUpdater.vue`, `index.html`                                                    |
| Modify left sidebar      | `src/data/left-menu-data.json`                                                     |
