---
category: Components
---

Fixed top-right navigation bar; currently hosts only the locale switcher.

Renders a `<nav>` pinned to the top-right (`fixed top-0 right-0 z-50 p-6 sm:p-8`) containing `LocaleSwitcher`. It has no props and no background — it floats over page content, so pages must leave headroom or accept overlap.

```jsx
<Navbar />
```
Pair with `Footer` and a `<main className="grow">` between them for the app's standard shell.
