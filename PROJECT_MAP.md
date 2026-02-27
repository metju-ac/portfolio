# Project Map: PortfolioXP

> This document is a comprehensive reference for AI agents working on this codebase.
> Last updated: 2026-02-27 (updated after Phase 3 changes)

## 1. Project Overview

**What it is:** A Windows XP desktop simulator serving as a personal portfolio website.
**Author:** Matej Klima (matej.klima5@gmail.com)
**Original author:** Paul Jaguin -- [PortfolioXP](https://github.com/UnMugViolet/portfolio)
**License:** MIT (dual copyright: Paul Jaguin 2024 original, Matej Klima 2026 fork)

The application presents a faithful recreation of the Windows XP desktop environment, complete with
draggable/resizable windows, a taskbar, start menu, and multiple "applications" (projects, CV,
contact form, music player, Minesweeper, terminal, etc.).

## 2. Technology Stack

| Layer            | Technology                                                           |
| ---------------- | -------------------------------------------------------------------- |
| Language         | JavaScript (ES modules, no TypeScript)                               |
| UI Framework     | Vue 3 (Composition API, `<script setup>`)                            |
| Build System     | Vite 7.x                                                             |
| State Management | Pinia 3.x                                                            |
| Routing          | Vue Router 4.x (history mode)                                        |
| CSS              | Tailwind CSS 3.x + custom SCSS (Sass)                                |
| i18n             | vue-i18n (English only, i18n infrastructure kept for future locales) |
| Analytics        | Matomo (vue-matomo, production only)                                 |
| Email            | EmailJS (@emailjs/browser, client-side only)                         |
| Special          | ical.js (calendar)                                                   |
| Meta/SEO         | @vueuse/head                                                         |

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
│   ├── ADDING_MUSIC.md     # How to add music tracks
│   └── AGENT_GUIDELINES.md # Workflow rules for AI agents
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
│   │   ├── windows-data.json       # 10 windows + 1 external link (see Section 6)
│   │   ├── projects-data.json      # 7 portfolio projects (2 categories)
│   │   ├── playlist-data.json      # Music tracks metadata (currently empty)
│   │   ├── cv-data.json            # Education (4) + work experience (6)
│   │   ├── terminal-data.json      # Fake terminal command outputs
│   │   ├── pictures-data.json      # 8 photo carousel entries
│   │   ├── left-menu-data.json     # XP-style left sidebar menus (LinkedIn + GitHub links)
│   │   ├── header-tools-data.json  # Window toolbar button configs
│   │   └── header-menu-data.json   # Window menu bar items (File, Edit, View...)
│   │
│   ├── locales/            # Internationalization
│   │   └── en.json         # English translations
│   │
│   ├── layouts/            # Reusable layout wrappers
│   │   ├── Window.vue      # Window chrome (dragging, resizing, title bar, tools)
│   │   ├── DesktopAppsLayout.vue  # Grid of desktop icons (handles external links)
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
│       │   ├── Pictures.vue         # Photo carousel
│       │   ├── Minesweeper.vue      # Full Minesweeper game
│       │   ├── Terminal.vue         # Fake Windows terminal
│       │   ├── WindowHeaderDropdown.vue  # Header dropdown menu
│       │   ├── WindowHeaderSearch.vue    # Header search bar
│       │   ├── WindowHeaderTools.vue     # Header toolbar buttons
│       │   ├── WindowLeftMenu.vue        # Left sidebar menu
│       │   │
│       │   ├── Calendar/
│       │   │   ├── Calendar.vue     # Monthly calendar with ICS parsing
│       │   │   └── icsParser.js     # ICS file parser
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
│       │   ├── MyCV/
│       │   │   ├── MyCV.vue         # Resume/CV display
│       │   │   ├── ProfileHeader.vue    # CV profile header
│       │   │   ├── EducationItem.vue    # Education entry
│       │   │   └── WorkExperienceItem.vue # Work experience entry
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
│   ├── videos/             # Project video (montage-serveur.mp4)
│   ├── pdf/                # Downloadable CV (English)
│   ├── calendar/           # ICS files (calendar-en.ics)
│   ├── img/
│   │   ├── icons/          # 100+ WebP/SVG icons organized by window type
│   │   │   ├── github-icon-lg.webp  # GitHub desktop/external link icon
│   │   │   ├── side-menu/           # Left sidebar icons (github, linkedin, etc.)
│   │   │   ├── calendar/
│   │   │   ├── contact/
│   │   │   ├── cv/
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

### 10 Windows + 1 External Link

| ID          | Component   | Type     | Description                                    |
| ----------- | ----------- | -------- | ---------------------------------------------- |
| myProjects  | MyProjects  | window   | Portfolio with 7 project detail sub-views      |
| contact     | ContactMe   | window   | Email form via EmailJS                         |
| myCV        | MyCV        | window   | Resume with education/experience, PDF download |
| music       | Music       | window   | Spotify-like player (currently empty playlist) |
| documents   | Documents   | window   | File browser (About, Legal pages)              |
| pictures    | Pictures    | window   | Photo carousel (8 travel photos)               |
| calendar    | Calendar    | window   | Monthly calendar parsing local ICS files       |
| minesweeper | Minesweeper | window   | Full Minesweeper game                          |
| notepad     | Notepad     | window   | Simple text editor                             |
| terminal    | Terminal    | window   | Fake terminal with hardcoded responses         |
| github      | --          | external | Opens https://github.com/metju-ac in new tab   |

### External Links Pattern

Entries in `windows-data.json` with `"isExternalLink": true` and a `"url"` field are treated
as external links rather than windows. They appear on the desktop and start menu but open a
new browser tab instead of a window. The logic is in:

- `DesktopAppsLayout.vue` -- `removeFilterAndToggle()` checks `entity.isExternalLink`
- `Header.vue` -- `toggleWindow()` checks `entity.isExternalLink`

External links do NOT require: component imports, event bindings in `Office.vue`, or store entries.

## 7. State Management (Pinia Stores)

| Store           | File               | Purpose                                     | Persistence  |
| --------------- | ------------------ | ------------------------------------------- | ------------ |
| windowsStore    | windowsStore.js    | Tracks open window IDs                      | localStorage |
| volumeStore     | volumeStore.js     | Audio volume, Audio element management      | localStorage |
| localeStore     | localeStore.js     | Current locale (en), syncs with vue-i18n    | localStorage |
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

| Variable                        | Used In                            | Purpose                 |
| ------------------------------- | ---------------------------------- | ----------------------- |
| VITE_APP_PORTFOLIO_DOMAIN_NAME  | PangaiaContent, ClenchContent      | Figma embed origin      |
| VITE_APP_ADMIN_NAME             | ContactMe                          | EmailJS recipient name  |
| VITE_APP_ADMIN_EMAIL_ADDRESS    | ContactMe                          | Contact email, mailto   |
| VITE_APP_PUBLIC_API_EMAILJS_KEY | ContactMe                          | EmailJS public API key  |
| VITE_APP_EMAILJS_SERVICE_ID     | ContactMe                          | EmailJS service ID      |
| VITE_APP_EMAILJS_TEMPLATE_ID    | ContactMe                          | EmailJS template ID     |
| NODE_ENV                        | main.js (via import.meta.env.MODE) | Matomo conditional init |

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
| Add a new project        | `projects-data.json`, new component in `MyProjects/`                               |
| Change styling/theme     | `tailwind.config.js`, `sass/`, component styles                                    |
| Modify routes            | `src/router/index.js`                                                              |
| Update translations      | `src/locales/en.json`                                                              |
| Modify CV data           | `src/data/cv-data.json`                                                            |
| Update music playlist    | `src/data/playlist-data.json`, add MP3/cover to public/ (see docs/ADDING_MUSIC.md) |
| Modify terminal commands | `src/data/terminal-data.json`                                                      |
| Change environment vars  | `.env.example`                                                                     |
| Modify SEO/meta tags     | `MetaUpdater.vue`, `index.html`                                                    |
| Modify left sidebar      | `src/data/left-menu-data.json`                                                     |
