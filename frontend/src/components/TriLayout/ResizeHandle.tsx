// src/components/TriLayout/ResizeHandle.tsx
import { cn } from '@/lib/utils'

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
  className?: string
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onMouseDown,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-1 cursor-col-resize hover:bg-primary/50 transition-colors shrink-0',
        className
      )}
      onMouseDown={onMouseDown}
    />
  )
}