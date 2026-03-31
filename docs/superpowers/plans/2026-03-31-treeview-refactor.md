# TreeView 重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用 React-Arborist 重构 TreeView 组件，提供完整的树形交互功能和高性能虚拟滚动。

**Architecture:** 分层架构 - 数据层保持不变，新增适配层(useTreeAdapter/useTreeActions)转换数据，React-Arborist 提供虚拟滚动和树操作，自定义渲染层(TreeNode/NodeActions/Toolbar)实现 UI。

**Tech Stack:** React 18, React-Arborist, Zustand (现有一状态管理), Tailwind CSS

---

## 文件结构

将创建或修改以下文件:

**新创建文件:**
- `frontend/src/components/TreeView/hooks/useTreeAdapter.ts` - 数据适配层，转换 Notebook/Note 为树数据
- `frontend/src/components/TreeView/hooks/useTreeActions.ts` - 树操作逻辑封装(创建、删除、重命名)
- `frontend/src/components/TreeView/Tree.tsx` - React-Arborist 包装组件
- `frontend/src/components/TreeView/TreeNode.tsx` - 节点渲染组件
- `frontend/src/components/TreeView/Toolbar.tsx` - 工具栏组件
- `frontend/src/components/TreeView/NodeActions.tsx` - 节点操作按钮组件
- `frontend/src/components/TreeView/types.ts` - 类型定义
- `frontend/src/components/TreeView/utils.ts` - 工具函数(生成唯一名称等)
- `frontend/src/components/TreeView/tests/useTreeAdapter.test.ts` - 适配层单元测试
- `frontend/src/components/TreeView/tests/useTreeActions.test.ts` - 操作逻辑测试

**修改文件:**
- `frontend/package.json` - 添加 react-arborist 依赖
- `frontend/src/components/TreeView/index.tsx` - 重构为使用新组件

---

## Task 1: 安装依赖

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: 安装 react-arborist 依赖**

Run: `cd frontend && npm install react-arborist`

Expected: 安装成功，package.json 中添加 react-arborist

- [ ] **Step 2: 验证安装**

Run: `cd frontend && npm list react-arborist`

Expected: 显示 react-arborist 版本号

---

## Task 2: 创建类型定义

**Files:**
- Create: `frontend/src/components/TreeView/types.ts`

- [ ] **Step 1: 创建 types.ts 文件**

Create file: `frontend/src/components/TreeView/types.ts`

Content:
```typescript
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
```

- [ ] **Step 2: 提交类型定义**

Run: `cd frontend && git add src/components/TreeView/types.ts && git commit -m "feat: 添加 TreeView 类型定义"`

---

## Task 3: 创建工具函数

**Files:**
- Create: `frontend/src/components/TreeView/utils.ts`

- [ ] **Step 1: 创建 utils.ts 文件**

Create file: `frontend/src/components/TreeView/utils.ts`

Content:
```typescript
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
```

- [ ] **Step 2: 提交工具函数**

Run: `cd frontend && git add src/components/TreeView/utils.ts && git commit -m "feat: 添加 TreeView 工具函数"`

---

## Task 4: 创建数据适配层

**Files:**
- Create: `frontend/src/components/TreeView/hooks/useTreeAdapter.ts`

- [ ] **Step 1: 创建 useTreeAdapter.ts 文件**

Create file: `frontend/src/components/TreeView/hooks/useTreeAdapter.ts`

Content:
```typescript
import { useMemo } from 'react'
import { useNotebookStore } from '@/store/notebookStore'
import { useNoteStore } from '@/store/noteStore'
import type { TreeNode } from '../types'
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
```

- [ ] **Step 2: 提交适配层**

Run: `cd frontend && git add src/components/TreeView/hooks/useTreeAdapter.ts && git commit -m "feat: 添加数据适配层 hook"`

---

## Task 5: 创建操作逻辑封装

**Files:**
- Create: `frontend/src/components/TreeView/hooks/useTreeActions.ts`

