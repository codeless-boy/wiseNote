# TreeView 完整交互逻辑重构设计文档

日期: 2026-03-31

## 概述

全面重构 wiseNote 的 TreeView 组件,使用 react-arborist 库实现高性能、功能完整的树形交互逻辑。

## 问题分析

当前 TreeView 实现存在以下问题:
1. **功能不完整** - 缺少节点重命名、删除、右键菜单等基本操作
2. **交互体验差** - 用户体验不够流畅(如展开/折叠、选择、拖拽等)
3. **性能问题** - 大量节点渲染卡顿
4. **代码结构混乱** - 交互逻辑不清晰,实现混乱

## 设计目标

1. **功能完整** - 提供基本操作(创建、删除、重命名)和导航功能(展开/折叠、搜索、排序)
2. **交互流畅** - 工具栏按钮触发操作,键盘导航支持
3. **高性能** - 虚拟滚动支持大量节点(1000+)
4. **代码清晰** - 分层架构,职责明确,可维护

## 技术方案

采用 **React-Arborist** 库,原因:
- 内置虚拟滚动,原生支持大量节点
- 提供完整的拖拽、重命名、快捷键支持
- 无障碍支持(键盘导航)
- 活跃维护,文档完善
- 可自定义渲染节点

## 架构设计

### 整体架构

```
数据层 (notebookStore, noteStore)
    ↓
适配层 (useTreeAdapter)
    ↓
React-Arborist Tree
    ↓
渲染层 (TreeNode, NodeActions)
    ↓
工具栏/操作层 (Toolbar)
```

### 分层职责

#### 1. 数据层
保持不变,继续使用:
- `notebookStore` - 笔记本状态管理
- `noteStore` - 笔记状态管理
- `db/notebooks.ts` / `db/notes.ts` - IndexedDB 操作

#### 2. 适配层 (新增)
- `hooks/useTreeAdapter.ts` - 数据转换,负责 Notebook/Note 数据 ↔ React-Arborist TreeData 转换
- `hooks/useTreeActions.ts` - 操作封装,提供增删改查操作的包装

#### 3. React-Arborist 组件
提供虚拟滚动、展开/折叠、键盘导航等核心功能。

#### 4. 渲染层 (自定义)
- `TreeNode.tsx` - 统一的节点渲染器
- `NodeActions.tsx` - 节点操作按钮组

#### 5. 工具栏/操作层
- `Toolbar.tsx` - 顶部工具栏按钮(新建笔记本、新建笔记)
- 节点行内操作按钮(重命名、删除、创建子笔记本)

### 数据结构映射

#### 原有数据模型(不变)
```typescript
interface Notebook {
  id: string
  name: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

interface Note {
  id: string
  title: string
  content: string
  notebookId: string | null
  tags: string[]
  links: string[]
  createdAt: number
  updatedAt: number
}
```

#### 统一树节点类型
```typescript
type TreeNode = {
  id: string
  name: string
  type: 'notebook' | 'note'
  parentId: string | null
  children: TreeNode[]
}
```

#### TreeAdapter API
```typescript
class TreeAdapter {
  // 数据转换
  toTreeData(notebooks: Notebook[], notes: Note[]): TreeNode[]
  
  // 增删改操作
  createNotebook(name: string, parentId?: string): Promise<Notebook>
  createNote(title: string, notebookId?: string): Promise<Note>
  renameNode(id: string, newName: string): Promise<void>
  deleteNode(id: string): Promise<void>
  
  // 辅助方法
  getSiblings(parentId: string | null): TreeNode[]
  checkDuplicate(name: string, parentId: string | null): boolean
}
```

## 组件结构

### 目录结构
```
TreeView/
├── index.tsx                 // 主容器,包含工具栏
├── Tree.tsx                  // React-Arborist 树组件包装
├── TreeNode.tsx              // 统一的节点渲染器
├── Toolbar.tsx               // 顶部工具栏
├── NodeActions.tsx           // 节点操作按钮组
└── hooks/
    ├── useTreeAdapter.ts     // 数据适配层 hook
    ├── useTreeActions.ts     // 树操作逻辑
    └── useTreeKeyboard.ts    // 键盘快捷键处理
```

