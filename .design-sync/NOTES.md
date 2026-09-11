# design-sync notes — shinji-no-sekai

This repo is a **Next.js 16 application**, not a component library. There is no `dist/`, no
library build, no Storybook, and `package.json` has no `main`/`module`/`exports`. Everything
below exists to bridge that gap. Read this before re-syncing.

## Build command

```sh
# 1. Tailwind must be precompiled (see below)
node .design-sync/tw-compile.mjs .design-sync/tailwind-entry.css .design-sync/pkg/compiled.css

# 2. Converter (note --entry: it is required, see PKG_DIR below)
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./.design-sync/pkg/entry.tsx --out ./ds-bundle

# 3. Validate. --no-render-check is only because no browser is installed (see below).
node .ds-sync/package-validate.mjs ./ds-bundle --no-render-check
```

Fresh clone also needs: `npm ci`, `(cd .ds-sync && npm i esbuild ts-morph @types/react)`,
and `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (the overrides fork
imports bare `ts-morph`; the symlink is gitignored, so it must be recreated per clone).

## The artist portal is gone

The authenticated artist portal and artist management were removed from the repo
entirely (not just from the sync): `/dashboard`, `/admin/artist`, `/admin/upload`, the
track/comment/version components and their `utils/db` + `utils/actions` modules. `/admin`
is now the site content editor itself, and `/login` exists only to reach it. The
`@/utils/actions/*` -> `stubs/actions/*` path alias in `tsconfig.ds.json` and the stubs it
pointed at went with them.

## Scope: public static site only

Synced components are **Navbar, Footer, LocaleSwitcher, LoadingFallback, Home** (5).
`ArtistCard` and `Bio` were removed by the Soft Overlap redesign: the bio route was folded
into the single page and the work card now lives inside `HomeView`. `Home` is no longer the
route — the route is a server component that reads MongoDB, so the bundle exports
`src/components/home/HomeView.tsx` (which takes `content` + `locale` props) along with
`DEFAULT_HOME_CONTENT`.

**The bundled fonts under `.design-sync/fonts/` are stale.** The redesign moved the site
from Jost / Lora / DM Sans to Instrument Serif / Zen Kaku Gothic New / JetBrains Mono; the
build below must be re-run to refresh `fonts.css` and the woff2 files. The admin console and the authenticated artist portal (Login, Dashboard,
TrackList, WaveformPlayer, CommentList, AddCommentModal, AddVersionModal,
CommentThreadModal, Breadcrumb, and the 10 admin components) were removed at the user's
request — the site is treated as static.

To restore any of them: re-add the export to `.design-sync/pkg/entry.tsx` **and** the
matching `componentSrcMap` + `dtsPropsFor` entries in `config.json`, re-add its
`.design-sync/previews/<Name>.tsx` and `.design-sync/docs/<Name>.md`, and — for anything
using `useAuth` (Login, Dashboard, SiteContentAdmin) — put `AuthProvider` back into
`.design-sync/ds-providers.tsx`. It was removed because no public component needs it and it
fires a failing `/api/auth/me` fetch on mount. Git history holds the deleted preview/doc
files.

## CRITICAL: the `process` shim

`_ds_bundle.js` bundles Next internals (`next/link`, `next/image`, `next/navigation`) that
read `process.env.*` **at module scope** — 22 references. Next's own build substitutes those
at compile time; the design-sync esbuild pass does not, and browsers have no `process`. The
first upload therefore threw `ReferenceError: process is not defined` before it could assign
`window.ShinjiNoSekai`, so every preview then failed on `"default" in g` and **every card
rendered blank** with `⚠ no PascalCase exports in _preview/<Name>.js`.

Fix: `.design-sync/pkg/process-shim.ts`, imported as the **first** import in `entry.tsx`
(ESM evaluates imports in order, so it runs before any Next module initializes). Do not
reorder that import, and keep it side-effect-only.

### Verifying without a browser

`package-validate.mjs --no-render-check` does NOT catch this class of bug — it checks files,
not execution. Load the bundle in a Node `vm` context that mimics a browser and, crucially,
**does not define `process`**; then load each `_preview/<Name>.js` and assert
`Object.keys(window.__dsPreview)` is non-empty and the component name is present on
`window.ShinjiNoSekai`. That reproduces the exact failure and catches any future
module-scope reference to a Node-only global. This is a cheap substitute for the real render
check, not a replacement for it.

## Gotchas discovered during the first sync

- **`PKG_DIR` must be bracket-free.** ts-morph globs `${PKG_DIR}/**/*.d.ts`, and Next's
  `src/app/[locale]/` dynamic-route dirs parse as glob **character classes**, crashing the
  scan with `Directory not found: src/app/[locale/]`. Fix: `.design-sync/pkg/` is a tiny
  anchor package (its own `package.json`) that `--entry` walks up to. Sources are still read
  live from `../../src` — nothing is copied.
- **Never symlink the repo into `node_modules/<pkg>`.** It self-recurses
  (`node_modules/shinji-no-sekai/node_modules/shinji-no-sekai/...`) until `ENAMETOOLONG`.
  The `--entry` route above is the supported way to set `PKG_DIR` in a self-repo.
- **All `cfg.*` paths resolve relative to `PKG_DIR`, not the repo root** (`cfgPath` does
  `resolve(PKG_DIR, rel)`; the `root` argument is only a security bound). Hence
  `tsconfig: "../tsconfig.ds.json"` and `extraFonts: ["../fonts/fonts.css"]`. A wrong path
  is **silently skipped** with a `! <field>: ... not found` line — grep the build log for
  `!` if something mysteriously has no effect.
- **Do not put a `"//"` comment key in `tsconfig.ds.json`.** The converter's comment
  stripper (`/(^|[^:])\/\/.*$/gm`) matches the `//` inside `"//":`, corrupts the JSON, and
  `tsconfigPathsPlugin` silently returns `null` on parse failure — so `paths` stop applying
  and the mongodb stubs quietly stop working. Cost an hour. Keep that file comment-free.
