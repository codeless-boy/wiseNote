import type { Notebook, Note } from '@/types'

export type TreeNodeType = 'notebook' | 'note'

export interface TreeNode {
  id: string
  name: string
  type: TreeNodeType
  parentId: string | null
  children: TreeNode[]
  original: Notebook | Note
}

export interface TreeState {
  treeData: TreeNode[]
  selectedId: string | null
  editingId: string | null
  searchQuery: string
}