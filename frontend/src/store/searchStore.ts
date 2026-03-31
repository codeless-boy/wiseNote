import { create } from 'zustand'
import type { Note } from '@/types'
import * as db from '@/db/notes'

interface SearchState {
  query: string
  results: Note[]
  loading: boolean
  
  setQuery: (query: string) => void
  search: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  loading: false,

  setQuery: (query) => {
    set({ query })
  },

  search: async () => {
    const { query } = get()
    if (!query.trim()) {
      set({ results: [] })
      return
    }
    set({ loading: true })
    const results = await db.searchNotes(query)
    set({ results, loading: false })
  },
}))