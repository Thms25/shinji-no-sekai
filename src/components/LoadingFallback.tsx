'use client'

export function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Equalizer-style bars */}
      <div
        className="flex animate-pulse items-end gap-1.5"
        role="status"
        aria-label="Loading"
      >
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="eq-bar w-2 rounded-sm"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
