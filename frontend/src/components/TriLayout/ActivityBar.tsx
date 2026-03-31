// src/components/TriLayout/ActivityBar.tsx
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { ActivityBarProps } from './types'

export const ActivityBar: React.FC<ActivityBarProps> = ({
  items,
  activeId,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col w-12 shrink-0 bg-muted/50 border-r',
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center py-2 gap-1">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'w-10 h-10 rounded-md relative',
                      isActive && 'bg-accent text-accent-foreground'
                    )}
                    onClick={() => onChange(item.id)}
                  >
                    {item.icon}
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                {item.title && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}