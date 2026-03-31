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