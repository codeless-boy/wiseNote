import { create } from 'zustand'
import type { Note, NoteVersion } from '@/types'
import * as db from '@/db/notes'
import * as dbVersions from '@/db/versions'

interface NoteState {
  notes: Note[]
  currentNote: Note | null
  versions: NoteVersion[]
  loading: boolean
  
  fetchNotes: (notebookId: string) => Promise<void>
  createNote: (notebookId: string) => Promise<Note>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setCurrentNote: (note: Note | null) => void
  saveVersion: (noteId: string, content: string) => Promise<void>
  fetchVersions: (noteId: string) => Promise<void>
  restoreVersion: (noteId: string, versionId: string) => Promise<void>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  versions: [],
  loading: false,

  fetchNotes: async (notebookId) => {
    set({ loading: true })
    const notes = await db.getNotesByNotebook(notebookId)
    set({ notes, loading: false })
  },

  createNote: async (notebookId) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: '无标题',
      content: '',
      notebookId,
      tags: [],
      links: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await db.createNote(note)
    set({ notes: [...get().notes, note], currentNote: note })
    return note
  },

  updateNote: async (id, updates) => {
    const note = get().notes.find(n => n.id === id)
    if (!note) return
    const updated = { ...note, ...updates, updatedAt: Date.now() }
    await db.updateNote(updated)
    set({
      notes: get().notes.map(n => n.id === id ? updated : n),
      currentNote: get().currentNote?.id === id ? updated : get().currentNote
    })
  },

  deleteNote: async (id) => {
    await db.deleteNote(id)
    await dbVersions.deleteVersionsByNote(id)
    set({
      notes: get().notes.filter(n => n.id !== id),
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