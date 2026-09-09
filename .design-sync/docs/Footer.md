---
category: Components
---

Full-width page footer with auto-updating copyright and a translated rights line.

Renders a centered footer with a top hairline border. The year comes from `new Date().getFullYear()`; the rights text is read from the `footer.rights` translation key, so it must be inside the i18n provider.

```jsx
<Footer />
```
Uses `bg-background` and `text-muted-foreground` at `text-sm`.
