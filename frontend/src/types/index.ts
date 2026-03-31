export interface Notebook {
  id: string
  name: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  notebookId: string
  tags: string[]
  links: string[]
  createdAt: number
  updatedAt: number
}

export interface NoteVersion {
  id: string
  noteId: string
  content: string
  savedAt: number
}

export interface Tag {
  id: string
  name: string
  color: string | null
  createdAt: number
}