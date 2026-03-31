import { useEffect } from 'react'
import { useState } from 'react'
import { TriLayout } from '@/components/TriLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotebookList } from '@/components/NotebookList'
import { SearchPanel } from '@/components/SearchPanel'
import { TagPanel } from '@/components/TagPanel'
import { MainContent } from '@/components/MainContent'
import { useNotebookStore, useTagStore } from '@/store'
import { FileText, Search, Tag, Settings } from 'lucide-react'

function App() {
  const [activeId, setActiveId] = useState('notebooks')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0.2)

  const { fetchNotebooks } = useNotebookStore()
  const { fetchTags } = useTagStore()

  useEffect(() => {
    fetchNotebooks()
    fetchTags()
  }, [fetchNotebooks, fetchTags])

  const activityItems = [
    { id: 'notebooks', icon: <FileText />, title: '笔记本' },
    { id: 'search', icon: <Search />, title: '搜索' },
    { id: 'tags', icon: <Tag />, title: '标签' },
    { id: 'settings', icon: <Settings />, title: '设置', hasSidebar: false },
  ]

  const handleActivityChange = (id: string) => {
    const item = activityItems.find(i => i.id === id)
    
    if (item?.hasSidebar === false) {
      setActiveId(id)
      setSidebarCollapsed(true)
      return
    }

    if (id === activeId) {
      setSidebarCollapsed(!sidebarCollapsed)
    } else {
      setActiveId(id)
      setSidebarCollapsed(false)
    }
  }

  const renderSidebarContent = () => {
    switch (activeId) {
      case 'notebooks':
        return <NotebookList />
      case 'search':
        return <SearchPanel />
      case 'tags':
        return <TagPanel />
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <TriLayout className="h-screen">
        <TriLayout.ActivityBar
          items={activityItems}
          activeId={activeId}
          onChange={handleActivityChange}
        />

        <TriLayout.Sidebar
          width={sidebarWidth}
          collapsed={sidebarCollapsed}
          onWidthChange={setSidebarWidth}
        >
          {renderSidebarContent()}
        </TriLayout.Sidebar>

        <TriLayout.Content>
          <MainContent />
        </TriLayout.Content>
      </TriLayout>
    </TooltipProvider>
  )
}

export default App