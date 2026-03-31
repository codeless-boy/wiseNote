// src/components/TriLayout/TriLayout.tsx
import { cn } from '@/lib/utils'
import type { TriLayoutProps } from './types'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from './Sidebar'
import { Content } from './Content'

const TriLayout: React.FC<TriLayoutProps> & {
  ActivityBar: typeof ActivityBar
  Sidebar: typeof Sidebar
  Content: typeof Content
} = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex h-full w-full overflow-hidden bg-background',
        className
      )}
    >
      {children}
    </div>
  )
}

TriLayout.ActivityBar = ActivityBar
TriLayout.Sidebar = Sidebar
TriLayout.Content = Content

export { TriLayout }