import React, { useRef, useEffect, useCallback } from 'react'
import { Editor, editorViewCtx, parserCtx, rootCtx } from '@milkdown/core'
import { undo, redo } from '@milkdown/prose/history'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { prism } from '@milkdown/plugin-prism'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { Selection } from '@milkdown/prose/state'
import type { Ctx } from '@milkdown/ctx'
import type { MDEditorProps } from './types'
import { createCodeLanguageCompletionPlugin, codeLanguageCompletionKey, CodeLanguageMenu, filterLanguages } from './plugins'
import type { CompletionState } from './plugins/codeLanguageCompletion/types'
import { Toolbar } from './components/Toolbar'
import './styles/editor.css'

const MilkdownEditor: React.FC<{
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
  readOnly?: boolean
  placeholder?: string
  theme: 'light' | 'dark'
}> = ({ value, onChange, onImageUpload, readOnly, placeholder, theme }) => {
  const editorRef = useRef<Ctx | null>(null)
  const onChangeRef = useRef(onChange)
  const isInitializedRef = useRef(false)
  
  const [completionState, setCompletionState] = React.useState<CompletionState>({
    active: false,
    pos: 0,
    query: '',
    selectedIndex: 0,
  })
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 })

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const { get, loading } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          onChangeRef.current(markdown)
        })
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(prism)
      .use(createCodeLanguageCompletionPlugin())
      .use(listener),
    []
  )

  useEffect(() => {
    if (!loading && get()) {
      const editor = get()
      if (editor) {
        editorRef.current = editor.ctx
      }
    }
  }, [loading, get])

  // Only set initial content once
  useEffect(() => {
    if (isInitializedRef.current) return
    const ctx = editorRef.current
    if (!ctx || loading) return

    try {
      const view = ctx.get(editorViewCtx)
      const parser = ctx.get(parserCtx)
      const doc = parser(value)
      if (doc && view) {
        const state = view.state
        view.dispatch(
          state.tr.replaceWith(0, state.doc.content.size, doc.content)
        )
        isInitializedRef.current = true
      }
    } catch {
      // Editor context not ready yet, will retry on next render
    }
  }, [value, loading])

  useEffect(() => {
    if (!editorRef.current || loading) return
    
    const ctx = editorRef.current
    const view = ctx.get(editorViewCtx)
    if (!view) return

    const observer = new MutationObserver(() => {
      // Force React tore-render on DOM changes
      setCompletionState(prev => {
        const pluginState = codeLanguageCompletionKey.getState(view.state)
        return pluginState && JSON.stringify(pluginState) !== JSON.stringify(prev)
          ? pluginState
          : prev
      })
    })

    // Subscribe to ProseMirror state changes
    const dispatch = view.dispatch.bind(view)
    view.dispatch = (tr) => {
      dispatch(tr)
      const pluginState = codeLanguageCompletionKey.getState(view.state)
      if (pluginState) {
        setCompletionState(pluginState)
        if (pluginState.active) {
          const coords = view.coordsAtPos(pluginState.pos)
          setMenuPosition({ top: coords.bottom + 4, left: coords.left })
        }
      }
    }

    return () => {
      view.dispatch = dispatch
      observer.disconnect()
    }
  }, [loading])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertMark = useCallback((markName: string, attrs?: Record<string, unknown>) => {
    const ctx = editorRef.current
    if (!ctx) return

    const view = ctx.get(editorViewCtx)
    if (!view) return

    const { from, to } = view.state.selection
    const markType = view.state.schema.marks[markName]
    if (!markType) return

    view.dispatch(view.state.tr.addMark(from, to, markType.create(attrs)))
    view.focus()
  }, [])

  const insertNode = useCallback((nodeName: string, attrs?: Record<string, unknown>) => {
    const ctx = editorRef.current
    if (!ctx) return

    const view = ctx.get(editorViewCtx)
    if (!view) return

    const nodeType = view.state.schema.nodes[nodeName]
    if (!nodeType) return

    view.dispatch(view.state.tr.replaceSelectionWith(nodeType.create(attrs)))
    view.focus()
  }, [])

  const handleSelectLanguage = useCallback((language: string) => {
    const ctx = editorRef.current
    if (!ctx) return
    
    const view = ctx.get(editorViewCtx)
    if (!view) return
    
    const state = codeLanguageCompletionKey.getState(view.state)
    if (!state) return
    
    const { pos } = state
    const nodeType = view.state.schema.nodes.code_block
    if (!nodeType) return
    
    const tr = view.state.tr
    const codeBlock = nodeType.create({ language })
    
    // Delete the ```(3 characters) and insert code block
    tr.delete(pos, pos + 3)
    tr.insert(pos, codeBlock)
    
    // Position cursor inside the code block (at position 1, which is inside the code block)
    // Code block structure: paragraph > code_block(at pos 0) > text content
    // So we need to position at pos + 1 to be inside the code block
    const insideCodeBlock = pos + 1
    tr.setSelection(Selection.near(tr.doc.resolve(insideCodeBlock)))
    
    view.dispatch(tr.setMeta('codeBlockLanguageCompletion', { type: 'select' }))
    view.focus()
  }, [])

  const handleQueryChange = useCallback((query: string) => {
    const ctx = editorRef.current
    if (!ctx) return
    
    const view = ctx.get(editorViewCtx)
    if (!view) return
    
    const filtered = filterLanguages(query)
    view.dispatch(view.state.tr.setMeta('codeBlockLanguageCompletion', {
      type: 'updateQuery',
      query,
      filteredCount: filtered.length,
    }))
  }, [])

  const handleCompletionClose = useCallback(() => {
    const ctx = editorRef.current
    if (!ctx) return
    
    const view = ctx.get(editorViewCtx)
    if (!view) return
    
    view.dispatch(view.state.tr.setMeta('codeBlockLanguageCompletion', { type: 'close' }))
  },[])

  const handleImageUpload = useCallback(async (file: File) => {
    const ctx = editorRef.current
    if (!ctx) return

    let url: string
    if (onImageUpload) {
      url = await onImageUpload(file)
    } else {
      url = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    }

    const view = ctx.get(editorViewCtx)
    if (!view) return

    const { from } = view.state.selection
    const node = view.state.schema.nodes.image.create({ src: url })
    view.dispatch(view.state.tr.insert(from, node))
    view.focus()
  }, [onImageUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
      e.target.value = ''
    }
  }, [handleImageUpload])

  const toolbarActions = {
    onBold: () => insertMark('strong'),
    onItalic: () => insertMark('em'),
    onStrike: () => insertMark('s'),
    onHeading: (level: number) => {
      const ctx = editorRef.current
      if (!ctx) return
      const view = ctx.get(editorViewCtx)
      if (!view) return
      const { from, to } = view.state.selection
      const nodeType = view.state.schema.nodes.heading
      if (nodeType) {
        view.dispatch(view.state.tr.setBlockType(from, to, nodeType, { level }))
        view.focus()
      }
    },
    onQuote: () => insertNode('blockquote'),
    onCode: () => insertMark('code'),
    onCodeBlock: () => insertNode('code_block'),
    onBulletList: () => insertNode('bullet_list'),
    onOrderedList: () => insertNode('ordered_list'),
    onLink: () => {
      const url = prompt('请输入链接地址：')
      if (url) {
        insertMark('link', { href: url })
      }
    },
    onImage: () => fileInputRef.current?.click(),
    onHorizontalRule: () => insertNode('horizontal_rule'),
    onUndo: () => {
      const ctx = editorRef.current
      if (!ctx) return
      const view = ctx.get(editorViewCtx)
      if (!view) return
      undo(view.state, view.dispatch)
      view.focus()
    },
    onRedo: () => {
      const ctx = editorRef.current
      if (!ctx) return
      const view = ctx.get(editorViewCtx)
      if (!view) return
      redo(view.state, view.dispatch)
      view.focus()
    },
    canUndo: true,
    canRedo: true,
  }

  return (
    <div className={`md-editor ${theme === 'dark' ? 'md-editor-dark' : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {!readOnly && <Toolbar {...toolbarActions} />}
      {completionState.active && (
        <CodeLanguageMenu
          visible={completionState.active}
          position={menuPosition}
          query={completionState.query}
          selectedIndex={completionState.selectedIndex}
          onSelect={handleSelectLanguage}
          onClose={handleCompletionClose}
          onQueryChange={handleQueryChange}
        />
      )}
      <div className="md-editor-content" data-placeholder={placeholder}>
        {loading && <div style={{ color: '#999', padding: '10px' }}>初始化编辑器...</div>}
        <Milkdown />
      </div>
    </div>
  )
}

export const MDEditor: React.FC<MDEditorProps> = ({
  value,
  onChange,
  onImageUpload,
  placeholder = '开始输入...',
  readOnly = false,
  className = '',
  theme = 'light',
}) => {
  return (
    <div className={className}>
      <MilkdownProvider>
        <MilkdownEditor
          value={value}
          onChange={onChange}
          onImageUpload={onImageUpload}
          readOnly={readOnly}
          placeholder={placeholder}
          theme={theme}
        />
      </MilkdownProvider>
    </div>
  )
}

export default MDEditor