import { useState, useEffect, useCallback, useRef } from 'react'
import { useNoteStore } from '@/store'
import { MDEditor } from '@/components/MDEditor'

export function NoteEditor() {
  const { currentNote, updateNote } = useNoteStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
    }
  }, [currentNote?.id])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (currentNote) {
        updateNote(currentNote.id, { title, content })
      }
    }, 500)
  }, [currentNote, title, content, updateNote])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    scheduleSave()
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    scheduleSave()
  }

  if (!currentNote) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        请选择一篇笔记
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="无标题"
          className="w-full text-lg font-medium outline-none"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          theme="light"
          placeholder="开始输入..."
        />
      </div>
    </div>
  )
}