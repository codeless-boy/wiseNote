import { useEffect, useState } from 'react'
import { useTagStore } from '@/store'
import { Plus, Tag as TagIcon } from 'lucide-react'

export function TagPanel() {
  const { tags, fetchTags, createTag } = useTagStore()
  const [newTagName, setNewTagName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const handleCreate = async () => {
    if (!newTagName.trim()) return
    await createTag(newTagName.trim())
    setNewTagName('')
    setIsCreating(false)
  }

  const handleTagClick = (_tagId: string) => {
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">标签</span>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {isCreating && (
        <div className="px-2 py-2 border-b">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            onBlur={handleCreate}
            placeholder="输入标签名称"
            className="w-full px-2 py-1 text-sm border rounded outline-none focus:border-blue-500"
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {tags.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            暂无标签，点击 + 创建
          </div>
        ) : (
          tags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleTagClick(tag.id)}
            >
              <TagIcon size={14} style={{ color: tag.color || '#6366f1' }} />
              <span className="text-sm">{tag.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}