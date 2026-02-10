import { Suspense } from 'react'
import TrackPageLoader from './track=loader'

export default function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackPageLoader params={params} />
    </Suspense>
  )
}
