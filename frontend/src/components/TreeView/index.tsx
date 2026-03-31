import { useState, useEffect } from 'react'
import { useNotebookStore, useNoteStore } from '@/store'
import { ChevronRight, ChevronDown, Plus, Folder, FileText } from 'lucide-react'
import type { Notebook, Note } from '@/types'

export function TreeView() {
  const { notebooks, createNotebook, fetchNotebooks } = useNotebookStore()
  const { notes, rootNotes, currentNote, fetchNotes, fetchRootNotes, createNote, setCurrentNote } = useNoteStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchNotebooks()
    fetchRootNotes()
  }, [fetchNotebooks, fetchRootNotes])

  const handleToggle = (id: string) => {
    setExpandedIds(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(id)) {
        newExpanded.delete(id)
      } else {
        newExpanded.add(id)
      }
      return newExpanded
    })
  }

  const handleSelectNotebook = async (notebookId: string) => {
    if (!expandedIds.has(notebookId)) {
      handleToggle(notebookId)
    }
    await fetchNotes(notebookId)
  }

  const handleCreateNotebook = async () => {
    await createNotebook('新建笔记本')
  }

  const handleCreateRootNote = async () => {
    await createNote(null)
  }

  const handleCreateNoteInNotebook = async (notebookId: string) => {
    if (!expandedIds.has(notebookId)) {
      handleToggle(notebookId)
    }
    await fetchNotes(notebookId)
    await createNote(notebookId)
  }

  const getRootNotebooks = () => notebooks.filter(n => n.parentId ===null)

  const getChildNotebooks = (parentId: string) => notebooks.filter(n => n.parentId === parentId)

  const getNotesForNotebook = (notebookId: string) => notes.filter(n => n.notebookId === notebookId)

  const renderNote = (note: Note, level: number) => {
    const isSelected = currentNote?.id === note.id
    return (
      <div
        key={note.id}
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
        onClick={() => setCurrentNote(note)}
      >
        <FileText size={14} className="text-gray-500" />
        <span className="text-sm truncate">{note.title}</span>
      </div>
    )
  }

  const renderNotebook = (notebook: Notebook, level: number = 0): JSX.Element[] => {
    const children = getChildNotebooks(notebook.id)
    const notebookNotes = getNotesForNotebook(notebook.id)
    const hasChildren = children.length > 0 || notebookNotes.length > 0
    const isExpanded = expandedIds.has(notebook.id)

    const elements: JSX.Element[] = []

    elements.push(
      <div key={notebook.id}>
        <div
          className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleSelectNotebook(notebook.id)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); handleToggle(notebook.id) }}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <Folder size={14} className="text-gray-500" />
          <span className="text-sm truncate flex-1">{notebook.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleCreateNoteInNotebook(notebook.id) }}
            className="p-0.5 hover:bg-gray-200 rounded opacity-0 hover:opacity-100"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    )

    if (isExpanded) {
      children.forEach(child => {
        elements.push(...renderNotebook(child, level + 1))
      })
      notebookNotes.forEach(note => {
        elements.push(renderNote(note, level))
      })
    }

    return elements
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-center gap-3 px-2 py-3 border-b">
        <button 
          onClick={handleCreateNotebook} 
          className="p-2 hover:bg-gray-100 rounded transition-colors" 
          title="新建笔记本"
        >
          <Folder size={18} />
        </button>
        <button 
          onClick={handleCreateRootNote} 
          className="p-2 hover:bg-gray-100 rounded transition-colors" 
          title="新建笔记"
        >
          <FileText size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {rootNotes.map(note => renderNote(note, 0))}
        {getRootNotebooks().map(notebook => renderNotebook(notebook))}
      </div>
    </div>
  )
}