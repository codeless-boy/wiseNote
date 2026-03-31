import { openDB, IDBPDatabase } from 'idb'
import type { Notebook, Note, NoteVersion, Tag } from '@/types'

const DB_NAME = 'wiseNote'
const DB_VERSION = 1

type WiseNoteDB = IDBPDatabase<{
  notebooks: { key: string; value: Notebook; indexes: { 'by-parent': string } }
  notes: { key: string; value: Note; indexes: { 'by-notebook': string; 'by-tags': string } }
  versions: { key: string; value: NoteVersion; indexes: { 'by-note': string } }
  tags: { key: string; value: Tag }
}>

let dbInstance: WiseNoteDB | null = null

export async function getDB(): Promise<WiseNoteDB> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notebooks')) {
        const notebookStore = db.createObjectStore('notebooks', { keyPath: 'id' })
        notebookStore.createIndex('by-parent', 'parentId')
      }

      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' })
        noteStore.createIndex('by-notebook', 'notebookId')
        noteStore.createIndex('by-tags', 'tags', { multiEntry: true })
      }

      if (!db.objectStoreNames.contains('versions')) {
        const versionStore = db.createObjectStore('versions', { keyPath: 'id' })
        versionStore.createIndex('by-note', 'noteId')
      }

      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' })
      }
    },
  })

  return dbInstance
}