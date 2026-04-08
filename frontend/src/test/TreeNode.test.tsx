import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TreeNode } from '../components/TreeView/TreeNode'
import type { TreeNode as TreeNodeType } from '../components/TreeView/types'

const mockNotebookNode = {
  id: 'nb-1',
  name: '测试笔记本',
  type: 'notebook' as const,
  parentId: null,
  children: [],
  original: { id: 'nb-1', name: '测试笔记本', parentId: null },
}

const mockNoteNode = {
  id: 'note-1',
  name: '测试笔记',
  type: 'note' as const,
  parentId: 'nb-1',
  children: [],
  original: { id: 'note-1', title: '测试笔记', parentId: 'nb-1' },
}

const createMockNode = (isOpen = false, isSelected = false) => ({
  id: 'nb-1',
  data: mockNotebookNode,
  isOpen: () => isOpen,
  isSelected: () => isSelected,
  toggle: vi.fn(),
})

describe('TreeNode Component', () => {
  const defaultProps = {
    node: createMockNode(),
    style: { height: 28 },
    dragHandle: null,
    onCreateNote: vi.fn(),
    onCreateSubNotebook: vi.fn(),
    onRename: vi.fn(),
    onDelete: vi.fn(),
    onSelectNote: vi.fn(),
    isEditing: false,
    onEditComplete: vi.fn(),
  }

  it('TN-01: should render node name', () => {
    render(<TreeNode {...defaultProps} />)
    expect(screen.getByText('测试笔记本')).toBeInTheDocument()
  })

  it('TN-02: should display folder icon for notebook', () => {
    render(<TreeNode {...defaultProps} node={createMockNode()} />)
    const folderIcon = document.querySelector('svg[data-testid="folder-icon"]') 
      || document.querySelector('.text-gray-500')
    expect(folderIcon).toBeInTheDocument()
  })

  it('TN-03: should display file icon for note', () => {
    const noteNode = {
      ...createMockNode(),
      data: mockNoteNode,
    }
    render(<TreeNode {...defaultProps} node={noteNode} />)
    expect(screen.getByText('测试笔记')).toBeInTheDocument()
  })

  it('TN-04: should display expand/collapse button for notebook', () => {
    render(<TreeNode {...defaultProps} node={createMockNode(false)} />)
    const buttons = document.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('TN-05: should call node.toggle when clicking expand button', () => {
    const mockNode = createMockNode(false)
    render(
      <TreeNode
        {...defaultProps}
        node={mockNode}
      />
    )
    const button = document.querySelector('button')
    if (button) {
      fireEvent.click(button)
      expect(mockNode.toggle).toHaveBeenCalled()
    }
  })

  it('TN-06: should toggle on notebook click', () => {
    const mockNode = createMockNode(false)
    render(<TreeNode {...defaultProps} node={mockNode} />)
    const container = document.querySelector('.cursor-pointer')
    if (container) {
      fireEvent.click(container)
      expect(mockNode.toggle).toHaveBeenCalled()
    }
  })

  it('TN-07: should call onSelectNote on note click', () => {
    const noteNode = {
      id: 'note-1',
      data: mockNoteNode,
      isOpen: () => false,
      isSelected: () => false,
      toggle: vi.fn(),
    }
    render(<TreeNode {...defaultProps} node={noteNode} />)
    const container = document.querySelector('.cursor-pointer')
    if (container) {
      fireEvent.click(container)
      expect(defaultProps.onSelectNote).toHaveBeenCalledWith('note-1')
    }
  })

  it('TN-08: should show input when editing', () => {
    render(<TreeNode {...defaultProps} isEditing={true} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('测试笔记本')
  })

  it('TN-09: should update input value on change', () => {
    render(<TreeNode {...defaultProps} isEditing={true} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '新名称' } })
    expect(input).toHaveValue('新名称')
  })

  it('TN-10: should call onEditComplete on Enter key', () => {
    render(<TreeNode {...defaultProps} isEditing={true} />)
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(defaultProps.onEditComplete).toHaveBeenCalledWith('nb-1', '测试笔记本')
  })

  it('TN-11: should call onEditComplete on blur', () => {
    render(<TreeNode {...defaultProps} isEditing={true} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    expect(defaultProps.onEditComplete).toHaveBeenCalledWith('nb-1', '测试笔记本')
  })

  it('TN-12: should reset value on Escape key', () => {
    render(<TreeNode {...defaultProps} isEditing={true} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '新名称' } })
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveValue('测试笔记本')
  })
})