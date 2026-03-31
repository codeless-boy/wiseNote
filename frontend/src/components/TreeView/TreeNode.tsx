import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'
import type { NodeRendererProps } from 'react-arborist'
import type { TreeNode } from './types'
import { NodeActions } from './NodeActions'

interface TreeNodeProps extends NodeRendererProps<TreeNode> {
  onCreateNote: (notebookId: string) => void
  onCreateSubNotebook: (parentId: string) => void
  onRename: (nodeId: string) => void
  onDelete: (nodeId: string, type: 'notebook' | 'note', parentId: string | null) => void
  onSelectNote: (noteId: string) => void
  isEditing: boolean
  onEditComplete: (nodeId: string, newName: string) => void
}

export function TreeNode({
  node,
  style,
  dragHandle,
  onCreateNote,
  onCreateSubNotebook,
  onRename,
  onDelete,
  onSelectNote,
  isEditing,
  onEditComplete,
}: TreeNodeProps) {
  const [editValue, setEditValue] = useState(node.data.name)
  const isNotebook = node.data.type === 'notebook'
  const isOpen = node.isOpen
  
  const handleClick = () => {
    if (isNotebook) {
      node.toggle()
    } else {
      onSelectNote(node.id)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isEditing) {
      onEditComplete(node.id, editValue)
    }
    if (e.key === 'Escape' && isEditing) {
      setEditValue(node.data.name)
    }
  }
  
  return (
    <div
      style={style}
      ref={dragHandle}
      className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 group"
      onClick={handleClick}
    >
      {isNotebook && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            node.toggle()
          }}
          className="p-0.5"
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
      
      {!isNotebook && <span style={{ width: 14 }} />}
      
      <div className="flex items-center gap-1 flex-1">
        {isNotebook ? (
          <Folder size={14} className="text-gray-500" />
        ) : (
          <FileText size={14} className="text-gray-500" />
        )}
        
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onEditComplete(node.id, editValue)}
            className="flex-1 text-sm bg-white border border-blue-500 rounded px-1"
            autoFocus
          />
        ) : (
          <span className="text-sm truncate">{node.data.name}</span>
        )}
      </div>
      
      <NodeActions
        node={node.data}
        onCreateNote={onCreateNote}
        onCreateSubNotebook={onCreateSubNotebook}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  )
}