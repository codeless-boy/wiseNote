// src/components/TriLayout/Sidebar.tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ResizeHandle } from './ResizeHandle'
import { useResize } from './hooks/useResize'
import type { SidebarProps } from './types'

export const Sidebar: React.FC<SidebarProps> = ({
  width,
  onWidthChange,
  children,
  className,
  minWidth = 0.1,
  maxWidth = 0.5,
  collapsed,
}) => {
  const { containerRef, handleMouseDown } = useResize(onWidthChange, {
    minWidth,
    maxWidth,
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex shrink-0 relative transition-[width] duration-200 ease-out overflow-hidden',
        className
      )}
      style={{ width: collapsed ? 0 : `${width * 100}%` }}
    >
      <div className="flex-1 flex flex-col bg-sidebar border-r overflow-hidden">
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
      {!collapsed && onWidthChange && <ResizeHandle onMouseDown={handleMouseDown} />}
    </div>
  )
}