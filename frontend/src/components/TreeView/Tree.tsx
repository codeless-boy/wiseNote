import React from 'react'
import { Tree as ArboristTree } from 'react-arborist'
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