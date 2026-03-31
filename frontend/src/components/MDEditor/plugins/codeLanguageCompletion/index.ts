import { $prose } from '@milkdown/utils'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import type { EditorView } from '@milkdown/prose/view'
import type { CompletionState } from './types'

export const codeLanguageCompletionKey = new PluginKey('codeLanguageCompletion')

export interface CodeLanguageCompletionOptions {
  onSelectLanguage?: (language: string) => void
}

export function createCodeLanguageCompletionPlugin(
  _options: CodeLanguageCompletionOptions = {}
) {
  return $prose(() => 
    new Plugin({
      key: codeLanguageCompletionKey,
      state: {
        init: (): CompletionState => ({
          active: false,
          pos: 0,
          query: '',
          selectedIndex: 0,
        }),
        apply: (tr, prevState): CompletionState => {
          const meta = tr.getMeta('codeBlockLanguageCompletion')
          if (meta?.type === 'trigger') {
            return {
              active: true,
              pos: meta.from,
              query: '',
              selectedIndex: 0,
            }
          }
          if (meta?.type === 'select') {
            return {
              ...prevState,
              active: false,
            }
          }
          if (meta?.type === 'close') {
            return {
              ...prevState,
              active: false,
            }
          }
          if (meta?.type === 'updateQuery') {
            const filteredCount = meta.filteredCount || 0
            return {
              ...prevState,
              query: meta.query,
              selectedIndex: Math.min(prevState.selectedIndex, Math.max(0, filteredCount - 1)),
            }
          }
          if (meta?.type === 'moveSelection') {
            return {
              ...prevState,
              selectedIndex: meta.selectedIndex,
            }
          }
          return prevState
        },
      },
      props: {
        handleTextInput: (view: EditorView, from: number, _to: number, text: string): boolean => {
          const currentState = codeLanguageCompletionKey.getState(view.state)
          if (currentState?.active) return false
          
          if (text !== '`') return false
          
          const state = view.state
          const $from = state.doc.resolve(from)
          const lineText = state.doc.textBetween(
            Math.max(0, $from.start() - 1),
            from,
            undefined,
            ''
          )
          
          const match = lineText.match(/``$/)
          if (match) {
            const startPos = from - 2
            view.dispatch(
              state.tr.setMeta('codeBlockLanguageCompletion', {
                type: 'trigger',
                from: startPos,
                to: from + 1,
              })
            )
          }
          
          return false
        },
        handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
          const currentState = codeLanguageCompletionKey.getState(view.state)
          if (!currentState?.active) return false

          if (event.key === 'Escape') {
            view.dispatch(
              view.state.tr.setMeta('codeBlockLanguageCompletion', { type: 'close' })
            )
            return true
          }
          return false
        },
        handleClick: (view: EditorView): boolean => {
          const currentState = codeLanguageCompletionKey.getState(view.state)
          if (currentState?.active) {
            view.dispatch(
              view.state.tr.setMeta('codeBlockLanguageCompletion', { type: 'close' })
            )
            return true
          }
          return false
        },
      },
    })
  )
}

export { CodeLanguageMenu } from './CodeLanguageMenu'
export { supportedLanguages, filterLanguages } from './languages'
export type { CompletionState, CodeLanguageMenuProps } from './types'