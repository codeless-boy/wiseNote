import { getDB } from './index'
import type { Notebook } from '@/types'

export async function createNotebook(notebook: Notebook): Promise<Notebook> {
  const db = await getDB()
  await db.add('notebooks', notebook)
  return notebook
}

export async function getNotebook(id: string): Promise<Notebook | undefined> {
  const db = await getDB()
  return db.get('notebooks', id)
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  const db = await getDB()
  return db.getAll('notebooks')
}

export async function getNotebooksByParent(parentId: string | null): Promise<Notebook[]> {
  const db = await getDB()
  const all = await db.getAll('notebooks')
  return all.filter(n => n.parentId === parentId)
}

export async function updateNotebook(notebook: Notebook): Promise<Notebook> {
  const db = await getDB()
  const updated = { ...notebook, updatedAt: Date.now() }
  await db.put('notebooks', updated)
  return updated
}

export async function deleteNotebook(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notebooks', id)
}