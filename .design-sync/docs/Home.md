---
category: Pages
---

The public single-page site — "Soft Overlap": hero, about, principles, studio work,
the room, live work and contact, as rounded panels that overlap each other.

1. **Hero** — kicker, the name in `font-title` (54px mobile / 112px desktop), role line.
   Sticky, so every panel below slides up over it.
2. **About** — portrait plus lead sentence and two columns of body copy, with the
   numbered principles nested at the bottom of the same panel.
3. **Studio work** — square credit cards, three across on desktop.
4. **The room** — full-bleed photograph beside the setup description.
5. **Live work** — 3:4 credit cards, four across on desktop.
6. **Contact** — accent panel with a mailto button.

```jsx
<Home content={DEFAULT_HOME_CONTENT} locale="en" />
```

Purely presentational: it takes the whole page's content as a prop and picks the
active language field by field. The route that renders it (`src/app/[locale]/page.tsx`)
reads the editable `home` document from MongoDB and falls back to
`DEFAULT_HOME_CONTENT` when it is missing. This is the best single reference for the
brand's type scale, panel radii and section rhythm.
