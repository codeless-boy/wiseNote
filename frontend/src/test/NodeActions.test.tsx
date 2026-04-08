import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NodeActions } from '../components/TreeView/NodeActions'
import type { TreeNode } from '../components/TreeView/types'

const mockNotebookNode: TreeNode = {
  id: 'nb-1',
  name: '测试笔记本',
  type: 'notebook',
  parentId: null,
  children: [],
  original: { id: 'nb-1', name: '测试笔记本', parentId: null } as any,
}

const mockNoteNode: TreeNode = {
  id: 'note-1',
  name: '测试笔记',
  type: 'note',
  parentId: 'nb-1',
  children: [],
  original: { id: 'note-1', title: '测试笔记', parentId: 'nb-1' } as any,
}

describe('NodeActions Component', () => {
  const defaultProps = {
    node: mockNotebookNode,
    onCreateNote: vi.fn(),
    onCreateSubNotebook: vi.fn(),
    onRename: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('NA-01: should display 4 action buttons for notebook', () => {
    render(<NodeActions {...defaultProps} />)
    const buttons = document.querySelectorAll('button')
    expect(buttons.length).toBe(4)
  })

  it('NA-02: should display 2 action buttons for note', () => {
    render(<NodeActions {...defaultProps} node={mockNoteNode} />)
    const buttons = document.querySelectorAll('button')
    expect(buttons.length).toBe(2)
  })

  it('NA-03: should call onCreateNote when clicking create note button', () => {
    render(<NodeActions {...defaultProps} />)
    const buttons = document.querySelectorAll('button')
    fireEvent.click(buttons[0])
    expect(defaultProps.onCreateNote).toHaveBeenCalledWith('nb-1')
  })

  it('NA-04: should call onCreateSubNotebook when clicking create sub notebook button', () => {
    render(<NodeActions {...defaultProps} />)
    const buttons = document.querySelectorAll('button')
    fireEvent.click(buttons[1])
    expect(defaultProps.onCreateSubNotebook).toHaveBeenCalledWith('nb-1')
  })

  it('NA-05: should call onRename when clicking rename button', () => {
    render(<NodeActions {...defaultProps} />)
    const buttons = document.querySelectorAll('button')
    fireEvent.click(buttons[2])
    expect(defaultProps.onRename).toHaveBeenCalledWith('nb-1')
  })

  it('NA-06: should show confirm/cancel buttons after delete click', () => {
    render(<NodeActions {...defaultProps} />)
    const deleteButton = document.querySelectorAll('button')[3]
    fireEvent.click(deleteButton)
    
    const confirmButtons = document.querySelectorAll('button')
    expect(confirmButtons.length).toBeGreaterThan(4)
  })

  it('NA-07: should call onDelete when clicking confirm', () => {
    render(<NodeActions {...defaultProps} />)
    const deleteButton = document.querySelectorAll('button')[3]
    fireEvent.click(deleteButton)
    
    const buttons = document.querySelectorAll('button')
    const confirmButton = buttons[buttons.length - 2]
    fireEvent.click(confirmButton)
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith('nb-1', 'notebook', null)
  })

  it('NA-08: should not call onDelete when clicking cancel', () => {
    render(<NodeActions {...defaultProps} />)
    const deleteButton = document.querySelectorAll('button')[3]
    fireEvent.click(deleteButton)
    
    const buttons = document.querySelectorAll('button')
    const cancelButton = buttons[buttons.length - 1]
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onDelete).not.toHaveBeenCalled()
  })

  it('NA-09: should pass correct parameters to onDelete', () => {
    const props = {
      ...defaultProps,
      node: { ...mockNoteNode, parentId: 'nb-1' },
    }
    render(<NodeActions {...props} />)
    
    const deleteButton = document.querySelectorAll('button')[1]
    fireEvent.click(deleteButton)
    
    const buttons = document.querySelectorAll('button')
    const confirmButton = buttons[buttons.length - 2]
    fireEvent.click(confirmButton)
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith('note-1', 'note', 'nb-1')
  })
})