import { NoteList } from '@/components/NoteList'
import { NoteEditor } from '@/components/NoteEditor'

export function MainContent() {
  return (
    <div className="flex h-full">
      <div className="w-64 border-r bg-white flex flex-col">
        <NoteList />
      </div>
      <div className="flex-1 bg-white">
        <NoteEditor />
      </div>
    </div>
  )
}