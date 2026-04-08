import { useState, useEffect, useRef } from 'react'
import { useNoteStore } from '@/store'
import { Tree, TreeRef } from './Tree'
import { TreeNode } from './TreeNode'
import { Toolbar } from './Toolbar'
import { useTreeAdapter } from './hooks/useTreeAdapter'
import { useTreeActions } from './hooks/useTreeActions'
import type { TreeNode as TreeNodeType } from './types'
import { useNotebookStore } from '@/store/notebookStore'
import { validateName, generateUniqueName } from './utils'
import { useAlertDialog } from '@/hooks/useAlertDialog'

export function TreeView() {
  const { fetchNotebooks } = useNotebookStore()
  const { fetchRootNotes } = useNoteStore()
  const { treeData } = useTreeAdapter()
  const {
    onCreateNotebook,
    onCreateNote,
    onRename,
    onDeleteNotebook,
    onDeleteNote,
  } = useTreeActions()
  const { showAlert, showConfirm, AlertDialogComponent } = useAlertDialog()
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const treeRef = useRef<TreeRef>(null)
  
  useEffect(() => {
    fetchNotebooks()
    fetchRootNotes()
  }, [fetchNotebooks, fetchRootNotes])
  
  const handleCreateNotebook = async () => {
    const id = await onCreateNotebook(null)
    if (id) {
      setEditingId(id)
    }
  }
  
  const handleCreateRootNote = async () => {
    const id = await onCreateNote(null)
    if (id) {
      setEditingId(id)
    }
  }
  
  const handleCreateNoteInNotebook = async (notebookId: string) => {
    const id = await onCreateNote(notebookId)
    if (id) {
      setEditingId(id)
    }
  }
  
  const handleCreateSubNotebook = async (parentId: string) => {
    treeRef.current?.expand(parentId)
    await new Promise(resolve => setTimeout(resolve, 50))
    const id = await onCreateNotebook(parentId)
    if (id) {
      setEditingId(id)
    }
  }
  
  const handleRename = (nodeId: string) => {
    setEditingId(nodeId)
  }
  
  const handleEditComplete = async (nodeId: string, newName: string) => {
    if (editingId !== nodeId) return
    
    const node = findNode(treeData, nodeId)
    if (!node) return
    
    const validationError = validateName(newName)
    if (validationError) {
      await showAlert(validationError)
      return
    }
    
    try {
      await onRename(nodeId, newName, node.type, node.parentId)
      setEditingId(null)
    } catch (error) {
      if (error instanceof Error && error.message === '名称已存在') {
        const confirmed = await showConfirm(
          '名称已存在',
          `名称 "${newName}" 已存在。\n\n点击"确定"自动添加数字后缀\n点击"取消"恢复原名称`,
          '确定',
          '取消'
        )
        if (confirmed) {
          const uniqueName = generateUniqueName(newName, node.parentId, nodeId)
          await onRename(nodeId, uniqueName, node.type, node.parentId)
          setEditingId(null)
        } else {
          setEditingId(null)
        }
      } else if (error instanceof Error) {
        await showAlert(error.message)
      }
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
    <>
      <AlertDialogComponent />
      <div className="h-full flex flex-col">
        <Toolbar
          onCreateNotebook={handleCreateNotebook}
          onCreateRootNote={handleCreateRootNote}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />
        
        <Tree
          ref={treeRef}
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
    </>
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