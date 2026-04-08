import { useState } from 'react'
import type { Notebook } from '@/types'
import { Input } from '@/components/ui/input'

interface NotebookItemProps {
  notebook: Notebook
  isSelected: boolean
  onSelect: () => void
  onRename: (name: string) => void
}

export function NotebookItem({
  notebook,isSelected,
  onSelect,
  onRename,
}: NotebookItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(notebook.name)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditName(notebook.name)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (editName.trim() && editName !== notebook.name) {
      onRename(editName.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditName(notebook.name)
    }
  }

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 cursor-pointer ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'
      }`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 h-7 text-sm"
          autoFocus
        />
      ) : (
        <span className="text-sm truncate flex-1">{notebook.name}</span>
      )}
    </div>
  )
}