- **The synth entry is unusable here.** It does `export * from` every `.tsx` under `src/`,
  which drags in the server-rendered admin/track pages and with them `@/utils/db/*` →
  `mongodb` / `firebase-admin` → ~76 unresolved node builtins. `.design-sync/pkg/entry.tsx`
  lists the 26 components explicitly instead. **Add new components there**, not just to
  `componentSrcMap`, or they will not exist on `window.ShinjiNoSekai`.
- **Server actions are stubbed.** `@/utils/actions/*` are `'use server'` modules importing
  `mongodb`. `tsconfig.ds.json` `paths` redirects them to `.design-sync/stubs/actions/*`,
  which resolve to inert no-ops. Affected: `AddCommentModal`, `AddVersionModal`,
  `CommentThreadModal`, `CreateArtistModal`, `CreateTrackModal`, `ArtistList`. Their markup
  is faithful; their submit paths do nothing. **If a component gains a new action import,
  add a matching stub export** or the bundle breaks.
- **Tailwind v4 must be precompiled.** `globals.css` is only `@import "tailwindcss"` plus
  `@theme`; the utility classes don't exist until Tailwind scans sources. The converter
  copies CSS, it never runs Tailwind. `.design-sync/tailwind-entry.css` imports the app's
  real `globals.css` (single source of truth) and adds `@source` for `../src` and the
  authored previews. **Re-run the compile whenever component classes change**, or new
  classes will be missing from the shipped CSS.
- **Font variables must be declared manually.** `next/font/google` injects `--font-jost`,
  `--font-lora`, `--font-dm-sans` at runtime in the app; the design system has no Next
  runtime. They're declared in `tailwind-entry.css`, backed by 24 self-hosted woff2 files
  fetched from Google Fonts into `.design-sync/fonts/`. Without them `--font-sans`,
  `.font-title` and `.font-caption` all resolve to nothing.
- **Preview provider chain.** `.design-sync/ds-providers.tsx` exports `DsProvider`. Beyond
  the app's `NextIntlClientProvider` + `AuthProvider`, it must also supply Next's
  `AppRouterContext` / `PathnameContext` / `SearchParamsContext` / `PathParamsContext`:
  `useRouter()` from `next/navigation` **throws** ("invariant expected app router to be
  mounted") without its context, and `AuthContext` + `LocaleSwitcher` both call it. Without
  these, every card renders blank.
- **Grouping needed a lib fork.** Groups derive from the last non-generic src path segment,
  *excluding the component's own directory* — so `app/[locale]/login/page.tsx` (component
  `Login`) collapsed to `locale`, and the site-content forms to `site-content`. Doc
  frontmatter `category` only overrides groups that are `general`/`misc`. Fork
  `.design-sync/overrides/source-kit.mjs` forces `general` under `app/` so the doc category
  wins, yielding `components` / `admin` / `pages`. Declared in `cfg.libOverrides`.
- **`.d.ts` props are hand-maintained.** Because `PKG_DIR` holds no `.d.ts` tree, automatic
  extraction produced `[key: string]: unknown` for all 26. `cfg.dtsPropsFor` carries
  hand-written bodies with **structurally inlined** types (no `Track`/`Comment`/`WorkArtist`
  references — the emitted `.d.ts` must parse standalone).

## Known render warns

- `[RENDER_SKIPPED]` — expected on every run until a browser is installed. See below.

## Re-sync risks

- **Nothing has ever been visually verified.** The user declined the playwright/chromium
  install (~200MB), so the render check has never run and no screenshots or preview grades
  exist. Every card is unverified. Installing playwright + chromium and dropping
  `--no-render-check` is the single highest-value improvement to this sync.
- **`cfg.dtsPropsFor` will silently rot.** It is a hand-written copy of each component's
  props. Nothing checks it against source. Whenever a component's props change, update it —
  otherwise the design agent codes against a stale contract.
- **`.design-sync/pkg/entry.tsx` will silently rot** the same way — a component added to
  `componentSrcMap` but not to the entry gets a card and a `.d.ts` but is missing from
  `window.ShinjiNoSekai`.
- **Fonts are pinned copies.** The 24 woff2 files were fetched from Google Fonts at first
  sync; the app tracks whatever `next/font` serves. They can drift.
- **The overrides fork can drift from upstream.** On re-sync, diff
  `.design-sync/overrides/source-kit.mjs` against `.ds-sync/lib/source-kit.mjs` and merge.
- **`ArtistCard` required a source change** — it was declared inside `src/app/[locale]/page.tsx`
  and is now `export`ed so the design system can import it. Keep the `export`.
- `src/app/[locale]/work/` and `src/app/[locale]/contact/` are empty directories; the site is
  single-page. There are no Work/Contact page components to sync.
