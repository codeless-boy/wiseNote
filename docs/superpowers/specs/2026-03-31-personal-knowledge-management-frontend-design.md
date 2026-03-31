# 个人知识管理软件前端 - 设计文档

## 概述

一个个人知识管理应用的前端，采用三栏式布局，支持富文本编辑和完整的笔记管理功能。类似 Notion 和 Obsidian。

## 目标

- 构建基于网页的个人笔记应用
- 集成 tri-layout 实现三栏式布局
- 集成 editor 实现富文本编辑
- 支持本地优先存储，后续可扩展后端同步功能

## 架构设计

### 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS + shadcn/ui
- **布局组件**: tri-layout（三栏 IDE 风格布局）
- **编辑器**: editor（基于 Milkdown 的富文本编辑器）
- **本地存储**: IndexedDB
- **状态管理**: Zustand

### 布局结构

三栏式布局：
- **左侧栏**: 笔记本/文件夹列表 + 活动栏（笔记本、搜索、标签）
- **中间栏**: 笔记列表（当前笔记本下的笔记）
- **右侧栏**: 笔记编辑器 + 元数据（标签、时间戳等）

## 数据模型

### 笔记本

```typescript
interface Notebook {
  id: string
  name: string
  parentId?: string  // 支持嵌套文件夹
  createdAt: number
  updatedAt: number
}
```

### 笔记

```typescript
interface Note {
  id: string
  title: string
  content: string
  notebookId: string
  tags: string[]
  links: string[]  // 引用其他笔记的 ID
  createdAt: number
  updatedAt: number
  versions: NoteVersion[]
}
```

### 笔记版本

```typescript
interface NoteVersion {
  id: string
  content: string
  savedAt: number
}
```

### 标签

```typescript
interface Tag {
  id: string
  name: string
  color?: string
  createdAt: number
}
```

## 功能模块

### 1. 笔记本管理

- 创建/重命名/删除笔记本
- 支持嵌套文件夹结构
- 拖拽排序

### 2. 笔记管理

- 创建/编辑/删除笔记
- 自动保存功能
- 自动从内容提取标题

### 3. 搜索功能

- 全文搜索（标题 + 内容）
- 标签筛选
- 快速索引

### 4. 标签系统

- 创建/重命名/删除标签
- 按标签筛选笔记
- 标签云展示

### 5. 笔记链接

- 使用 `[[笔记名]]` 语法实现双向链接
- 反向链接面板
- 知识图谱可视化（后续版本）

### 6. 版本历史

- 分页版本列表
- 版本内容预览
- 恢复到指定版本

### 7. 导出功能

- 导出为 Markdown
- 导出为 PDF
- 批量导出

## 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── TriLayout/       # 三栏布局（从 tri-layout 项目复制）
│   │   ├── MDEditor/        # 富文本编辑器（从 editor 项目复制）
│   │   ├── NotebookList/    # 笔记本列表组件
│   │   ├── NoteList/        # 笔记列表组件
│   │   ├── NoteEditor/      # 笔记编辑器组件
│   │   ├── SearchPanel/     # 搜索面板
│   │   ├── TagPanel/        # 标签面板
│   │   └── VersionHistory/  # 版本历史组件
│   ├── store/
│   │   ├── notebookStore.ts
│   │   ├── noteStore.ts
│   │   ├── searchStore.ts
│   │   └── tagStore.ts
│   ├── db/
│   │   ├── index.ts         # IndexedDB 初始化
│   │   ├── notebooks.ts     # 笔记本 CRUD
│   │   ├── notes.ts         # 笔记 CRUD
│   │   ├── tags.ts          # 标签 CRUD
│   │   └── migrations.ts    # 数据迁移
│   ├── utils/
│   │   ├── linkParser.ts    # [[链接]] 解析器
│   │   ├── exporter.ts      # 导出工具
│   │   └── search.ts        # 搜索工具
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── ...
```

## 组件集成

### tri-layout 集成

从 `tri-layout/src/components/TriLayout/` 复制组件到 `frontend/src/components/TriLayout/`。

使用方式：
```tsx
<TriLayout className="h-screen">
  <TriLayout.ActivityBar items={activityItems} activeId={activeId} onChange={handleActivityChange} />
  <TriLayout.Sidebar width={sidebarWidth} collapsed={sidebarCollapsed} onWidthChange={setSidebarWidth}>
    {/* 根据 activeId 显示笔记本列表或搜索面板 */}
  </TriLayout.Sidebar>
  <TriLayout.Content>
    {/* 笔记列表和编辑器 */}
  </TriLayout.Content>
</TriLayout>
```

### editor 集成

从 `editor/src/MDEditor/` 复制组件到 `frontend/src/components/MDEditor/`。

使用方式：
```tsx
<MDEditor
  value={note.content}
  onChange={handleContentChange}
  theme="light"
/>
```

## UI 设计

### 主题风格

浅色主题，类似 Notion：
- 背景：white/gray-50
- 侧边栏：gray-100
- 边框：gray-200
- 文字：gray-900/gray-600
- 强调色：blue-600

### 活动栏项

1. **笔记本** - 笔记本/文件夹树（默认）
2. **搜索** - 搜索面板
3. **标签** - 标签管理
4. **设置** - 应用设置（无侧边栏）

## 开发路线

### 第一阶段：基础架构
- 项目初始化
- 集成 tri-layout 和 editor 组件
- IndexedDB 数据层搭建
- 基础笔记本/笔记 CRUD

### 第二阶段：核心功能
- 搜索功能
- 标签系统
- 笔记编辑器集成
- 自动保存

### 第三阶段：高级功能
- 笔记链接和反向链接
- 版本历史
- 导出功能
- UI 细节优化

### 第四阶段：后续扩展
- 后端同步 API 集成
- 知识图谱可视化
- 协作功能

## 测试策略

- 工具函数单元测试（链接解析器、导出工具、搜索）
- IndexedDB 操作集成测试
- 关键用户流程 E2E 测试