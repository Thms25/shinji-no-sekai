---
category: Pages
---

The public single-page site: hero, bio, work grid and contact form.

The entire marketing site in one scrolling composition:

1. **Hero** — `SHINJI NO SEKAI` in `font-title` at `text-5xl sm:text-7xl`, a subheadline, and a two-column key-values grid, all staggered in.
2. **Bio** — 3:4 portrait beside two paragraphs, revealed on scroll.
3. **Work** — responsive `ArtistCard` grid, with a "coming soon" empty state.
4. **Contact** — name/email/message form with a `Send` submit button.

```jsx
<Home />
```
Fetches bio and work content from `/api/content` on mount, so without that endpoint it renders its defaults and an empty work grid. This is the best single reference for the brand's type scale, spacing and section rhythm.