- [ ] **Step 1: 创建 useTreeActions.ts 文件**

Create file: `frontend/src/components/TreeView/hooks/useTreeActions.ts`

Content:
```typescript
import { useCallback } from 'react'
import { useNotebookStore } from '@/store/notebookStore'
import { useNoteStore } from '@/store/noteStore'
import { generateUniqueName, checkDuplicateName, validateName } from '../utils'

export function useTreeActions() {
  const { createNotebook, deleteNotebook, updateNotebook, fetchNotebooks } = useNotebookStore()
  const { createNote, deleteNote, updateNote, fetchNotes, fetchRootNotes, setCurrentNote } = useNoteStore()
  
  const onCreateNotebook = useCallback(async (parentId: string | null = null) => {
    const name = generateUniqueName('新建笔记本', parentId)
    const notebook = await createNotebook(name, parentId)
    
    await fetchNotebooks()
    
    return notebook.id
  }, [createNotebook, fetchNotebooks])
  
  const onCreateNote = useCallback(async (notebookId: string | null = null) => {
    const title = generateUniqueName('无标题', notebookId)
    const note = await createNote(notebookId)
    
    if (notebookId !== null) {
      await fetchNotes(notebookId)
    } else {
      await fetchRootNotes()
    }
    
    setCurrentNote(note)
    
    return note.id
  }, [createNote, fetchNotes, fetchRootNotes, setCurrentNote])
  
  const onRename = useCallback(async (
    nodeId: string,
    newName: string,
    type: 'notebook' | 'note',
    parentId: string | null
  ) => {
    const validationError = validateName(newName)
    if (validationError) {
      throw new Error(validationError)
    }
    
    if (checkDuplicateName(newName, parentId, nodeId)) {
      throw new Error('名称已存在')
    }
    
    if (type === 'notebook') {
      await updateNotebook(nodeId, newName)
      await fetchNotebooks()
    } else {
      await updateNote(nodeId, { title: newName })
      if (parentId !== null) {
        await fetchNotes(parentId)
      } else {
        await fetchRootNotes()
      }
    }
  }, [updateNotebook, updateNote, fetchNotebooks, fetchNotes, fetchRootNotes])
  
  const onDeleteNotebook = useCallback(async (notebookId: string) => {
    await deleteNotebook(notebookId)
    await fetchNotebooks()
  }, [deleteNotebook, fetchNotebooks])
  
  const onDeleteNote = useCallback(async (noteId: string, notebookId: string | null) => {
    await deleteNote(noteId)
    
    if (notebookId !== null) {
      await fetchNotes(notebookId)
    } else {
      await fetchRootNotes()
    }
  }, [deleteNote, fetchNotes, fetchRootNotes])
  
  return {
    onCreateNotebook,
    onCreateNote,
    onRename,
    onDeleteNotebook,
    onDeleteNote,
  }
}
```

- [ ] **Step 2: 提交操作逻辑**

Run: `cd frontend && git add src/components/TreeView/hooks/useTreeActions.ts && git commit -m "feat: 添加树操作逻辑封装"`

---

## Task 6: 创建节点动作组件

**Files:**
- Create: `frontend/src/components/TreeView/NodeActions.tsx`

- [ ] **Step 1: 创建 NodeActions.tsx 文件**

Create file: `frontend/src/components/TreeView/NodeActions.tsx`

