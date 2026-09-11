---
category: Components
---

FR / EN locale toggle; the active locale is bold, the other is a muted button.

Reads the active locale from the i18n context and switches via the localized router inside a transition (buttons are disabled while pending). Locales are hardcoded to `fr` and `en`, separated by a `·`.

```jsx
<LocaleSwitcher />
```
Takes no props. Requires both the i18n and router contexts — it is already included inside `Navbar`.
