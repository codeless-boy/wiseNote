import { useEffect, useRef } from 'react'
import { useSearchStore, useNoteStore } from '@/store'
import { Search, FileText } from 'lucide-react'

export function SearchPanel() {
  const { query, results, setQuery, search } = useSearchStore()
  const { setCurrentNote } = useNoteStore()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      if (query.trim()) {
        search()
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, search])

  const handleResultClick = (noteId: string) => {
    const note = results.find(n => n.id === noteId)
    if (note) {
      setCurrentNote(note)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full pl-8 pr-2 py-1 text-sm border rounded outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {results.length === 0 && query.trim() && (
          <div className="p-4 text-center text-gray-400 text-sm">
            未找到匹配的笔记
          </div>
        )}
        {results.map(note => (
          <div
            key={note.id}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleResultClick(note.id)}
          >
            <FileText size={14} className="text-gray-400" />
            <span className="text-sm truncate">{note.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}