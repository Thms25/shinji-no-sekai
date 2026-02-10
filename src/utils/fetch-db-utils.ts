// Legacy facade kept for backwards-compatibility.
// New code should import from `@/utils/db/*` instead.
export { getArtistById as getArtist } from './db/artists'
export { getTrackById as getTrack } from './db/tracks'
export { getVersionsByTrackId as getVersions } from './db/versions'
export { getCommentsByTrackId as getComments } from './db/comments'
