import { useEffect, useState } from 'react'
import { Editor } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { useEditor } from '@milkdown/react'

export interface UseMilkdownEditorOptions {
  value: string
  onChange: (value: string) => void
}

export const useMilkdownEditor = (options: UseMilkdownEditorOptions) => {
  const { value, onChange } = options
  const [isReady, setIsReady] = useState(false)

  const { get } = useEditor(() =>
    Editor.make()
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          if (markdown !== value) {
            onChange(markdown)
          }
        })
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history),
  )

  useEffect(() => {
    if (get()) {
      setIsReady(true)
    }
  }, [get])

  return {
    get,
    isReady,
  }
}