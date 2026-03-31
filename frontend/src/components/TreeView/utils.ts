import type { Notebook, Note } from '@/types'
import type { TreeNode } from './types'
import { useNotebookStore } from '@/store/notebookStore'
import { useNoteStore } from '@/store/noteStore'

export function generateUniqueName(
  baseName: string,
  parentId: string | null,
  excludeId?: string
): string {
  const { notebooks } = useNotebookStore.getState()
  const { notesByNotebook, rootNotes } = useNoteStore.getState()
  
  const siblingNotebooks = notebooks.filter(n => n.parentId === parentId && n.id !== excludeId)
  const siblingNotes = parentId === null 
    ? rootNotes 
    : (notesByNotebook[parentId] || [])
  
  let name = baseName
  let counter = 1
  
  while (siblingNotebooks.some(n => n.name === name) || siblingNotes.some(n => n.title === name)) {
    name = `${baseName} ${counter}`
    counter++
  }
  
  return name
}

export function checkDuplicateName(
  name: string,
  parentId: string | null,
  excludeId?: string
): boolean {
  const { notebooks } = useNotebookStore.getState()
  const { notesByNotebook, rootNotes } = useNoteStore.getState()
  
  const siblingNotebooks = notebooks.filter(n => n.parentId === parentId && n.id !== excludeId)
  const siblingNotes = parentId === null 
    ? rootNotes 
    : (notesByNotebook[parentId] || [])
  
  return siblingNotebooks.some(n => n.name === name) || siblingNotes.some(n => n.title === name)
}

export function buildTree(
  notebooks: Notebook[],
  rootNotes: Note[],
  notesByNotebook: Record<string, Note[]>
): TreeNode[] {
  const childrenMap = new Map<string | null, TreeNode[]>()
  
  notebooks.forEach(notebook => {
    const parentChildren = childrenMap.get(notebook.parentId) || []
    parentChildren.push({
      id: notebook.id,
      name: notebook.name,
      type: 'notebook',
      parentId: notebook.parentId,
      children: [],
      original: notebook
    })
    childrenMap.set(notebook.parentId, parentChildren)
  })
  
  rootNotes.forEach(note => {
    const parentChildren = childrenMap.get(null) || []
    parentChildren.push({
      id: note.id,
      name: note.title,
      type: 'note',
      parentId: null,
      children: [],
      original: note
    })
    childrenMap.set(null, parentChildren)
  })
  
  Object.entries(notesByNotebook).forEach(([notebookId, notes]) => {
    const parentChildren = childrenMap.get(notebookId) || []
    notes.forEach(note => {
      parentChildren.push({
        id: note.id,
        name: note.title,
        type: 'note',
        parentId: notebookId,
        children: [],
        original: note
      })
    })
    childrenMap.set(notebookId, parentChildren)
  })
  
  function buildNode(notebook: Notebook): TreeNode {
    const children = childrenMap.get(notebook.id) || []
    const nestedNotebooks = notebooks
      .filter(n => n.parentId === notebook.id)
      .map(buildNode)
    
    childrenMap.set(notebook.id, [...children, ...nestedNotebooks])
    
    return {
      id: notebook.id,
      name: notebook.name,
      type: 'notebook',
      parentId: notebook.parentId,
      children: childrenMap.get(notebook.id) || [],
      original: notebook
    }
  }
  
  const rootNotebookNodes = notebooks
    .filter(n => n.parentId === null)
    .map(buildNode)
  
  const rootNoteNodes = (childrenMap.get(null) || []).filter(n => n.type === 'note')
  
  const rootNodes = [...rootNoteNodes, ...rootNotebookNodes]
  
  return rootNodes.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
}

export function filterTree(
  nodes: TreeNode[],
  predicate: (node: TreeNode) => boolean
): TreeNode[] {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    const matches = predicate(node)
    const filteredChildren = filterTree(node.children, predicate)
    
    if (matches || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren
      })
    }
    
    return acc
  }, [])
}

export function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return '名称不能为空'
  }
  
  if (name.length > 100) {
    return '名称不能超过 100 个字符'
  }
  
  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(name)) {
    return '名称不能包含特殊字符: < > : " / \\ | ? *'
  }
  
  return null
}