import { useCallback } from 'react'
import { useNotebookStore } from '@/store/notebookStore'
import { useNoteStore } from '@/store/noteStore'
import { generateUniqueName, checkDuplicateName, validateName } from '../utils'

export function useTreeActions() {
  const { createNotebook, deleteNotebook, updateNotebook, fetchNotebooks } = useNotebookStore()
  const { createNote, deleteNote, updateNote, fetchNotes, fetchRootNotes, setCurrentNote } = useNoteStore()
  
  const onCreateNotebook = useCallback(async (parentId: string | null = null) => {
    const name = generateUniqueName('新建笔记本', parentId)
    const notebook = await createNotebook(name, parentId)
    
    await fetchNotebooks()
    
    return notebook.id
  }, [createNotebook, fetchNotebooks])
  
  const onCreateNote = useCallback(async (notebookId: string | null = null) => {
    await createNote(notebookId)
    
    if (notebookId !== null) {
      await fetchNotes(notebookId)
    } else {
      await fetchRootNotes()
    }
    
    const note = useNoteStore.getState().currentNote
    if (note) {
      setCurrentNote(note)
    }
    
    return note?.id
  }, [createNote, fetchNotes, fetchRootNotes, setCurrentNote])
  
  const onRename = useCallback(async (
    nodeId: string,
    newName: string,
    type: 'notebook' | 'note',
    parentId: string | null
  ) => {
    const validationError = validateName(newName)
    if (validationError) {
      throw new Error(validationError)
    }
    
    if (checkDuplicateName(newName, parentId, nodeId)) {
      throw new Error('名称已存在')
    }
    
    if (type === 'notebook') {
      await updateNotebook(nodeId, newName)
      await fetchNotebooks()
    } else {
      await updateNote(nodeId, { title: newName })
      if (parentId !== null) {
        await fetchNotes(parentId)
      } else {
        await fetchRootNotes()
      }
    }
  }, [updateNotebook, updateNote, fetchNotebooks, fetchNotes, fetchRootNotes])
  
  const onDeleteNotebook = useCallback(async (notebookId: string) => {
    await deleteNotebook(notebookId)
    await fetchNotebooks()
  }, [deleteNotebook, fetchNotebooks])
  
  const onDeleteNote = useCallback(async (noteId: string, notebookId: string | null) => {
    await deleteNote(noteId)
    
    if (notebookId !== null) {
      await fetchNotes(notebookId)
    } else {
      await fetchRootNotes()
    }
  }, [deleteNote, fetchNotes, fetchRootNotes])
  
  return {
    onCreateNotebook,
    onCreateNote,
    onRename,
    onDeleteNotebook,
    onDeleteNote,
  }
}