### 主组件 TreeView
```tsx
function TreeView() {
  const { treeData, onCreateNotebook, onDelete, onRename } = useTreeAdapter()
  
  return (
    <div className="h-full flex flex-col">
      <Toolbar onCreateNotebook={onCreateNotebook} />
      <Tree data={treeData}>
        {(props) => <TreeNode {...props} />}
      </Tree>
    </div>
  )
}
```

### TreeNode 渲染逻辑
```tsx
function TreeNode({ node, style, dragHandle }: NodeProps<TreeNode>) {
  const isNotebook = node.data.type === 'notebook'
  const isExpanded = node.isExpanded
  
  return (
    <div style={style} className="flex items-center group">
      {/* 展开/折叠按钮 (仅笔记本) */}
      {isNotebook && (
        <button onClick={() => node.toggle()}>
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </button>
      )}
      
      {/* 图标 */}
      {isNotebook ? <Folder /> : <FileText />}
      
      {/* 名称 */}
      <span>{node.data.name}</span>
      
      {/* 悬停时显示操作按钮 */}
      <NodeActions node={node} className="opacity-0 group-hover:opacity-100" />
    </div>
  )
}
```

### 工具栏组件
```tsx
function Toolbar() {
  return (
    <div className="flex items-center gap-2 px-2 py-3 border-b">
      <Button onClick={onCreateNotebook} title="新建笔记本">
        <Folder />
      </Button>
      <Button onClick={onCreateRootNote} title="新建笔记">
        <FileText />
      </Button>
      
      {/* 搜索过滤 */}
      <SearchInput onSearch={onSearch} />
      
      {/* 视图控制 */}
      <Button onClick={onExpandAll}>全部展开</Button>
      <Button onClick={onCollapseAll}>全部折叠</Button>
    </div>
  )
}
```

### NodeActions 操作按钮
```tsx
function NodeActions({ node }: { node: TreeNode }) {
  if (node.data.type === 'notebook') {
    return (
      <>
        <Button onClick={onCreateNote} title="新建笔记">
          <FileText size={14} />
        </Button>
        <Button onClick={onCreateSubNotebook} title="新建子笔记本">
          <FolderPlus size={14} />
        </Button>
        <Button onClick={onRename} title="重命名">
          <Pencil size={14} />
        </Button>
        <Button onClick={onDelete} title="删除">
          <Trash size={14} />
        </Button>
      </>
    )
  } else {
    return (
      <>
        <Button onClick={onRename} title="重命名">
          <Pencil size={14} />
        </Button>
        <Button onClick={onDelete} title="删除">
          <Trash size={14} />
        </Button>
      </>
    )
  }
}
```

## 交互功能设计

### 基本操作

#### 创建笔记本
```typescript
onCreateNotebook(parentId?: string | null) {
  // 1. 自动生成名称 (避免重名)
  const name = generateUniqueName('新建笔记本', parentId)
  
  // 2. 调用 store 创建
  await notebookStore.createNotebook(name, parentId)
  
  // 3. 自动展开父节点
  if (parentId) {
    treeApi.expand(parentId)
  }
  
  // 4. 自动进入重命名编辑状态
  treeApi.edit(newNode.id)
}
```

#### 创建笔记
```typescript
onCreateNote(notebookId?: string | null) {
  // 1. 自动生成标题 (避免重名)
  const title = generateUniqueTitle('无标题', notebookId)
  
  // 2. 调用 store 创建
  await noteStore.createNote(notebookId)
  
  // 3. 如果指定笔记本,展开它
  if (notebookId) {
    treeApi.expand(notebookId)
  }
  
  // 4. 自动选中并进入编辑
  treeApi.edit(newNode.id)
}
```

