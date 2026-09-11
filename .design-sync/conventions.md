# Shinji No Sekai — build conventions

A warm, editorial design system for an audio-engineering studio's **public static site**:
cream paper background, soft brown ink, serif body text, geometric-sans titles.

Scope note: this system covers the public marketing site only. The admin console and the
authenticated artist portal are deliberately not part of it.

## Always wrap in `DsProvider`

Every component must be rendered inside `DsProvider` (exported from the bundle alongside
the components):

```jsx
const { DsProvider, ArtistCard } = window.ShinjiNoSekai

<DsProvider>
  <ArtistCard artist={artist} />
</DsProvider>
```

`DsProvider` supplies the i18n messages and the Next router contexts. This is not optional:
`Navbar`, `Footer` and `LocaleSwitcher` read translations or the router, and **outside the
provider they throw and render nothing at all**.

## Styling idiom: Tailwind v4 utilities over theme tokens

Style your own layout with Tailwind utility classes. The palette is defined as theme tokens,
so use the **semantic color names below** — never raw hex, and never `gray-*`/`slate-*`,
which do not belong to this brand.

| Family | Class names |
|---|---|
| Surfaces | `bg-background` (page, cream) · `bg-card` (raised) · `bg-subtle` (input fills) · `bg-tag` (role pills) |
| Text | `text-foreground` (primary) · `text-muted-foreground` (secondary) · `text-primary` (tan accent) · `text-secondary` |
| Borders | `border-border` — the only border color used; pair with `rounded-lg`/`rounded-xl`/`rounded-2xl` |

Each also works in the other positions Tailwind allows (`text-card`, `border-primary`,
`bg-primary/70`, opacity suffixes, etc.).

### Three fonts, three jobs

- **Body — Lora (serif).** The default; inherited from `--font-sans`. Write nothing.
- **Titles — Jost (geometric sans).** Add `font-title` to every heading. Pair with
  `tracking-tight` (or `tracking-tighter` at hero sizes) and `font-bold`/`font-semibold`.
- **UI/labels/captions — DM Sans.** Add `font-caption` to buttons, form labels, tags,
  metadata, and small print.

Getting these wrong is the most visible way to look off-brand: headings in the body serif
read as a different site entirely.

```jsx
<h2 className="font-title text-4xl font-bold tracking-tight">Selected Work</h2>
<p className="text-muted-foreground leading-relaxed">Body copy stays in Lora.</p>
<span className="font-caption text-xs font-medium text-secondary">Mastering</span>
```

## Where the truth lives

- `_ds/<folder>/styles.css` → imports `fonts/fonts.css` (the three self-hosted families) and
  `_ds_bundle.css` (all theme tokens + every utility the components use). Read
  `_ds_bundle.css` when you need exact token values.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage notes, states and a
  worked example. Read this before using a component.
- `components/<group>/<Name>/<Name>.d.ts` — the prop contract.

## What's in the system

- **components** — `Navbar`, `Footer`, `LocaleSwitcher`, `ArtistCard`, `LoadingFallback`.
  `ArtistCard` is the one real content card: avatar, role tags, description, Spotify embed.
- **pages** — `Home` and `Bio`, whole screens. Compose *from* them for reference; do not nest
  them inside another layout.

`Home` is the best single reference for the brand's type scale and section rhythm — it is the
entire public site in one scroll: hero, bio, work grid, contact form.

## Standard page shell

```jsx
<DsProvider>
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Navbar />
    <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="font-title text-4xl font-bold tracking-tight">Selected Work</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Recent mixing and mastering collaborations.
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((a) => <ArtistCard key={a.name} artist={a} />)}
      </div>
    </main>
    <Footer />
  </div>
</DsProvider>
```

`Navbar` is `fixed` and has no background, so leave headroom or let content run under it.

## Caveats

- `Home` and `Bio` fetch their content from `/api/content` on mount; with no endpoint they
  render their defaults and an empty work grid. That is the expected static appearance.
- `LoadingFallback` colors its bars from `var(--color-accent)`, which this theme does **not**
  define — define that token yourself if you use it, or the bars render invisible.
