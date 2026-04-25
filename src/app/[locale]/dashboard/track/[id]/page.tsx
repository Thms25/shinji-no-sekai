import { Suspense } from 'react'
import { LoadingFallback } from '@/components/LoadingFallback'
import TrackPageLoader from './track=loader'

export default function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrackPageLoader params={params} />
    </Suspense>
  )
}
