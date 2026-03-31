import { useEffect } from 'react'
import { useNoteStore, useNotebookStore } from '@/store'
import { Plus, FileText } from 'lucide-react'

export function NoteList() {
  const { currentNotebookId } = useNotebookStore()
  const { notes, currentNote, fetchNotes, createNote, setCurrentNote } = useNoteStore()

  useEffect(() => {
    if (currentNotebookId) {
      fetchNotes(currentNotebookId)
    }
  }, [currentNotebookId, fetchNotes])

  const handleCreate = async () => {
    if (!currentNotebookId) return
    await createNote(currentNotebookId)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!currentNotebookId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        请选择一个笔记本
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">笔记列表</span>
        <button onClick={handleCreate} className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            暂无笔记，点击 + 创建
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`flex flex-col gap-1 px-3 py-2 cursor-pointer border-b ${
                currentNote?.id === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentNote(note)}
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <span className="text-sm font-medium truncate">{note.title}</span>
              </div>
              <div className="text-xs text-gray-400 ml-5">
                {formatDate(note.updatedAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}