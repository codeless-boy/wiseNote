export interface MDEditorProps {
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
  readOnly?: boolean
  className?: string
  theme?: 'light' | 'dark'
}

export interface ToolbarAction {
  icon: React.ReactNode
  label: string
  action: () => void
  isActive?: () => boolean
}

export type EditorTheme = 'light' | 'dark'