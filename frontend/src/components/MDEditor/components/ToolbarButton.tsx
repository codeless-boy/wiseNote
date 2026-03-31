import React from 'react'

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`toolbar-btn ${isActive ? 'active' : ''}`}
    >
      {icon}
    </button>
  )
}