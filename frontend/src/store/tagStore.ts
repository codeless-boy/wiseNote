import { create } from 'zustand'
import type { Tag } from '@/types'
import * as db from '@/db/tags'

interface TagState {
  tags: Tag[]
  loading: boolean
  
  fetchTags: () => Promise<void>
  createTag: (name: string, color?: string | null) => Promise<Tag>
  updateTag: (id: string, name: string, color?: string | null) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true })
    const tags = await db.getAllTags()
    set({ tags, loading: false })
  },

  createTag: async (name, color?: string | null) => {
    const tag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now(),
    }
    await db.createTag(tag)
    set({ tags: [...get().tags, tag] })
    return tag
  },

  updateTag: async (id, name, color) => {
    const tag = get().tags.find(t => t.id === id)
    if (!tag) return
    const updated = { ...tag, name, color }
    await db.updateTag(updated)
    set({
      tags: get().tags.map(t => t.id === id ? updated : t)
    })
  },

  deleteTag: async (id) => {
    await db.deleteTag(id)
    set({ tags: get().tags.filter(t => t.id !== id) })
  },
}))