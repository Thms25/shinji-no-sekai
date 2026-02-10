import {
  getArtist,
  getComments,
  getTrack,
  getVersions,
} from '@/utils/fetch-db-utils'
import TrackPage from './track-page'

export default async function TrackPageLoader({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await new Promise(resolve => setTimeout(resolve, 3000))
  const { id } = await params
  const track = await getTrack(id)

  if (!track) {
    return <div>Track not found</div>
  }

  const versions = await getVersions(id)
  const comments = await getComments(id)
  const artist = await getArtist(track.artistId)
  const artistName = artist?.displayName || artist?.email || 'Unknown Artist'

  return (
    <TrackPage
      params={params}
      track={track}
      versions={versions || []}
      comments={comments || []}
      artistName={artistName}
    />
  )
}
