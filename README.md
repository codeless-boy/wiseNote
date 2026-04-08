# wiseNote

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

一个类似 Notion 和 Obsidian 的个人知识管理 Web 应用，采用三栏式布局，支持富文本编辑和完整的笔记管理功能。

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [功能说明](#功能说明)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 特性

- **三栏式布局**：活动栏 + 侧边栏 + 内容区，类似 IDE 的高效布局
- **笔记本管理**：创建、编辑、删除笔记本，支持嵌套文件夹结构
- **笔记管理**：创建、编辑、删除笔记，支持自动保存
- **富文本编辑器**：基于 Milkdown 的 Markdown 编辑器，支持代码高亮
- **标签系统**：创建和管理标签，按标签筛选笔记
- **全文搜索**：支持标题和内容的全文搜索
- **版本历史**：保存笔记历史版本，支持版本恢复
- **本地优先**：基于 IndexedDB 的本地存储，数据安全可控

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS + shadcn/ui
- **编辑器**: Milkdown (基于 ProseMirror 的 Markdown 编辑器)
- **本地存储**: IndexedDB (通过 idb 库)
- **状态管理**: Zustand
- **布局组件**: tri-layout (三栏 IDE 风格布局)
- **测试**: Vitest (单元测试) + Playwright (E2E 测试)

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

### 运行

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 运行 E2E 测试
npm run test:e2e
```

### 访问

开发服务器启动后，访问 http://localhost:5173

## 项目结构

```
wiseNote/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TriLayout/       # 三栏布局组件
│   │   │   ├── MDEditor/        # Markdown 编辑器
│   │   │   ├── TreeView/        # 笔记本树形视图
│   │   │   ├── SearchPanel/     # 搜索面板
│   │   │   ├── TagPanel/        # 标签面板
│   │   │   ├── NoteEditor/      # 笔记编辑器
│   │   │   ├── NotebookList/    # 笔记本列表
│   │   │   ├── MainContent/     # 主内容区
│   │   │   └── ui/              # shadcn/ui 组件
│   │   ├── store/               # Zustand 状态管理
│   │   ├── db/                  # IndexedDB 数据层
│   │   ├── types/               # TypeScript 类型定义
│   │   ├── lib/                 # 工具函数
│   │   ├── hooks/               # React Hooks
│   │   ├── test/                # 单元测试
│   │   └── e2e/                 # E2E 测试
│   ├── package.json
│   └── vite.config.ts
├── docs/                        # 设计文档和规范
└── README.md
```

## 功能说明

### 三栏布局

- **活动栏 (Activity Bar)**：位于最左侧，提供导航入口（笔记本、搜索、标签、设置）
- **侧边栏 (Sidebar)**：根据活动栏选择显示不同内容（笔记本树、搜索面板、标签管理）
- **内容区 (Content)**：显示笔记列表和编辑器

### 笔记本操作

- 点击顶部按钮创建笔记本
- 右键点击笔记本进行重命名、删除操作
- 支持拖拽调整顺序

### 笔记操作

- 在笔记列表区域点击新建笔记
- 笔记支持 Markdown 语法
- 自动保存内容

### 搜索功能

- 支持按标题和内容全文搜索
- 可按标签筛选

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 许可证

MIT License