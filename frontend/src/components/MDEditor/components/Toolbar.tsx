import React from 'react'
import { ToolbarButton } from './ToolbarButton'
import { Separator } from '@/components/ui/separator'

interface ToolbarProps {
  onBold: () => void
  onItalic: () => void
  onStrike: () => void
  onHeading: (level: number) => void
  onQuote: () => void
  onCode: () => void
  onCodeBlock: () => void
  onBulletList: () => void
  onOrderedList: () => void
  onLink: () => void
  onImage: () => void
  onHorizontalRule: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

const BoldIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6V4zm0 8h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6v-8z" />
  </svg>
)

const ItalicIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4h6v2h-2.5l-2 12H16v2H8v-2h2.5l2-12H10V4z" />
  </svg>
)

const StrikeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 6.5c1.38 0 2.5.56 2.5 1.25v1.25h-5V7.75c0-.69 1.12-1.25 2.5-1.25zm0-1.5c-2.21 0-4 1.12-4 2.5v1.25h8V7.5c0-1.38-1.79-2.5-4-2.5zm5 6.5H7v1.5h10V12zm-5 5c-1.38 0-2.5-.56-2.5-1.25v-1.25h5v1.25c0 .69-1.12 1.25-2.5 1.25zm0 1.5c2.21 0 4-1.12 4-2.5V15H8v1.5c0 1.38 1.79 2.5 4 2.5z" />
  </svg>
)

const HeadingIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 4v6h1V4h2v16H6v-7H5v7H3V4h2zm7 0h1l5 8.5V4h2v16h-1l-5-8.5V20h-2V4z" />
  </svg>
)

const QuoteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
  </svg>
)

const CodeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
)

const ListBulletIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.67 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
  </svg>
)

const ListOrderedIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-7h1V5H2v1h1v4zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm7-6v2h14V5H9zm0 16h14v-2H9v2zm0-8h14v-2H9v2z" />
  </svg>
)

const LinkIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
)

const ImageIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
)

const HorizontalRuleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 11h16v2H4z" />
  </svg>
)

const UndoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
  </svg>
)

const RedoIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
  </svg>
)

export const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onStrike,
  onHeading,
  onQuote,
  onCode,
  onCodeBlock,
  onBulletList,
  onOrderedList,
  onLink,
  onImage,
  onHorizontalRule,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="md-editor-toolbar">
      <ToolbarButton icon={<UndoIcon />} label="撤销" onClick={onUndo} disabled={!canUndo} />
      <ToolbarButton icon={<RedoIcon />} label="重做" onClick={onRedo} disabled={!canRedo} />
      
      <Separator orientation="vertical" className="mx-1 h-4" />
      
      <ToolbarButton icon={<BoldIcon />} label="粗体" onClick={onBold} />
      <ToolbarButton icon={<ItalicIcon />} label="斜体" onClick={onItalic} />
      <ToolbarButton icon={<StrikeIcon />} label="删除线" onClick={onStrike} />
      
      <Separator orientation="vertical" className="mx-1 h-4" />
      
      <ToolbarButton icon={<HeadingIcon />} label="标题1" onClick={() => onHeading(1)} />
      <ToolbarButton icon={<HeadingIcon />} label="标题2" onClick={() => onHeading(2)} />
      <ToolbarButton icon={<HeadingIcon />} label="标题3" onClick={() => onHeading(3)} />
      
      <Separator orientation="vertical" className="mx-1 h-4" />
      
      <ToolbarButton icon={<QuoteIcon />} label="引用" onClick={onQuote} />
      <ToolbarButton icon={<CodeIcon />} label="行内代码" onClick={onCode} />
      <ToolbarButton icon={<CodeIcon />} label="代码块" onClick={onCodeBlock} />
      
      <Separator orientation="vertical" className="mx-1 h-4" />
      
      <ToolbarButton icon={<ListBulletIcon />} label="无序列表" onClick={onBulletList} />
      <ToolbarButton icon={<ListOrderedIcon />} label="有序列表" onClick={onOrderedList} />
      
      <Separator orientation="vertical" className="mx-1 h-4" />
      
      <ToolbarButton icon={<LinkIcon />} label="链接" onClick={onLink} />
      <ToolbarButton icon={<ImageIcon />} label="图片" onClick={onImage} />
      <ToolbarButton icon={<HorizontalRuleIcon />} label="分隔线" onClick={onHorizontalRule} />
    </div>
  )
}