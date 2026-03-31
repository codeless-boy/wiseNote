import { getDB } from './index'
import type { NoteVersion } from '@/types'

export async function createVersion(version: NoteVersion): Promise<NoteVersion> {
  const db = await getDB()
  await db.add('versions', version)
  return version
}

export async function getVersionsByNote(noteId: string): Promise<NoteVersion[]> {
  const db = await getDB()
  return db.getAllFromIndex('versions', 'by-note', noteId)
}

export async function getVersion(id: string): Promise<NoteVersion | undefined> {
  const db = await getDB()
  return db.get('versions', id)
}

export async function deleteVersion(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('versions', id)
}

export async function deleteVersionsByNote(noteId: string): Promise<void> {
  const db = await getDB()
  const versions = await getVersionsByNote(noteId)
  const tx = db.transaction('versions', 'readwrite')
  await Promise.all(versions.map(v => tx.store.delete(v.id)))
  await tx.done
}