import { Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ToolbarProps {
  onCreateNotebook: () => void
  onCreateRootNote: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

export function Toolbar({
  onCreateNotebook,
  onCreateRootNote,
  onExpandAll,
  onCollapseAll,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateNotebook}
          title="新建笔记本"
        >
          <Folder size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateRootNote}
          title="新建笔记"
        >
          <FileText size={18} />
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="视图选项">
            <ChevronDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExpandAll}>
            <ChevronDown size={14} className="mr-2" />
            <span>全部展开</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCollapseAll}>
            <ChevronRight size={14} className="mr-2" />
            <span>全部折叠</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}