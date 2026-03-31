import { create } from 'zustand'
import type { Notebook } from '@/types'
import * as db from '@/db/notebooks'

interface NotebookState {
  notebooks: Notebook[]
  currentNotebookId: string | null
  loading: boolean
  
  fetchNotebooks: () => Promise<void>
  createNotebook: (name: string, parentId?: string | null) => Promise<Notebook>
  updateNotebook: (id: string, name: string) => Promise<void>
  deleteNotebook: (id: string) => Promise<void>
  setCurrentNotebook: (id: string | null) => void
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  notebooks: [],
  currentNotebookId: null,
  loading: false,

  fetchNotebooks: async () => {
    set({ loading: true })
    const notebooks = await db.getAllNotebooks()
    set({ notebooks, loading: false })
  },

  createNotebook: async (name, parentId = null) => {
    const notebook: Notebook = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await db.createNotebook(notebook)
    set({ notebooks: [...get().notebooks, notebook] })
    return notebook
  },

  updateNotebook: async (id, name) => {
    const notebook = get().notebooks.find(n => n.id === id)
    if (!notebook) return
    const updated = { ...notebook, name, updatedAt: Date.now() }
    await db.updateNotebook(updated)
    set({
      notebooks: get().notebooks.map(n => n.id === id ? updated : n)
    })
  },

  deleteNotebook: async (id) => {
    await db.deleteNotebook(id)
    set({
      notebooks: get().notebooks.filter(n => n.id !== id),
      currentNotebookId: get().currentNotebookId === id ? null : get().currentNotebookId
    })
  },

  setCurrentNotebook: (id) => {
    set({ currentNotebookId: id })
  },
}))