import React, { useEffect, useRef, useCallback } from 'react'
import { filterLanguages } from './languages'

interface CodeLanguageMenuProps {
  visible: boolean
  position: { top: number; left: number }
  query: string
  selectedIndex: number
  onSelect: (language: string) => void
  onClose: () => void
  onQueryChange: (query: string) => void
}

export const CodeLanguageMenu: React.FC<CodeLanguageMenuProps> = ({
  visible,
  position,
  query,
  selectedIndex,
  onSelect,
  onClose,
  onQueryChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredLanguages = filterLanguages(query)

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [visible])

  useEffect(() => {
    if (listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value)
  }, [onQueryChange])

  const handleItemClick = useCallback((language: string) => {
    onSelect(language)
  }, [onSelect])

  if (!visible) return null

  return (
    <div
      className="code-language-menu"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className="code-language-menu-input"
        placeholder="Search language..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
          } else if (e.key === 'Enter' && filteredLanguages.length > 0) {
            e.preventDefault()
            onSelect(filteredLanguages[selectedIndex].name)
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
          }
        }}
      />
      <div ref={listRef} className="code-language-menu-list">
        {filteredLanguages.length === 0 ? (
          <div className="code-language-menu-empty">No languages found</div>
        ) : (
          filteredLanguages.map((lang, index) => (
            <div
              key={lang.name}
              className={`code-language-menu-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleItemClick(lang.name)}
            >
              <span className="code-language-menu-item-name">{lang.name}</span>
              {lang.aliases.length > 0 && (
                <span className="code-language-menu-item-aliases">
                  {lang.aliases.join(', ')}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}