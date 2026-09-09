---
category: Components
---

Artist tile with avatar, role tags, description and an embedded Spotify player.

The core content card of the public Work section. Shows an 80px rounded avatar, the artist name in `font-title`, roles as pill tags (`bg-tag/70`), a description, and — when a Spotify id or URL is present — an embedded player plus a "Listen on Spotify" link. Lifts on hover.

```jsx
<ArtistCard artist={{
  name: 'Kaori', description: 'Ambient producer based in Brussels.',
  roles: ['Mixing', 'Mastering'], image: '/images/kaori.jpg',
  spotify_url: 'https://open.spotify.com/artist/1234567890abcdef',
}} />
```
`spotify_id` is derived from `spotify_url` when not given. Reads the `work.listenOnSpotify` translation key.
