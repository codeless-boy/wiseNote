# 个人知识管理软件前端实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 构建一个功能完整的个人知识管理软件前端应用，支持笔记本/笔记管理、富文本编辑、搜索、标签、链接、版本历史和导出功能。

**架构:** 采用三栏式 IDE 风格布局，使用 tri-layout 组件实现左侧活动栏和侧边栏、中间笔记列表、右侧编辑器。数据层使用 IndexedDB 本地存储，状态管理使用 Zustand，编辑器使用 Milkdown 富文本编辑器。

**技术栈:** React 18 + TypeScript + Tailwind CSS + shadcn/ui + IndexedDB + Zustand + Milkdown

---

## 阶段一：项目初始化

### Task 1: 创建前端项目结构

**文件:**
- 创建: `frontend/package.json`
- 创建: `frontend/tsconfig.json`
- 创建: `frontend/tsconfig.node.json`
- 创建: `frontend/vite.config.ts`
- 创建: `frontend/postcss.config.js`
- 创建: `frontend/tailwind.config.js`
- 创建: `frontend/index.html`
- 创建: `frontend/src/main.tsx`
- 创建: `frontend/src/App.tsx`
- 创建: `frontend/src/index.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "wiseNote",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@milkdown/core": "^7.20.0",
    "@milkdown/ctx": "^7.20.0",
    "@milkdown/plugin-history": "^7.20.0",
    "@milkdown/plugin-listener": "^7.20.0",
    "@milkdown/plugin-prism": "^7.20.0",
    "@milkdown/preset-commonmark": "^7.20.0",
    "@milkdown/preset-gfm": "^7.20.0",
    "@milkdown/react": "^7.20.0",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "idb": "^8.0.0",
    "lucide-react": "^1.7.0",
    "prismjs": "^1.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^3.5.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.4.19",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 7: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/note.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WiseNote - 个人知识管理</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: 创建 public/note.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <line x1="10" y1="9" x2="8" y2="9"/>
</svg>
```

- [ ] **Step 9: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 10: 创建 src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 11: 创建 src/App.tsx**

