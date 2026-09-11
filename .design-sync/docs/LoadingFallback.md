---
category: Components
---

Full-screen loading state drawn as seven animated equalizer bars.

A full-viewport centered `role="status"` block. Bars animate via the `.eq-bar` keyframes in `globals.css`, each offset by `i * 0.1s`.

```jsx
<Suspense fallback={<LoadingFallback />}>
  <TrackPage />
</Suspense>
```
Note: the bars are colored from `var(--color-accent)`, which the theme does not define — they inherit transparent unless you define that token. Use for route-level loading, not inline spinners.
