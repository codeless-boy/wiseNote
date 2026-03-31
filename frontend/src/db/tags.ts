import { getDB } from './index'
import type { Tag } from '@/types'

export async function createTag(tag: Tag): Promise<Tag> {
  const db = await getDB()
  await db.add('tags', tag)
  return tag
}

export async function getTag(id: string): Promise<Tag | undefined> {
  const db = await getDB()
  return db.get('tags', id)
}

export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB()
  return db.getAll('tags')
}

export async function updateTag(tag: Tag): Promise<Tag> {
  const db = await getDB()
  await db.put('tags', tag)
  return tag
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('tags', id)
}