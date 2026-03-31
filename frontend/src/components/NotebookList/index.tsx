import { useState } from 'react'
import { useNotebookStore } from '@/store'
import { NotebookItem } from './NotebookItem'
import { ChevronRight, ChevronDown, Plus, Folder } from 'lucide-react'
import type { Notebook } from '@/types'

export function NotebookList() {
  const { notebooks, currentNotebookId, fetchNotebooks, createNotebook, setCurrentNotebook } = useNotebookStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const handleToggle = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const handleCreate = async () => {
    await createNotebook('新建笔记本')
  }

  const getRootNotebooks = () => {
    return notebooks.filter(n => n.parentId === null)
  }

  const getChildNotebooks = (parentId: string) => {
    return notebooks.filter(n => n.parentId === parentId)
  }

  const renderNotebook = (notebook: Notebook, level: number = 0) => {
    const children = getChildNotebooks(notebook.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(notebook.id)
    const isSelected = currentNotebookId === notebook.id

    return (
      <div key={notebook.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setCurrentNotebook(notebook.id)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); handleToggle(notebook.id) }}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <Folder size={14} className="text-gray-500" />
          <span className="text-sm truncate">{notebook.name}</span>
        </div>
        {isExpanded && children.map(child => renderNotebook(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">笔记本</span>
        <button onClick={handleCreate} className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {getRootNotebooks().map(notebook => renderNotebook(notebook))}
      </div>
    </div>
  )
}