// src/components/TriLayout/Content.tsx
import { cn } from '@/lib/utils'
import type { ContentProps } from './types'

export const Content: React.FC<ContentProps> = ({ children, className }) => {
  return (
    <div className={cn('flex-1 overflow-hidden', className)}>
      {children}
    </div>
  )
}