```tsx
function App() {
  return (
    <div className="h-screen bg-gray-50">
      <h1>WiseNote</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 12: 安装依赖**

```bash
cd frontend && npm install
```

- [ ] **Step 13: 验证项目可以启动**

```bash
cd frontend && npm run dev
```

预期: 浏览器访问 http://localhost:5173 显示 "WiseNote"

- [ ] **Step 14: 提交代码**

```bash
git add frontend/
git commit -m "feat: 初始化前端项目结构"
```

---

## 阶段二：集成布局和编辑器组件

### Task 2: 复制 TriLayout 组件

**文件:**
- 复制: `tri-layout/src/components/TriLayout/*` → `frontend/src/components/TriLayout/`
- 复制: `tri-layout/src/components/ui/*` → `frontend/src/components/ui/`
- 复制: `tri-layout/src/lib/utils.ts` → `frontend/src/lib/utils.ts`

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p frontend/src/components/TriLayout
mkdir -p frontend/src/components/ui
mkdir -p frontend/src/lib
```

- [ ] **Step 2: 复制 TriLayout 组件文件**

```bash
cp tri-layout/src/components/TriLayout/* frontend/src/components/TriLayout/
```

- [ ] **Step 3: 复制 shadcn/ui 组件**

```bash
cp tri-layout/src/components/ui/* frontend/src/components/ui/
```

- [ ] **Step 4: 复制工具函数**

```bash
cp tri-layout/src/lib/utils.ts frontend/src/lib/utils.ts
```

- [ ] **Step 5: 创建 src/components/ui/index.ts 导出文件**

```typescript
export { Button } from './button'
export { ScrollArea } from './scroll-area'
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip'
```

- [ ] **Step 6: 提交代码**

```bash
git add frontend/src/components/ frontend/src/lib/
git commit -m "feat: 复制 TriLayout 组件和 shadcn/ui 组件"
```

### Task 3: 复制 MDEditor 编辑器组件

**文件:**
- 复制: `editor/src/MDEditor/*` → `frontend/src/components/MDEditor/`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p frontend/src/components/MDEditor
```

- [ ] **Step 2: 复制 MDEditor 组件文件**

```bash
cp -r editor/src/MDEditor/* frontend/src/components/MDEditor/
```

- [ ] **Step 3: 复制编辑器样式**

复制 `editor/src/MDEditor/styles/editor.css` 内容到 `frontend/src/components/MDEditor/styles/editor.css`

- [ ] **Step 4: 提交代码**

```bash
git add frontend/src/components/MDEditor/
git commit -m "feat: 复制 MDEditor 富文本编辑器组件"
```

### Task 4: 创建基础布局页面

**文件:**
- 修改: `frontend/src/App.tsx`

- [ ] **Step 1: 重写 App.tsx 使用 TriLayout**

```tsx
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
```

- [ ] **Step 2: 验证布局效果**

```bash
cd frontend && npm run dev
```

预期: 浏览器显示三栏布局，左侧活动栏可切换

- [ ] **Step 3: 提交代码**

```bash
git add frontend/src/App.tsx
git commit -m "feat: 创建基础三栏布局页面"
```

---

## 阶段三：数据层搭建

### Task 5: 创建数据模型和类型定义

**文件:**
- 创建: `frontend/src/types/index.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
export interface Notebook {
  id: string
  name: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  notebookId: string
  tags: string[]
  links: string[]
  createdAt: number
  updatedAt: number
}

export interface NoteVersion {
  id: string
  noteId: string
  content: string
  savedAt: number
}

export interface Tag {
  id: string
  name: string
  color: string | null
  createdAt: number
}
```

- [ ] **Step 2: 提交代码**

```bash
git add frontend/src/types/
git commit -m "feat: 添加数据模型类型定义"
```

### Task 6: 创建 IndexedDB 数据库层

**文件:**
- 创建: `frontend/src/db/index.ts`
- 创建: `frontend/src/db/notebooks.ts`
- 创建: `frontend/src/db/notes.ts`
- 创建: `frontend/src/db/tags.ts`
- 创建: `frontend/src/db/versions.ts`

- [ ] **Step 1: 创建 src/db/index.ts 数据库初始化**

```typescript
import { openDB, IDBPDatabase } from 'idb'
import type { Notebook, Note, NoteVersion, Tag } from '@/types'

const DB_NAME = 'wiseNote'
const DB_VERSION = 1

export interface WiseNoteDB {
  notebooks: IDBPDatabase<{
    notebooks: { key: string; value: Notebook; indexes: { 'by-parent': string } }
    notes: { key: string; value: Note; indexes: { 'by-notebook': string; 'by-tags': string } }
    versions: { key: string; value: NoteVersion; indexes: { 'by-note': string } }
    tags: { key: string; value: Tag }
  }>
}

let dbInstance: WiseNoteDB['notebooks'] | null = null

export async function getDB(): Promise<WiseNoteDB['notebooks']> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Notebooks store
      if (!db.objectStoreNames.contains('notebooks')) {
        const notebookStore = db.createObjectStore('notebooks', { keyPath: 'id' })
        notebookStore.createIndex('by-parent', 'parentId')
      }

      // Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' })
        noteStore.createIndex('by-notebook', 'notebookId')
        noteStore.createIndex('by-tags', 'tags', { multiEntry: true })
      }

      // Versions store
      if (!db.objectStoreNames.contains('versions')) {
        const versionStore = db.createObjectStore('versions', { keyPath: 'id' })
        versionStore.createIndex('by-note', 'noteId')
      }

      // Tags store
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' })
      }
    },
  })

  return dbInstance
}
```

- [ ] **Step 2: 创建 src/db/notebooks.ts 笔记本数据操作**

```typescript
import { getDB } from './index'
import type { Notebook } from '@/types'

export async function createNotebook(notebook: Notebook): Promise<Notebook> {
  const db = await getDB()
  await db.add('notebooks', notebook)
  return notebook
}

export async function getNotebook(id: string): Promise<Notebook | undefined> {
  const db = await getDB()
  return db.get('notebooks', id)
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  const db = await getDB()
  return db.getAll('notebooks')
}

export async function getNotebooksByParent(parentId: string | null): Promise<Notebook[]> {
  const db = await getDB()
  const all = await db.getAll('notebooks')
  return all.filter(n => n.parentId === parentId)
}

export async function updateNotebook(notebook: Notebook): Promise<Notebook> {
  const db = await getDB()
  await db.put('notebooks', { ...notebook, updatedAt: Date.now() })
  return notebook
}

export async function deleteNotebook(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notebooks', id)
}
```

- [ ] **Step 3: 创建 src/db/notes.ts 笔记数据操作**

```typescript
import { getDB } from './index'
import type { Note } from '@/types'

export async function createNote(note: Note): Promise<Note> {
  const db = await getDB()
  await db.add('notes', note)
  return note
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await getDB()
  return db.get('notes', id)
}

export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-notebook', notebookId)
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB()
  return db.getAll('notes')
}

export async function updateNote(note: Note): Promise<Note> {
  const db = await getDB()
  const updated = { ...note, updatedAt: Date.now() }
  await db.put('notes', updated)
  return updated
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notes', id)
}

export async function searchNotes(query: string): Promise<Note[]> {
  const db = await getDB()
  const all = await db.getAll('notes')
  const lowerQuery = query.toLowerCase()
  return all.filter(n => 
    n.title.toLowerCase().includes(lowerQuery) ||
    n.content.toLowerCase().includes(lowerQuery)
  )
}

export async function getNotesByTag(tagId: string): Promise<Note[]> {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-tags', tagId)
}
```

- [ ] **Step 4: 创建 src/db/tags.ts 标签数据操作**

```typescript
import { getDB } from './index'
import type { Tag } from '@/types'

export async function createTag(tag: Tag): Promise<Tag> {
  const db = await getDB()
  await db.add('tags', tag)
  return tag
}

export async function getTag(id: string): Promise<Tag | undefined> {
  const db = await getDB()
  return db.get('tags', id)
}

export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB()
  return db.getAll('tags')
}

export async function updateTag(tag: Tag): Promise<Tag> {
  const db = await getDB()
  await db.put('tags', tag)
  return tag
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('tags', id)
}
```

- [ ] **Step 5: 创建 src/db/versions.ts 版本历史数据操作**

```typescript
import { getDB } from './index'
import type { NoteVersion } from '@/types'

export async function createVersion(version: NoteVersion): Promise<NoteVersion> {
  const db = await getDB()
  await db.add('versions', version)
  return version
}

export async function getVersionsByNote(noteId: string): Promise<NoteVersion[]> {
  const db = await getDB()
  return db.getAllFromIndex('versions', 'by-note', noteId)
}

export async function getVersion(id: string): Promise<NoteVersion | undefined> {
  const db = await getDB()
  return db.get('versions', id)
}

export async function deleteVersion(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('versions', id)
}

export async function deleteVersionsByNote(noteId: string): Promise<void> {
  const db = await getDB()
  const versions = await getVersionsByNote(noteId)
  const tx = db.transaction('versions', 'readwrite')
  await Promise.all(versions.map(v => tx.store.delete(v.id)))
  await tx.done
}
```

- [ ] **Step 6: 提交代码**

```bash
git add frontend/src/db/
git commit -m "feat: 创建 IndexedDB 数据库层和 CRUD 操作"
```

---

## 阶段四：状态管理

### Task 7: 创建 Zustand 状态管理 stores

**文件:**
- 创建: `frontend/src/store/notebookStore.ts`
- 创建: `frontend/src/store/noteStore.ts`
- 创建: `frontend/src/store/tagStore.ts`
- 创建: `frontend/src/store/searchStore.ts`
- 创建: `frontend/src/store/index.ts`

- [ ] **Step 1: 创建 src/store/notebookStore.ts**

```typescript
import { create } from 'zustand'
import type { Notebook } from '@/types'
import * as db from '@/db/notebooks'

interface NotebookState {
  notebooks: Notebook[]
  currentNotebookId: string | null
  loading: boolean
  
  fetchNotebooks: () => Promise<void>
  createNotebook: (name: string, parentId?: string | null) => Promise<Notebook>
  updateNotebook: (id: string, name: string) => Promise<void>
  deleteNotebook: (id: string) => Promise<void>
  setCurrentNotebook: (id: string | null) => void
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  notebooks: [],
  currentNotebookId: null,
  loading: false,

  fetchNotebooks: async () => {
    set({ loading: true })
    const notebooks = await db.getAllNotebooks()
    set({ notebooks, loading: false })
  },

  createNotebook: async (name, parentId = null) => {
    const notebook: Notebook = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await db.createNotebook(notebook)
    set({ notebooks: [...get().notebooks, notebook] })
    return notebook
  },

  updateNotebook: async (id, name) => {
    const notebook = get().notebooks.find(n => n.id === id)
    if (!notebook) return
    const updated = { ...notebook, name, updatedAt: Date.now() }
    await db.updateNotebook(updated)
    set({
      notebooks: get().notebooks.map(n => n.id === id ? updated : n)
    })
  },

  deleteNotebook: async (id) => {
    await db.deleteNotebook(id)
    set({
      notebooks: get().notebooks.filter(n => n.id !== id),
      currentNotebookId: get().currentNotebookId === id ? null : get().currentNotebookId
    })
  },

  setCurrentNotebook: (id) => {
    set({ currentNotebookId: id })
  },
}))
```

- [ ] **Step 2: 创建 src/store/noteStore.ts**

```typescript
import { create } from 'zustand'
import type { Note, NoteVersion } from '@/types'
import * as db from '@/db/notes'
import * as dbVersions from '@/db/versions'

interface NoteState {
  notes: Note[]
  currentNote: Note | null
  versions: NoteVersion[]
  loading: boolean
  
  fetchNotes: (notebookId: string) => Promise<void>
  createNote: (notebookId: string) => Promise<Note>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setCurrentNote: (note: Note | null) => void
  saveVersion: (noteId: string, content: string) => Promise<void>
  fetchVersions: (noteId: string) => Promise<void>
  restoreVersion: (noteId: string, versionId: string) => Promise<void>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  versions: [],
  loading: false,

  fetchNotes: async (notebookId) => {
    set({ loading: true })
    const notes = await db.getNotesByNotebook(notebookId)
    set({ notes, loading: false })
  },

  createNote: async (notebookId) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: '无标题',
      content: '',
      notebookId,
      tags: [],
      links: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await db.createNote(note)
    set({ notes: [...get().notes, note], currentNote: note })
    return note
  },

  updateNote: async (id, updates) => {
    const note = get().notes.find(n => n.id === id)
    if (!note) return
    const updated = { ...note, ...updates, updatedAt: Date.now() }
    await db.updateNote(updated)
    set({
      notes: get().notes.map(n => n.id === id ? updated : n),
      currentNote: get().currentNote?.id === id ? updated : get().currentNote
    })
  },

  deleteNote: async (id) => {
    await db.deleteNote(id)
    await dbVersions.deleteVersionsByNote(id)
    set({
      notes: get().notes.filter(n => n.id !== id),
      currentNote: get().currentNote?.id === id ? null : get().currentNote
    })
  },

  setCurrentNote: (note) => {
    set({ currentNote: note })
  },

  saveVersion: async (noteId, content) => {
    const version: NoteVersion = {
      id: crypto.randomUUID(),
      noteId,
      content,
      savedAt: Date.now(),
    }
    await dbVersions.createVersion(version)
    set({ versions: [...get().versions, version] })
  },

  fetchVersions: async (noteId) => {
    const versions = await dbVersions.getVersionsByNote(noteId)
    set({ versions })
  },

  restoreVersion: async (noteId, versionId) => {
    const version = await dbVersions.getVersion(versionId)
    if (!version) return
    await get().updateNote(noteId, { content: version.content })
  },
}))
```

- [ ] **Step 3: 创建 src/store/tagStore.ts**

```typescript
import { create } from 'zustand'
import type { Tag } from '@/types'
import * as db from '@/db/tags'

interface TagState {
  tags: Tag[]
  loading: boolean
  
  fetchTags: () => Promise<void>
  createTag: (name: string, color?: string) => Promise<Tag>
  updateTag: (id: string, name: string, color?: string) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true })
    const tags = await db.getAllTags()
    set({ tags, loading: false })
  },

  createTag: async (name, color = null) => {
    const tag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now(),
    }
    await db.createTag(tag)
    set({ tags: [...get().tags, tag] })
    return tag
  },

  updateTag: async (id, name, color) => {
    const tag = get().tags.find(t => t.id === id)
    if (!tag) return
    const updated = { ...tag, name, color }
    await db.updateTag(updated)
    set({
      tags: get().tags.map(t => t.id === id ? updated : t)
    })
  },

  deleteTag: async (id) => {
    await db.deleteTag(id)
    set({ tags: get().tags.filter(t => t.id !== id) })
  },
}))
```

- [ ] **Step 4: 创建 src/store/searchStore.ts**

```typescript
import { create } from 'zustand'
import type { Note } from '@/types'
import * as db from '@/db/notes'

interface SearchState {
  query: string
  results: Note[]
  loading: boolean
  
  setQuery: (query: string) => void
  search: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  loading: false,

  setQuery: (query) => {
    set({ query })
  },

  search: async () => {
    const { query } = get()
    if (!query.trim()) {
      set({ results: [] })
      return
    }
    set({ loading: true })
    const results = await db.searchNotes(query)
    set({ results, loading: false })
  },
}))
```

- [ ] **Step 5: 创建 src/store/index.ts 导出文件**

```typescript
export { useNotebookStore } from './notebookStore'
export { useNoteStore } from './noteStore'
export { useTagStore } from './tagStore'
export { useSearchStore } from './searchStore'
```

- [ ] **Step 6: 提交代码**

```bash
git add frontend/src/store/
git commit -m "feat: 创建 Zustand 状态管理 stores"
```

---

## 阶段五：界面组件开发

### Task 8: 创建笔记本列表组件

**文件:**
- 创建: `frontend/src/components/NotebookList/index.tsx`
- 创建: `frontend/src/components/NotebookList/NotebookItem.tsx`

- [ ] **Step 1: 创建 src/components/NotebookList/index.tsx**

```tsx
import { useState } from 'react'
import { useNotebookStore } from '@/store'
import { NotebookItem } from './NotebookItem'
import { ChevronRight, ChevronDown, Plus, Folder } from 'lucide-react'
import type { Notebook } from '@/types'

export function NotebookList() {
  const { notebooks, currentNotebookId, fetchNotebooks, createNotebook, setCurrentNotebook } = useNotebookStore()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const handleToggle = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const handleCreate = async () => {
    await createNotebook('新建笔记本')
  }

  const getRootNotebooks = () => {
    return notebooks.filter(n => n.parentId === null)
  }

  const getChildNotebooks = (parentId: string) => {
    return notebooks.filter(n => n.parentId === parentId)
  }

  const renderNotebook = (notebook: Notebook, level: number = 0) => {
    const children = getChildNotebooks(notebook.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(notebook.id)
    const isSelected = currentNotebookId === notebook.id

    return (
      <div key={notebook.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setCurrentNotebook(notebook.id)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); handleToggle(notebook.id) }}>
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <Folder size={14} className="text-gray-500" />
          <span className="text-sm truncate">{notebook.name}</span>
        </div>
        {isExpanded && children.map(child => renderNotebook(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">笔记本</span>
        <button onClick={handleCreate} className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {getRootNotebooks().map(notebook => renderNotebook(notebook))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 src/components/NotebookList/NotebookItem.tsx**

```tsx
import { useState } from 'react'
import type { Notebook } from '@/types'

interface NotebookItemProps {
  notebook: Notebook
  isSelected: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

export function NotebookItem({
  notebook,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: NotebookItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(notebook.name)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditName(notebook.name)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (editName.trim() && editName !== notebook.name) {
      onRename(editName.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditName(notebook.name)
    }
  }

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 cursor-pointer ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'
      }`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm outline-none border border-blue-500 px-1"
          autoFocus
        />
      ) : (
        <span className="text-sm truncate flex-1">{notebook.name}</span>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 提交代码**

```bash
git add frontend/src/components/NotebookList/
git commit -m "feat: 创建笔记本列表组件"
```

### Task 9: 创建笔记列表组件

**文件:**
- 创建: `frontend/src/components/NoteList/index.tsx`

- [ ] **Step 1: 创建 src/components/NoteList/index.tsx**

```tsx
import { useEffect } from 'react'
import { useNoteStore, useNotebookStore } from '@/store'
import { Plus, FileText } from 'lucide-react'

export function NoteList() {
  const { currentNotebookId } = useNotebookStore()
  const { notes, currentNote, fetchNotes, createNote, setCurrentNote } = useNoteStore()

  useEffect(() => {
    if (currentNotebookId) {
      fetchNotes(currentNotebookId)
    }
  }, [currentNotebookId, fetchNotes])

  const handleCreate = async () => {
    if (!currentNotebookId) return
    await createNote(currentNotebookId)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!currentNotebookId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        请选择一个笔记本
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">笔记列表</span>
        <button onClick={handleCreate} className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            暂无笔记，点击 + 创建
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`flex flex-col gap-1 px-3 py-2 cursor-pointer border-b ${
                currentNote?.id === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentNote(note)}
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <span className="text-sm font-medium truncate">{note.title}</span>
              </div>
              <div className="text-xs text-gray-400 ml-5">
                {formatDate(note.updatedAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交代码**

```bash
git add frontend/src/components/NoteList/
git commit -m "feat: 创建笔记列表组件"
```

### Task 10: 创建笔记编辑器组件

**文件:**
- 创建: `frontend/src/components/NoteEditor/index.tsx`

- [ ] **Step 1: 创建 src/components/NoteEditor/index.tsx**

```tsx
import { useState, useEffect, useCallback } from 'react'
import { useNoteStore } from '@/store'
import { MDEditor } from '@/components/MDEditor'

export function NoteEditor() {
  const { currentNote, updateNote } = useNoteStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
    }
  }, [currentNote?.id])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    scheduleSave()
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    scheduleSave()
  }

  const scheduleSave = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    const timeout = setTimeout(() => {
      if (currentNote) {
        updateNote(currentNote.id, { title, content })
      }
    }, 500)
    setSaveTimeout(timeout)
  }, [currentNote, title, content, updateNote])

  if (!currentNote) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        请选择一篇笔记
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="无标题"
          className="w-full text-lg font-medium outline-none"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          theme="light"
          placeholder="开始输入..."
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交代码**

```bash
git add frontend/src/components/NoteEditor/
git commit -m "feat: 创建笔记编辑器组件"
```

### Task 11: 创建搜索面板组件

**文件:**
- 创建: `frontend/src/components/SearchPanel/index.tsx`

- [ ] **Step 1: 创建 src/components/SearchPanel/index.tsx**

```tsx
import { useEffect, useState } from 'react'
import { useSearchStore, useNoteStore } from '@/store'
import { Search, FileText } from 'lucide-react'

export function SearchPanel() {
  const { query, results, setQuery, search } = useSearchStore()
  const { setCurrentNote } = useNoteStore()
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    const timer = setTimeout(() => {
      if (query.trim()) {
        search()
      }
    }, 300)
    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
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
```

- [ ] **Step 2: 提交代码**

```bash
git add frontend/src/components/SearchPanel/
git commit -m "feat: 创建搜索面板组件"
```

### Task 12: 创建标签面板组件

**文件:**
- 创建: `frontend/src/components/TagPanel/index.tsx`

- [ ] **Step 1: 创建 src/components/TagPanel/index.tsx**

```tsx
import { useEffect, useState } from 'react'
import { useTagStore, useNoteStore } from '@/store'
import { Plus, Tag as TagIcon } from 'lucide-react'

export function TagPanel() {
  const { tags, fetchTags, createTag } = useTagStore()
  const { setCurrentNote } = useNoteStore()
  const [newTagName, setNewTagName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const handleCreate = async () => {
    if (!newTagName.trim()) return
    await createTag(newTagName.trim())
    setNewTagName('')
    setIsCreating(false)
  }

  const handleTagClick = (tagId: string) => {
    // TODO: Navigate to notes filtered by tag
    console.log('Filter by tag:', tagId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <span className="font-medium text-sm">标签</span>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {isCreating && (
        <div className="px-2 py-2 border-b">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            onBlur={handleCreate}
            placeholder="输入标签名称"
            className="w-full px-2 py-1 text-sm border rounded outline-none focus:border-blue-500"
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {tags.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            暂无标签，点击 + 创建
          </div>
        ) : (
          tags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleTagClick(tag.id)}
            >
              <TagIcon size={14} style={{ color: tag.color || '#6366f1' }} />
              <span className="text-sm">{tag.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交代码**

```bash
git add frontend/src/components/TagPanel/
git commit -m "feat: 创建标签面板组件"
```

---

## 阶段六：整合所有组件

### Task 13: 更新 App.tsx 整合所有组件

**文件:**
- 修改: `frontend/src/App.tsx`
- 创建: `frontend/src/components/MainContent/index.tsx`

- [ ] **Step 1: 创建 src/components/MainContent/index.tsx 主内容区组件**

```tsx
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
```

- [ ] **Step 2: 重写 src/App.tsx 整合所有组件**

```tsx
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
```

- [ ] **Step 3: 验证应用启动**

```bash
cd frontend && npm run dev
```

预期: 浏览器显示完整的三栏布局，可以切换笔记本/搜索/标签面板

- [ ] **Step 4: 提交代码**

```bash
git add frontend/src/App.tsx frontend/src/components/MainContent/
git commit -m "feat: 整合所有组件到主应用"
```

---

## 阶段七：优化和修复

### Task 14: 添加初始化演示数据

**文件:**
- 创建: `frontend/src/db/seed.ts`

- [ ] **Step 1: 创建 src/db/seed.ts 演示数据种子**

```typescript
import type { Notebook, Note, Tag } from '@/types'
import { createNotebook } from './notebooks'
import { createNote } from './notes'
import { createTag } from './tags'

export async function seedDemoData() {
  // Check if data already exists
  const notebooks = await (await import('./notebooks')).getAllNotebooks()
  if (notebooks.length > 0) return

  // Create demo notebooks
  const notebook1: Notebook = {
    id: crypto.randomUUID(),
    name: '工作笔记',
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await createNotebook(notebook1)

  const notebook2: Notebook = {
    id: crypto.randomUUID(),
    name: '学习笔记',
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await createNotebook(notebook2)

  // Create demo notes
  const note1: Note = {
    id: crypto.randomUUID(),
    title: '欢迎使用 WiseNote',
    content: `# 欢迎

这是一个简单的知识管理软件。

## 功能

- 创建笔记本和笔记
- 富文本编辑
- 搜索笔记
- 标签管理

开始使用吧！`,
    notebookId: notebook1.id,
    tags: [],
    links: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await createNote(note1)

  const note2: Note = {
    id: crypto.randomUUID(),
    title: 'Markdown 语法示例',
    content: `# Markdown 示例

## 文本格式

**粗体** 和 *斜体* 和 ~~删除线~~

## 列表

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

## 代码

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

## 链接

[点击这里](https://example.com)`,
    notebookId: notebook2.id,
    tags: [],
    links: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await createNote(note2)

  // Create demo tags
  const tag1: Tag = {
    id: crypto.randomUUID(),
    name: '重要',
    color: '#ef4444',
    createdAt: Date.now(),
  }
  await createTag(tag1)

  const tag2: Tag = {
    id: crypto.randomUUID(),
    name: '待办',
    color: '#3b82f6',
    createdAt: Date.now(),
  }
  await createTag(tag2)
}
```

- [ ] **Step 2: 修改 App.tsx 调用种子函数**

在 App.tsx 中添加种子数据初始化：

```tsx
import { useEffect } from 'react'
import { useState } from 'react'
import { TriLayout } from '@/components/TriLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotebookList } from '@/components/NotebookList'
import { SearchPanel } from '@/components/SearchPanel'
import { TagPanel } from '@/components/TagPanel'
import { MainContent } from '@/components/MainContent'
import { useNotebookStore, useTagStore } from '@/store'
import { seedDemoData } from '@/db/seed'
import { FileText, Search, Tag, Settings } from 'lucide-react'

function App() {
  const [activeId, setActiveId] = useState('notebooks')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0.2)

  const { fetchNotebooks } = useNotebookStore()
  const { fetchTags } = useTagStore()

  useEffect(() => {
    seedDemoData().then(() => {
      fetchNotebooks()
      fetchTags()
    })
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
```

- [ ] **Step 3: 验证应用运行**

```bash
cd frontend && npm run dev
```

预期: 应用显示演示数据，可以创建和编辑笔记

- [ ] **Step 4: 提交代码**

```bash
git add frontend/src/db/seed.ts frontend/src/App.tsx
git commit -m "feat: 添加初始化演示数据"
```

---

## 总结

完成以上所有任务后，运行最终构建命令验证：

```bash
cd frontend && npm run build
```

预期: 构建成功，无错误。

最后提交：

```bash
git add -A
git commit -m "feat: 完成个人知识管理软件前端开发"
```