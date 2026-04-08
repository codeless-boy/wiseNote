import React, { useImperativeHandle, useRef, forwardRef } from 'react'
import { Tree as ArboristTree, TreeApi } from 'react-arborist'
import type { TreeNode } from './types'
import type { NodeRendererProps } from 'react-arborist'

interface TreeProps {
  data: TreeNode[]
  onSelect?: (nodeId: string, type: 'notebook' | 'note') => void
  onExpand?: (nodeId: string) => void
  onCollapse?: (nodeId: string) => void
  selectedId?: string
  children: (props: NodeRendererProps<TreeNode>) => React.ReactNode
}

export interface TreeRef {
  expand: (nodeId: string) => void
  collapse: (nodeId: string) => void
}

export const Tree = forwardRef<TreeRef, TreeProps>(({ data, onSelect, selectedId, children }, ref) => {
  const treeRef = useRef<TreeApi<TreeNode> | null>(null)

  useImperativeHandle(ref, () => ({
    expand: (nodeId: string) => {
      if (treeRef.current) {
        treeRef.current.open(nodeId)
      }
    },
    collapse: (nodeId: string) => {
      if (treeRef.current) {
        treeRef.current.close(nodeId)
      }
    },
  }))

  return (
    <div className="flex-1 overflow-hidden">
      <ArboristTree
        ref={treeRef}
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
})