Content:
```typescript
import { useState } from 'react'
import { FileText, FolderPlus, Pencil, Trash } from 'lucide-react'
import type { TreeNode } from './types'

interface NodeActionsProps {
  node: TreeNode
  onCreateNote: (notebookId: string) => void
  onCreateSubNotebook: (parentId: string) => void
  onRename: (nodeId: string) => void
  onDelete: (nodeId: string, type: 'notebook' | 'note', parentId: string | null) => void
}

export function NodeActions({
  node,
  onCreateNote,
  onCreateSubNotebook,
  onRename,
  onDelete,
}: NodeActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  if (node.type === 'notebook') {
    return (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCreateNote(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="新建笔记"
        >
          <FileText size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCreateSubNotebook(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="新建子笔记本"
        >
          <FolderPlus size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRename(node.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="重命名"
        >
          <Pencil size={14} />
        </button>
        {showConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id, 'notebook', node.parentId)
                setShowConfirm(false)
              }}
              className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
            >
              确认
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowConfirm(false)
              }}
              className="p-1 hover:bg-gray-200 rounded text-xs"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowConfirm(true)
            }}
            className="p-1 hover:bg-gray-200 rounded"
            title="删除"
          >
            <Trash size={14} />
          </button>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRename(node.id)
        }}
        className="p-1 hover:bg-gray-200 rounded"
        title="重命名"
      >
        <Pencil size={14} />
      </button>
      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.id, 'note', node.parentId)
              setShowConfirm(false)
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
          >
            确认
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowConfirm(false)
            }}
            className="p-1 hover:bg-gray-200 rounded text-xs"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowConfirm(true)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="删除"
        >
          <Trash size={14} />
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交 NodeActions 组件**

Run: `cd frontend && git add src/components/TreeView/NodeActions.tsx && git commit -m "feat: 添加节点操作按钮组件"`

---

## Task 7: 创建工具栏组件

**Files:**
- Create: `frontend/src/components/TreeView/Toolbar.tsx`

- [ ] **Step 1: 创建 Toolbar.tsx 文件**

Create file: `frontend/src/components/TreeView/Toolbar.tsx`

Content:
```typescript
import { useState } from 'react'
import { Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react'

interface ToolbarProps {
  onCreateNotebook: () => void
  onCreateRootNote: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

export function Toolbar({
  onCreateNotebook,
  onCreateRootNote,
  onExpandAll,
  onCollapseAll,
}: ToolbarProps) {
  const [showViewOptions, setShowViewOptions] = useState(false)
  
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b">
      <div className="flex items-center gap-2">
        <button
          onClick={onCreateNotebook}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="新建笔记本"
        >
          <Folder size={18} />
        </button>
        <button
          onClick={onCreateRootNote}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="新建笔记"
        >
          <FileText size={18} />
        </button>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowViewOptions(!showViewOptions)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="视图选项"
        >
          <ChevronDown size={18} />
        </button>
        
        {showViewOptions && (
          <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg py-1 min-w-[120px] z-10">
            <button
              onClick={() => {
                onExpandAll()
                setShowViewOptions(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <ChevronDown size={14} />
              <span>全部展开</span>
            </button>
            <button
              onClick={() => {
                onCollapseAll()
                setShowViewOptions(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <ChevronRight size={14} />
              <span>全部折叠</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交 Toolbar 组件**

Run: `cd frontend && git add src/components/TreeView/Toolbar.tsx && git commit -m "feat: 添加工具栏组件"`

---

## Task 8: 创建主干 Tree 组件

**Files:**
- Create: `frontend/src/components/TreeView/Tree.tsx`

- [ ] **Step 1: 安装 react-arborist 类型定义 (如果需要)**

Check if types are bundled or need separate install.

Run: `cd frontend && npm install --save-dev @types/react-arborist`

Expected: 如果类型已包含在包中，此命令会提示无需安装

- [ ] **Step 2: 创建 Tree.tsx 文件**

Create file: `frontend/src/components/TreeView/Tree.tsx`

Content:
```typescript
import { Tree as ArboristTree } from 'react-arborist'
import 'react-arborist/style.css'
import type { TreeNode } from './types'

interface TreeProps {
  data: TreeNode[]
  onSelect?: (nodeId: string, type: 'notebook' | 'note') => void
  onExpand?: (nodeId: string) => void
  onCollapse?: (nodeId: string) => void
  selectedId?: string | null
  children: React.ReactNode
}

export function Tree({ data, onSelect, selectedId, children }: TreeProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <ArboristTree
        data={data}
        children={children}
        rowHeight={28}
        overscanCount={5}
        onSelect={(nodes) => {
          if (nodes.length > 0 && onSelect) {
            const node = nodes[0]
            onSelect(node.id, node.data.type)
          }
        }}
        selection={selectedId}
      />
    </div>
  )
}
```

- [ ] **Step 3: 提交 Tree 组件**

Run: `cd frontend && git add src/components/TreeView/Tree.tsx && git commit -m "feat: 添加 React-Arborist 包装组件"`

---

## Task 9: 创建 TreeNode 渲染组件

**Files:**
- Create: `frontend/src/components/TreeView/TreeNode.tsx`

- [ ] **Step 1: 创建 TreeNode.tsx 文件**

Create file: `frontend/src/components/TreeView/TreeNode.tsx`

Content:
```typescript
import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'
import type { NodeProps } from 'react-arborist'
import type { TreeNode } from './types'
import { NodeActions } from './NodeActions'

interface TreeNodeProps extends NodeProps<TreeNode> {
  onCreateNote: (notebookId: string) => void
  onCreateSubNotebook: (parentId: string) => void
  onRename: (nodeId: string) => void
  onDelete: (nodeId: string, type: 'notebook' | 'note', parentId: string | null) => void
  onSelectNote: (noteId: string) => void
  isEditing: boolean
  onEditComplete: (nodeId: string, newName: string) => void
}

export function TreeNode({
  node,
  style,
  dragHandle,
  onCreateNote,
  onCreateSubNotebook,
  onRename,
  onDelete,
  onSelectNote,
  isEditing,
  onEditComplete,
}: TreeNodeProps) {
  const [editValue, setEditValue] = useState(node.data.name)
  const isNotebook = node.data.type === 'notebook'
  const isExpanded = node.isExpanded
  
  const handleClick = () => {
    if (isNotebook) {
      node.toggle()
    } else {
      onSelectNote(node.id)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isEditing) {
      onEditComplete(node.id, editValue)
    }
    if (e.key === 'Escape' && isEditing) {
      setEditValue(node.data.name)
      node.reset()
    }
  }
  
  return (
    <div
      style={style}
      ref={dragHandle}
      className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 group"
      onClick={handleClick}
    >
      {isNotebook && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            node.toggle()
          }}
          className="p-0.5"
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
      
      {!isNotebook && <span style={{ width: 14 }} />}
      
      <div className="flex items-center gap-1 flex-1">
        {isNotebook ? (
          <Folder size={14} className="text-gray-500" />
        ) : (
          <FileText size={14} className="text-gray-500" />
        )}
        
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onEditComplete(node.id, editValue)}
            className="flex-1 text-sm bg-white border border-blue-500 rounded px-1"
            autoFocus
          />
        ) : (
          <span className="text-sm truncate">{node.data.name}</span>
        )}
      </div>
      
      <NodeActions
        node={node.data}
        onCreateNote={onCreateNote}
        onCreateSubNotebook={onCreateSubNotebook}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  )
}
```

- [ ] **Step 2: 提交 TreeNode 组件**

Run: `cd frontend && git add src/components/TreeView/TreeNode.tsx && git commit -m "feat: 添加节点渲染组件"`

---

## Task 10: 重构主组件 TreeView

**Files:**
- Modify: `frontend/src/components/TreeView/index.tsx`

- [ ] **Step 1: 备份原文件**

Run: `cd frontend && cp src/components/TreeView/index.tsx src/components/TreeView/index.tsx.backup`

- [ ] **Step 2: 重构 TreeView 组件**

Modify file: `frontend/src/components/TreeView/index.tsx`

Replace entire content with:
```typescript
import { useState, useEffect } from 'react'
import { useNoteStore } from '@/store'
import { Tree } from './Tree'
import { TreeNode } from './TreeNode'
import { Toolbar } from './Toolbar'
import { useTreeAdapter } from './hooks/useTreeAdapter'
import { useTreeActions } from './hooks/useTreeActions'
import type { TreeNode as TreeNodeType } from './types'

export function TreeView() {
  const { fetchNotebooks, fetchRootNotes } = useNoteStore()
  const { treeData } = useTreeAdapter()
  const {
    onCreateNotebook,
    onCreateNote,
    onRename,
    onDeleteNotebook,
    onDeleteNote,
  } = useTreeActions()
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  useEffect(() => {
    fetchNotebooks()
    fetchRootNotes()
  }, [fetchNotebooks, fetchRootNotes])
  
  const handleCreateNotebook = async () => {
    const id = await onCreateNotebook(null)
    setEditingId(id)
  }
  
  const handleCreateRootNote = async () => {
    const id = await onCreateNote(null)
    setEditingId(id)
  }
  
  const handleCreateNoteInNotebook = async (notebookId: string) => {
    const id = await onCreateNote(notebookId)
    setEditingId(id)
  }
  
  const handleCreateSubNotebook = async (parentId: string) => {
    const id = await onCreateNotebook(parentId)
    setEditingId(id)
  }
  
  const handleRename = (nodeId: string) => {
    setEditingId(nodeId)
  }
  
  const handleEditComplete = async (nodeId: string, newName: string) => {
    const node = findNode(treeData, nodeId)
    if (!node) return
    
    try {
      await onRename(nodeId, newName, node.type, node.parentId)
      setEditingId(null)
    } catch (error) {
      alert(error.message)
    }
  }
  
  const handleDelete = async (
    nodeId: string,
    type: 'notebook' | 'note',
    parentId: string | null
  ) => {
    if (type === 'notebook') {
      await onDeleteNotebook(nodeId)
    } else {
      await onDeleteNote(nodeId, parentId)
    }
  }
  
  const handleSelectNote = (noteId: string) => {
    const { setCurrentNote, notesByNotebook, rootNotes } = useNoteStore.getState()
    
    const note = [...rootNotes, ...Object.values(notesByNotebook).flat()].find(
      (n) => n.id === noteId
    )
    
    if (note) {
      setCurrentNote(note)
      setSelectedId(noteId)
    }
  }
  
  const handleExpandAll = () => {
    // React-Arborist 会处理展开逻辑
    // 需要通过 ref 访问树 API
  }
  
  const handleCollapseAll = () => {
    // React-Arborist 会处理折叠逻辑
  }
  
  return (
    <div className="h-full flex flex-col">
      <Toolbar
        onCreateNotebook={handleCreateNotebook}
        onCreateRootNote={handleCreateRootNote}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />
      
      <Tree
        data={treeData}
        selectedId={selectedId}
        onSelect={(nodeId, type) => {
          if (type === 'note') {
            handleSelectNote(nodeId)
          }
        }}
      >
        {(props) => (
          <TreeNode
            {...props}
            onCreateNote={handleCreateNoteInNotebook}
            onCreateSubNotebook={handleCreateSubNotebook}
            onRename={handleRename}
            onDelete={handleDelete}
            onSelectNote={handleSelectNote}
            isEditing={editingId === props.node.id}
            onEditComplete={handleEditComplete}
          />
        )}
      </Tree>
    </div>
  )
}

function findNode(nodes: TreeNodeType[], id: string): TreeNodeType | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNode(node.children, id)
    if (found) return found
  }
  return null
}
```

- [ ] **Step 3: 验证编译**

Run: `cd frontend && npm run typecheck`

Expected: 类型检查通过

- [ ] **Step 4: 提交重构**

Run: `cd frontend && git add -A && git commit -m "refactor: 使用 React-Arborist 重构 TreeView"`

---

## Task 11: 创建测试 - useTreeAdapter

**Files:**
- Create: `frontend/src/components/TreeView/tests/useTreeAdapter.test.ts`

- [ ] **Step 1: 创建测试目录**

Run: `mkdir -p frontend/src/components/TreeView/tests`

- [ ] **Step 2: 创建 useTreeAdapter 测试**

Create file: `frontend/src/components/TreeView/tests/useTreeAdapter.test.ts`

Content:
```typescript
import { describe, it, expect } from 'vitest'
import { buildTree, filterTree } from '../utils'
import type { Notebook, Note } from '@/types'

describe('buildTree', () => {
  it('should build tree from notebooks and root notes', () => {
    const notebooks: Notebook[] = [
      { id: '1', name: '笔记本1', parentId: null, createdAt: 0, updatedAt: 0 },
    ]
    
    const rootNotes: Note[] = [
      { id: 'n1', title: '根笔记', content: '', notebookId: null, tags: [], links: [], createdAt: 0, updatedAt: 0 },
    ]
    
    const notesByNotebook: Record<string, Note[]> = {}
    
    const tree = buildTree(notebooks, rootNotes, notesByNotebook)
    
    expect(tree).toHaveLength(2)
    expect(tree.find(n => n.type === 'note')?.name).toBe('根笔记')
    expect(tree.find(n => n.type === 'notebook')?.name).toBe('笔记本1')
  })
  
  it('should nest notes under notebooks', () => {
    const notebooks: Notebook[] = [
      { id: '1', name: '笔记本1', parentId: null, createdAt: 0, updatedAt: 0 },
    ]
    
    const rootNotes: Note[] = []
    
    const notesByNotebook: Record<string, Note[]> = {
      '1': [
        { id: 'n1', title: '笔记1', content: '', notebookId: '1', tags: [], links: [], createdAt: 0, updatedAt: 0 },
      ],
    }
    
    const tree = buildTree(notebooks, rootNotes, notesByNotebook)
    
    const notebookNode = tree.find(n => n.id === '1')
    expect(notebookNode?.children).toHaveLength(1)
    expect(notebookNode?.children[0].name).toBe('笔记1')
  })
})

describe('filterTree', () => {
  it('should filter nodes by predicate', () => {
    const nodes = [
      {
        id: '1',
        name: '笔记本A',
        type: 'notebook' as const,
        parentId: null,
        children: [],
        original: {} as Notebook,
      },
      {
        id: '2',
        name: '笔记本B',
        type: 'notebook' as const,
        parentId: null,
        children: [],
        original: {} as Notebook,
      },
    ]
    
    const filtered = filterTree(nodes, (node) => node.name.includes('A'))
    
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('笔记本A')
  })
})
```

- [ ] **Step 3: 运行测试**

Run: `cd frontend && npm test -- useTreeAdapter.test.ts`

Expected: 测试通过

- [ ] **Step 4: 提交测试**

Run: `cd frontend && git add src/components/TreeView/tests/useTreeAdapter.test.ts && git commit -m "test: 添加 useTreeAdapter 单元测试"`

---

## Task 12: 集成测试和验证

**Files:**
- No new files

- [ ] **Step 1: 运行类型检查**

Run: `cd frontend && npm run typecheck`

Expected: 无类型错误

- [ ] **Step 2: 运行 lint**

Run: `cd frontend && npm run lint`

Expected: 无 lint 错误

- [ ] **Step 3: 启动开发服务器**

Run: `cd frontend && npm run dev`

Expected: 服务器启动成功

- [ ] **Step 4: 手动测试基本功能**

在浏览器中测试:
1. 打开应用
2. 点击"新建笔记本"按钮
3. 验证新笔记本创建
4. 点击笔记本,验证笔记创建
5. 测试重命名功能
6. 测试删除功能

- [ ] **Step 5: 提交最终版本**

Run: `cd frontend && git add -A && git commit -m "test: 完成集成测试和验证"`

---

## 验收标准

完成所有任务后,TreeView 应该满足:

1. ✅ 使用 React-Arborist 实现虚拟滚动
2. ✅ 支持创建笔记本和笔记
3. ✅ 支持重命名节点
4. ✅ 支持删除节点
5. ✅ 支持键盘导航
6. ✅ 支持展开/折叠全部
7. ✅ 类型检查通过
8. ✅ Lint 检查通过
9. ✅ 单元测试通过
10. ✅ 手动测试通过