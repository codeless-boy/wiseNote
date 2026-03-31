import { useState } from 'react'
import { FileText, FolderPlus, Pencil, Trash } from 'lucide-react'
import type { TreeNode } from './types'

interface NodeActionsProps {
  node: TreeNode
  onCreateNote: (notebookId: string) => void
  onCreateSubNotebook: (parentId: string) => void
  onRename: (nodeId: string) => void
  onDelete: (nodeId: string, type: 'notebook' | 'note', parentId: string | null) => void
}

export function NodeActions({
  node,
  onCreateNote,
  onCreateSubNotebook,
  onRename,
  onDelete,
}: NodeActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  if (node.type === 'notebook') {
    return (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCreateNote(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="新建笔记"
        >
          <FileText size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCreateSubNotebook(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="新建子笔记本"
        >
          <FolderPlus size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRename(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="重命名"
        >
          <Pencil size={14} />
        </button>
        {showConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id, 'notebook', node.parentId)
                setShowConfirm(false)
              }}
              className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
            >
              确认
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowConfirm(false)
              }}
              className="p-1 hover:bg-gray-200 rounded text-xs"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowConfirm(true)
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="删除"
          >
            <Trash size={14} />
          </button>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRename(node.id)
        }}
        className="p-1 hover:bg-gray-200 rounded"
        title="重命名"
      >
        <Pencil size={14} />
      </button>
      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.id, 'note', node.parentId)
              setShowConfirm(false)
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
          >
            确认
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowConfirm(false)
            }}
            className="p-1 hover:bg-gray-200 rounded text-xs"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowConfirm(true)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="删除"
        >
          <Trash size={14} />
        </button>
      )}
    </div>
  )
}