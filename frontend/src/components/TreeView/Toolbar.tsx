import { useState } from 'react'
import { Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react'

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
  const [showViewOptions, setShowViewOptions] = useState(false)
  
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b">
      <div className="flex items-center gap-2">
        <button
          onClick={onCreateNotebook}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="新建笔记本"
        >
          <Folder size={18} />
        </button>
        <button
          onClick={onCreateRootNote}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="新建笔记"
        >
          <FileText size={18} />
        </button>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowViewOptions(!showViewOptions)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="视图选项"
        >
          <ChevronDown size={18} />
        </button>
        
        {showViewOptions && (
          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg py-1 min-w-[120px] z-10">
            <button
              onClick={() => {
                onExpandAll()
                setShowViewOptions(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <ChevronDown size={14} />
              <span>全部展开</span>
            </button>
            <button
              onClick={() => {
                onCollapseAll()
                setShowViewOptions(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <ChevronRight size={14} />
              <span>全部折叠</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}