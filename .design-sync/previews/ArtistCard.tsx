import { ArtistCard } from 'shinji-no-sekai'

const kaori = {
  name: 'Kaori Mizuno',
  description: 'Ambient producer working between Brussels and Kyoto. Long-form textural records built from field recordings.',
  roles: ['Mixing', 'Mastering'],
  image: '',
  spotify_url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb',
}

export const WithSpotify = () => (
  <div className="bg-background p-6 max-w-sm">
    <ArtistCard artist={kaori} />
  </div>
)

export const NoSpotify = () => (
  <div className="bg-background p-6 max-w-sm">
    <ArtistCard artist={{ ...kaori, spotify_url: undefined, spotify_id: undefined }} />
  </div>
)

export const ManyRoles = () => (
  <div className="bg-background p-6 max-w-sm">
    <ArtistCard
      artist={{ ...kaori, name: 'Théo Lambert', spotify_url: undefined,
        roles: ['Production', 'Mixing', 'Mastering', 'Sound Design'] }}
    />
  </div>
)
