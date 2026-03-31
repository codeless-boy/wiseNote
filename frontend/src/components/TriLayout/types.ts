// src/components/TriLayout/types.ts
import type { ReactNode } from 'react'

// ==================== 活动栏 ====================

export interface ActivityBarItem {
  id: string
  icon: ReactNode
  title?: string
  badge?: number | string
  hasSidebar?: boolean
}

export interface ActivityBarProps {
  items: ActivityBarItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

// ==================== 侧边栏 ====================

export interface SidebarProps {
  width: number
  onWidthChange?: (width: number) => void
  children: ReactNode
  className?: string
  minWidth?: number
  maxWidth?: number
  collapsed?: boolean
}

// ==================== 内容区 ====================

export interface ContentProps {
  children: ReactNode
  className?: string
}

// ==================== 主容器 ====================

export interface TriLayoutProps {
  children: ReactNode
  className?: string
}