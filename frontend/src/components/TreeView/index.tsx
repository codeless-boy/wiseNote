import { useState, useEffect, useCallback } from 'react'
import { useNotebookStore, useNoteStore } from '@/store'
import { ChevronRight, ChevronDown, Plus, Folder, FileText, AlertCircle } from 'lucide-react'
import type { Notebook, Note } from '@/types'

export function TreeView() {
  const { notebooks, createNotebook, fetchNotebooks } = useNotebookStore()
  const { notesByNotebook, rootNotes, currentNote, fetchNotes, fetchRootNotes, createNote, setCurrentNote } = useNoteStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

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

  const checkDuplicateName = useCallback((name: string, parentId: string | null, excludeId?: string): boolean => {
    const siblingNotebooks = notebooks.filter(n => n.parentId === parentId && n.id !== excludeId)
    const siblingNotes = parentId === null 
      ? rootNotes 
      : (notesByNotebook[parentId] || [])
    
    const notebookExists = siblingNotebooks.some(n => n.name === name)
    const noteExists = siblingNotes.some(n => n.title === name)
    
    return notebookExists || noteExists
  }, [notebooks, rootNotes, notesByNotebook])

  const handleCreateNotebook = async () => {
    const baseName = '新建笔记本'
    let name = baseName
    let counter = 1
    
    while (checkDuplicateName(name, null)) {
      name = `${baseName} ${counter}`
      counter++
    }
    
    setError(null)
    await createNotebook(name)
  }

  const handleCreateRootNote = async () => {
    const baseTitle = '无标题'
    let title = baseTitle
    let counter = 1
    
    while (checkDuplicateName(title, null)) {
      title = `${baseTitle} ${counter}`
      counter++
    }
    
    setError(null)
    await createNote(null)
  }

  const handleCreateNoteInNotebook = async (notebookId: string) => {
    if (!expandedIds.has(notebookId)) {
      handleToggle(notebookId)
    }
    await fetchNotes(notebookId)
    
    const baseTitle = '无标题'
    let title = baseTitle
    let counter = 1
    
    while (checkDuplicateName(title, notebookId)) {
      title = `${baseTitle} ${counter}`
      counter++
    }
    
    await createNote(notebookId)
  }

  const getRootNotebooks = () => {
    return notebooks
      .filter(n => n.parentId === null)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  }

  const getChildNotebooks = (parentId: string) => {
    return notebooks
      .filter(n => n.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  }

  const getNotesForNotebook = (notebookId: string) => {
    return (notesByNotebook[notebookId] || [])
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  }

  const getSortedRootNotes = () => {
    return [...rootNotes].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  }

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
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); handleToggle(notebook.id) }}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span style={{ width: '14px' }} />
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
      {error && (
        <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {getSortedRootNotes().map(note => renderNote(note, 0))}
        {getRootNotebooks().map(notebook => renderNotebook(notebook))}
      </div>
    </div>
  )
}