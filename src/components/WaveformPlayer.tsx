'use client'

import { Comment } from '@/utils/type-utils'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import { Play, Pause, MessageSquarePlus } from 'lucide-react'

interface WaveformPlayerProps {
  url: string
  onReady?: () => void
  onTimeUpdate?: (time: number) => void
  onAddComment?: (time: number) => void
  comments?: Comment[]
  activeCommentId?: string | null
}

export default function WaveformPlayer({
  url,
  onReady,
  onTimeUpdate,
  onAddComment,
  comments = [],
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const regions = useRef<RegionsPlugin | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Regions Plugin
    const wsRegions = RegionsPlugin.create()
    regions.current = wsRegions

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4b5563',
      progressColor: '#3b82f6',
      cursorColor: '#3b82f6',
      barWidth: 2,
      barGap: 3,
      height: 100,
      normalize: true,
      plugins: [wsRegions],
    })

    wavesurfer.current.load(url)

    wavesurfer.current.on('ready', () => {
      setIsReady(true)
      setDuration(wavesurfer.current?.getDuration() || 0)
      onReady?.()
    })

    wavesurfer.current.on('audioprocess', () => {
      const time = wavesurfer.current?.getCurrentTime() || 0
      setCurrentTime(time)
      onTimeUpdate?.(time)
    })

    wavesurfer.current.on('interaction', newTime => {
      setCurrentTime(newTime)
      onTimeUpdate?.(newTime)
    })

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false)
    })

    return () => {
      try {
        wavesurfer.current?.destroy()
      } catch {}
    }
  }, [url, onReady, onTimeUpdate, onAddComment])

  // Sync comments to regions/markers
  useEffect(() => {
    if (!regions.current || !wavesurfer.current || !isReady) return

    regions.current.clearRegions()

    comments.forEach(comment => {
      if (comment.timestamp) {
        regions.current?.addRegion({
          start: comment.timestamp,
          end: comment.timestamp, // Marker-like behavior
          color: comment.solved
            ? 'rgba(0, 255, 0, 0.5)'
            : 'rgba(250, 129, 18, 0.8)', // Green if solved, Accent Orange if not
          drag: false,
          resize: false,
          id: comment.id,
          content: '💬', // Optional content
        })
      }
    })
  }, [comments, url, isReady]) // Re-run when comments change or url changes (new version)

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause()
      setIsPlaying(!isPlaying)
    }
  }

  const handleAddCommentClick = () => {
    if (wavesurfer.current) {
      const time = wavesurfer.current.getCurrentTime()
      wavesurfer.current.pause()
      setIsPlaying(false)
      onAddComment?.(time)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="relative mb-4 min-h-[100px]">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-1 animate-pulse">
            {/* Fake waveform skeleton */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  height: `${(30 + Math.abs(Math.sin(i * 0.5)) * 70).toFixed(1)}%`,
                  animationDelay: `${(i * 0.05).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
        <div
          ref={containerRef}
          className={`${!isReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="text-sm font-mono text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddCommentClick}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-primary"
            title="Add comment at current time"
          >
            <MessageSquarePlus size={18} />
            <span className="hidden sm:inline">Add Note</span>
          </button>
        </div>
      </div>
    </div>
  )
}
