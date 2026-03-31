import { getDB } from './index'
import type { Note } from '@/types'

export async function createNote(note: Note): Promise<Note> {
  const db = await getDB()
  await db.add('notes', note)
  return note
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await getDB()
  return db.get('notes', id)
}

export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-notebook', notebookId)
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB()
  return db.getAll('notes')
}

export async function updateNote(note: Note): Promise<Note> {
  const db = await getDB()
  const updated = { ...note, updatedAt: Date.now() }
  await db.put('notes', updated)
  return updated
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notes', id)
}

export async function searchNotes(query: string): Promise<Note[]> {
  const db = await getDB()
  const all = await db.getAll('notes')
  const lowerQuery = query.toLowerCase()
  return all.filter(n => 
    n.title.toLowerCase().includes(lowerQuery) ||
    n.content.toLowerCase().includes(lowerQuery)
  )
}

export async function getNotesByTag(tagId: string): Promise<Note[]> {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-tags', tagId)
}