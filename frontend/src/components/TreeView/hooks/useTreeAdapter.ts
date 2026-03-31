import { useMemo } from 'react'
import { useNotebookStore } from '@/store/notebookStore'
import { useNoteStore } from '@/store/noteStore'
import { buildTree, filterTree } from '../utils'

export function useTreeAdapter() {
  const { notebooks } = useNotebookStore()
  const { notesByNotebook, rootNotes } = useNoteStore()
  
  const treeData = useMemo(() => {
    return buildTree(notebooks, rootNotes, notesByNotebook)
  }, [notebooks, rootNotes, notesByNotebook])
  
  return {
    treeData,
  }
}

export function useFilteredTree(searchQuery: string) {
  const { treeData } = useTreeAdapter()
  
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) {
      return treeData
    }
    
    const lowerQuery = searchQuery.toLowerCase()
    return filterTree(treeData, (node) => {
      return node.name.toLowerCase().includes(lowerQuery)
    })
  }, [treeData, searchQuery])
  
  return {
    filteredTree,
  }
}