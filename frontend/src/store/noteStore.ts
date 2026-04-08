import { create } from 'zustand'
import type { Note, NoteVersion } from '@/types'
import * as db from '@/db/notes'
import * as dbVersions from '@/db/versions'

interface NoteState {
  notesByNotebook: Record<string, Note[]>
  rootNotes: Note[]
  currentNote: Note | null
  versions: NoteVersion[]
  loading: boolean
  
  getNotesByNotebook: (notebookId: string) => Note[]
  fetchNotes: (notebookId: string) => Promise<void>
  fetchRootNotes: () => Promise<void>
  createNote: (notebookId: string | null) => Promise<Note>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setCurrentNote: (note: Note | null) => void
  saveVersion: (noteId: string, content: string) => Promise<void>
  fetchVersions: (noteId: string) => Promise<void>
  restoreVersion: (noteId: string, versionId: string) => Promise<void>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notesByNotebook: {},
  rootNotes: [],
  currentNote: null,
  versions: [],
  loading: false,

  getNotesByNotebook: (notebookId: string) => {
    return get().notesByNotebook[notebookId] || []
  },

  fetchNotes: async (notebookId) => {
    const cached = get().notesByNotebook[notebookId]
    if (cached) return
    
    set({ loading: true })
    const notes = await db.getNotesByNotebook(notebookId)
    set({ 
      notesByNotebook: { ...get().notesByNotebook, [notebookId]: notes },
      loading: false 
    })
  },

  fetchRootNotes: async () => {
    set({ loading: true })
    const rootNotes = await db.getRootNotes()
    set({ rootNotes, loading: false })
  },

  createNote: async (notebookId) => {
    const state = get()
    const existingNotes = notebookId === null 
      ? state.rootNotes 
      : (state.notesByNotebook[notebookId] || [])
    
    let title = '无标题'
    let counter = 1
    while (existingNotes.some(n => n.title === title)) {
      title = `无标题 ${counter}`
      counter++
    }
    
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content: '',
      notebookId,
      tags: [],
      links: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await db.createNote(note)
    if (notebookId === null) {
      set({ rootNotes: [...get().rootNotes, note], currentNote: note })
    } else {
      const existing = get().notesByNotebook[notebookId] || []
      set({ 
        notesByNotebook: { ...get().notesByNotebook, [notebookId]: [...existing, note] },
        currentNote: note 
      })
    }
    return note
  },

  updateNote: async (id, updates) => {
    const state = get()
    let foundNotebookId: string | null = null
    let note: Note | undefined
    
    for (const [nid, notes] of Object.entries(state.notesByNotebook)) {
      note = notes.find(n => n.id === id)
      if (note) {
        foundNotebookId = nid
        break
      }
    }
    
    if (!note|| !foundNotebookId) return
    const updated = { ...note, ...updates, updatedAt: Date.now() }
    await db.updateNote(updated)
    set({
      notesByNotebook: {
        ...get().notesByNotebook,
        [foundNotebookId]: get().notesByNotebook[foundNotebookId].map(n => n.id === id ? updated : n)
      },
      currentNote: get().currentNote?.id === id ? updated : get().currentNote
    })
  },

  deleteNote: async (id) => {
    await db.deleteNote(id)
    await dbVersions.deleteVersionsByNote(id)
    
    const state = get()
    const newNotesByNotebook = { ...state.notesByNotebook }
    
    for (const [nid, notes] of Object.entries(newNotesByNotebook)) {
      if (notes.some(n => n.id === id)) {
        newNotesByNotebook[nid] = notes.filter(n => n.id !== id)
        break
      }
    }
    
    set({
      notesByNotebook: newNotesByNotebook,
      currentNote: get().currentNote?.id === id ? null : get().currentNote
    })
  },

  setCurrentNote: (note) => {
    set({ currentNote: note })
  },

  saveVersion: async (noteId, content) => {
    const version: NoteVersion = {
      id: crypto.randomUUID(),
      noteId,
      content,
      savedAt: Date.now(),
    }
    await dbVersions.createVersion(version)
    set({ versions: [...get().versions, version] })
  },

  fetchVersions: async (noteId) => {
    const versions = await dbVersions.getVersionsByNote(noteId)
    set({ versions })
  },

  restoreVersion: async (noteId, versionId) => {
    const version = await dbVersions.getVersion(versionId)
    if (!version) return
    await get().updateNote(noteId, { content: version.content })
  },
}))