#### 重命名
```typescript
onRename(nodeId: string) {
  // 1. 进入编辑模式
  treeApi.edit(nodeId)
  
  // 2. 用户输入完成后
  async onComplete(newName: string) {
    const node = findNode(nodeId)
    
    // 3. 检查重名
    if (checkDuplicate(newName, node.parentId, nodeId)) {
      showError('名称已存在')
      return
    }
    
    // 4. 调用对应 store 更新
    if (node.type === 'notebook') {
      await notebookStore.updateNotebook(nodeId, newName)
    } else {
      await noteStore.updateNote(nodeId, { title: newName })
    }
  }
}
```

#### 删除节点
```typescript
async onDelete(nodeId: string) {
  const node = findNode(nodeId)
  
  // 1. 确认对话框
  const message = node.type === 'notebook' && node.children.length > 0
    ? '此笔记本及其所有内容将被删除,是否继续?'
    : '确定删除此笔记?'
  
  if (!confirm(message)) return
  
  // 2. 递归删除(笔记本)
  if (node.type === 'notebook') {
    await recursiveDeleteNotebook(nodeId)
  } else {
    await noteStore.deleteNote(nodeId)
  }
  
  // 3. 清理选中状态
  if (currentNote?.id === nodeId) {
    noteStore.setCurrentNote(null)
  }
}

async recursiveDeleteNotebook(notebookId: string) {
  // 删除所有子笔记本
  const children = getChildNotebooks(notebookId)
  for (const child of children) {
    await recursiveDeleteNotebook(child.id)
  }
  
  // 删除笔记本内的笔记
  const notes = getNotesForNotebook(notebookId)
  for (const note of notes) {
    await noteStore.deleteNote(note.id)
  }
  
  // 删除笔记本本身
  await notebookStore.deleteNotebook(notebookId)
}
```

### 导航功能

#### 展开全部 / 折叠全部
```typescript
onExpandAll() {
  const allFolderIds = getAllFolderIds(treeData)
  treeApi.expand(allFolderIds)
}

onCollapseAll() {
  treeApi.collapseAll()
}
```

#### 搜索过滤
```typescript
const [searchQuery, setSearchQuery] = useState('')

const filteredTreeData = useMemo(() => {
  if (!searchQuery) return treeData
  
  // 深度优先搜索
  return filterTree(treeData, (node) => {
    return node.name.toLowerCase().includes(searchQuery.toLowerCase())
  })
}, [treeData, searchQuery])
```

搜索行为:
1. 输入搜索词时,实时过滤树
2. 匹配的节点高亮显示
3. 匹配节点的所有父节点自动展开
4. 清空搜索词时恢复完整树

#### 排序
当前已实现按名称排序,可扩展:
- 按创建时间排序
- 按更新时间排序
- 用户自定义排序

### 选择和编辑行为

#### 选择节点
```typescript
onSelect(nodeId: string) {
  const node = findNode(nodeId)
  
  // 笔记本:切换展开状态
  if (node.type === 'notebook') {
    treeApi.toggle(nodeId)
  }
  
  // 笔记:设为当前笔记
  if (node.type === 'note') {
    noteStore.setCurrentNote(node.original)
  }
}
```

#### 键盘导航
React-Arborist 内置支持:
- 上下箭头: 选择上/下节点
- 左右箭头: 折叠/展开或进入子节点
- Enter: 进入编辑模式
- Delete: 删除节点
- F2: 重命名

## 性能优化

### 虚拟滚动
React-Arborist 内置虚拟滚动功能:
- 只渲染可见区域内的节点
- 动态计算行高
- 自动处理滚动位置

配置:
```tsx
<Tree
  data={treeData}
  rowHeight={28}
  overscanCount={5}
  padding={0}
>
```

性能指标:
- 1000+ 节点渲染时间: < 100ms
- 滚动帧率: 60fps
- 内存占用: 只持有可见节点的 DOM 元素

### 数据缓存策略
当前缓存:
```typescript
notebookStore.notebooks: Notebook[]
noteStore.notesByNotebook: Record<string, Note[]>
noteStore.rootNotes: Note[]
```

