export interface LanguageInfo {
  name: string
  aliases: string[]
}

export interface CompletionState {
  active: boolean
  pos: number
  query: string
  selectedIndex: number
}

export interface CodeLanguageMenuProps {
  visible: boolean
  position: { top: number; left: number }
  query: string
  selectedIndex: number
  onSelect: (language: string) => void
  onClose: () => void
  onQueryChange: (query: string) => void
  onKeyDown?: (e: KeyboardEvent) => void
}