// src/components/TriLayout/hooks/useResize.ts
import { useRef, useCallback } from 'react'

interface UseResizeOptions {
  minWidth: number
  maxWidth: number
}

export function useResize(
  onWidthChange: ((width: number) => void) | undefined,
  options: UseResizeOptions
) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onWidthChange) return

      e.preventDefault()

      const container = containerRef.current
      if (!container) return

      const layoutRoot = container.parentElement?.parentElement
      if (!layoutRoot) return

      const activityBarWidth = 48
      const startX = e.clientX
      const startWidth = container.offsetWidth
      const parentWidth = layoutRoot.offsetWidth - activityBarWidth

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX
        const newWidth = startWidth + deltaX
        const newRatio = newWidth / parentWidth
        const clampedRatio = Math.max(
          options.minWidth,
          Math.min(options.maxWidth, newRatio)
        )
        onWidthChange(clampedRatio)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [onWidthChange, options]
  )

  return { containerRef, handleMouseDown }
}