优化策略:
1. **懒加载笔记** - 只在展开笔记本时才加载笔记
2. **缓存失效机制** - 创建/删除笔记时更新缓存,保持同步
3. **局部更新** - 更新单个节点时,不重新加载整棵树

### 树构建优化
使用 useMemo 缓存树数据:
```typescript
const treeData = useMemo(() => {
  return buildTree(notebooks, notes)
}, [notebooks, notes])
```

树构建函数优化(避免重复计算):
```typescript
function buildTree(notebooks: Notebook[], notes: Note[]): TreeNode[] {
  // 1. 快速查找表
  const notebookMap = new Map(notebooks.map(n => [n.id, n]))
  const childrenMap = new Map<string, TreeNode[]>()
  
  // 2. 构建父子关系(O(n))
  notebooks.forEach(nb => {
    const parentChildren = childrenMap.get(nb.parentId) || []
    parentChildren.push({ ...nb, type: 'notebook', children: [] })
    childrenMap.set(nb.parentId, parentChildren)
  })
  
  // 3. 挂载笔记到对应笔记本(O(m))
  notes.forEach(note => {
    const parentChildren = childrenMap.get(note.notebookId) || []
    parentChildren.push({ ...note, type: 'note', children: [] })
    childrenMap.set(note.notebookId, parentChildren)
  })
  
  // 4. 递归构建树
  return buildTreeRecursive(null, childrenMap)
}
```

时间复杂度: O(n + m),其中 n=笔记本数,m=笔记数

### 渲染优化
避免不必要的重渲染:
```typescript
// TreeNode 使用 React.memo
const TreeNode = React.memo(function TreeNode({ node, style }) {
  // ...
})

// 节点操作按钮只在 hover 时渲染
{isHovered && <NodeActions node={node} />}
```

批量更新:
```typescript
import { startTransition } from 'react'

onExpandAll() {
  startTransition(() => {
    treeApi.expand(allFolderIds)
  })
}
```

### 内存管理
可选 LRU 缓存(进阶功能):
```typescript
const MAX_CACHED_NOTEBOOKS = 20

const cleanupCache = () => {
  const notebookIds = Object.keys(notesByNotebook)
  if (notebookIds.length > MAX_CACHED_NOTEBOOKS) {
    const toRemove = notebookIds.slice(0, -MAX_CACHED_NOTEBOOKS)
    toRemove.forEach(id => delete notesByNotebook[id])
  }
}
```

## 错误处理

### 数据操作错误
```typescript
// 创建失败
try {
  await notebookStore.createNotebook(name)
} catch (error) {
  showError('创建笔记本失败: ' + error.message)
  cancelEditing()
}

// 删除失败
try {
  await notebookStore.deleteNotebook(id)
} catch (error) {
  showError('删除失败,请稍后重试')
  await fetchNotebooks()
}

// 重命名失败
try {
  await updateNote(id, { title: newName })
} catch (error) {
  showError('重命名失败')
  restoreOriginalName(id)
}
```

### 用户输入验证
```typescript
const validateName = (name: string, parentId: string | null, excludeId?: string): string | null => {
  // 1. 空名称检查
  if (!name || name.trim().length === 0) {
    return '名称不能为空'
  }
  
  // 2. 长度限制
  if (name.length > 100) {
    return '名称不能超过 100 个字符'
  }
  
  // 3. 特殊字符检查
  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(name)) {
    return '名称不能包含特殊字符: < > : " / \\ | ? *'
  }
  
  // 4. 重名检查
  if (checkDuplicate(name, parentId, excludeId)) {
    return '此名称已存在'
  }
  
  return null
}
```

### 边界情况

#### 空树状态
```tsx
if (treeData.length === 0) {
  return (
    <EmptyState>
      <FileText size={48} className="text-gray-300" />
      <p>还没有任何笔记</p>
      <Button onClick={onCreateNotebook}>创建第一个笔记本</Button>
    </EmptyState>
  )
}
```

