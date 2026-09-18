import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 70
const MAX_PULL = 110

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  enabled: boolean
}

export function PullToRefresh({ onRefresh, enabled }: PullToRefreshProps) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef<number | null>(null)
  const pullRef = useRef(0)
  const busy = useRef(false)
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    if (!enabled) return

    const setPullValue = (value: number) => {
      pullRef.current = value
      setPull(value)
    }

    const onStart = (e: TouchEvent) => {
      startY.current = window.scrollY <= 0 && !busy.current ? e.touches[0].clientY : null
    }

    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return
      const dy = e.touches[0].clientY - startY.current
      if (dy <= 0) return setPullValue(0)
      setPullValue(Math.min(dy * 0.5, MAX_PULL))
    }

    const onEnd = async () => {
      if (startY.current === null) return
      startY.current = null
      if (pullRef.current < THRESHOLD) return setPullValue(0)

      busy.current = true
      setRefreshing(true)
      setPullValue(THRESHOLD)
      try {
        await onRefreshRef.current()
      } finally {
        busy.current = false
        setRefreshing(false)
        setPullValue(0)
      }
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [enabled])

  if (pull === 0 && !refreshing) return null

  const progress = Math.min(pull / THRESHOLD, 1)

  return (
    <div
      className="fixed inset-x-0 z-40 flex justify-center pointer-events-none"
      style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
    >
      <div
        className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary-container transition-transform"
        style={{ transform: `translateY(${pull * 0.6}px)`, opacity: 0.4 + progress * 0.6 }}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${refreshing ? 'animate-spin' : ''}`}
          style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
        >
          refresh
        </span>
      </div>
    </div>
  )
}
