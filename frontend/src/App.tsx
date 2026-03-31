import { useState } from 'react'
import { TriLayout } from '@/components/TriLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FileText, Search, Tag, Settings } from 'lucide-react'

function App() {
  const [activeId, setActiveId] = useState('notebooks')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0.2)

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
        return <div className="p-4">笔记本列表</div>
      case 'search':
        return <div className="p-4">搜索面板</div>
      case 'tags':
        return <div className="p-4">标签管理</div>
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
          <div className="flex h-full">
            <div className="w-64 border-r bg-white">
              <div className="p-4 border-b font-medium">笔记列表</div>
            </div>
            <div className="flex-1 bg-white">
              <div className="p-4 border-b font-medium">笔记编辑器</div>
            </div>
          </div>
        </TriLayout.Content>
      </TriLayout>
    </TooltipProvider>
  )
}

export default App