#### 空笔记本
```tsx
{isExpanded && children.length === 0 && (
  <EmptyNotebookHint>
    <small>暂无笔记</small>
    <Button size="sm" onClick={onCreateNote}>添加笔记</Button>
  </EmptyNotebookHint>
)}
```

#### 删除节点时的级联选择
```typescript
const handleDelete = async (nodeId: string) => {
  const nodes = getAllNodes()
  const currentIndex = nodes.findIndex(n => n.id === nodeId)
  
  await deleteNode(nodeId)
  
  const remainingNodes = nodes.filter(n => n.id !== nodeId)
  if (remainingNodes.length > 0) {
    const nextIndex = Math.min(currentIndex, remainingNodes.length - 1)
    const nextNode = remainingNodes[nextIndex]
    treeApi.select(nextNode.id)
  }
}
```

#### 外部数据变更
```typescript
useEffect(() => {
  const handleStorageChange = async (e: StorageEvent) => {
    if (e.key?.startsWith('notebook_') || e.key?.startsWith('note_')) {
      await fetchNotebooks()
      await fetchRootNotes()
      showInfo('数据已更新')
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])
```

### 加载状态
```tsx
// 初始加载
if (loading) {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
    </div>
  )
}

// 单个笔记本加载笔记
{isExpanded && !notesLoaded && (
  <div className="flex items-center gap-2">
    <Spinner size={14} />
    <span>加载中...</span>
  </div>
)}
```

## 测试策略

### 单元测试
测试文件结构:
```
TreeView/
├── index.test.tsx
├── TreeNode.test.tsx
├── Toolbar.test.tsx
└── hooks/
    ├── useTreeAdapter.test.ts
    ├── useTreeActions.test.ts
    └── useTreeKeyboard.test.ts
```

测试用例示例:
- 数据转换正确性
- 重名自动编号
- 重命名验证
- 创建/删除/更新操作

### 集成测试
- 树结构渲染正确性
- 展开/折叠交互
- 创建并自动编辑
- 键盘导航

### 性能测试
- 1000 节点渲染时间 < 100ms
- 滚动帧率 60fps

## 迁移计划

### 阶段 1: 安装依赖和基础配置
- 安装 react-arborist 和类型定义
- 配置 Tailwind CSS 样式
- **预计时间:** 0.5 小时

### 阶段 2: 创建适配层
- 创建 `hooks/useTreeAdapter.ts`
- 创建 `hooks/useTreeActions.ts`
- **预计时间:** 2 小时

### 阶段 3: 重构组件
- 备份现有 TreeView
- 创建新组件(Tree.tsx, TreeNode.tsx, Toolbar.tsx)
- 集成到主组件
- **预计时间:** 3 小时

### 阶段 4: 功能完善
- 实现键盘导航
- 实现搜索过滤
- 实现展开/折叠全部
- 完善错误处理
- **预计时间:** 2 小时

### 阶段 5: 测试和优化
- 编写单元测试
- 编写集成测试
- 性能测试和优化
- 手动测试边界情况
- **预计时间:** 4 小时

**总预计时间:** 约 11.5 小时(1-2 天工作量)

## 兼容性考虑

### 数据兼容性
- 保持现有 IndexedDB 数据结构不变
- 现有用户数据无需迁移

### API 兼容性
- 保持 `notebookStore` 和 `noteStore` 的现有接口
- 其他组件无需修改

### 降级方案
```typescript
// 如果 react-arborist 加载失败,降级到简化版本
<Suspense fallback={<SimpleTreeView />}>
  <ReactArboristTree />
</Suspense>
```

## 总结

本设计采用 React-Arborist 库,实现完整的树形交互逻辑,包含:
1. **清晰架构** - 数据层、适配层、组件层分层明确
2. **完整功能** - 创建、删除、重命名、搜索、排序等
3. **高性能** - 虚拟滚动支持大规模数据
4. **良好体验** - 键盘导航、流畅交互
5. **可维护** - 模块化设计,易于测试和扩展

实施后将解决当前 TreeView 的所有核心问题,提供稳定可靠的树形交互体验。