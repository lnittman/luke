'use client'

import React, { useState } from 'react'

interface LogAccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function LogAccordionSection({
  title,
  children,
  defaultOpen = false,
}: LogAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const sectionStyle = {
    width: '100%',
    borderBottom: '1px solid rgb(var(--border))',
  }

  const headerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'none',
    border: 'none',
    padding: '1.5rem 24px',
    margin: 0,
    fontFamily: 'monospace',
    fontSize: '1rem',
    textTransform: 'uppercase' as const,
    textAlign: 'left' as const,
    cursor: 'pointer',
    color: 'rgb(var(--text-primary))',
    transition: 'none',
  }

  const contentStyle = {
    padding: '0 24px 1.5rem 24px',
    color: 'rgb(var(--text-secondary))',
  }

  return (
    <div style={sectionStyle}>
      <button
        aria-expanded={isOpen}
        style={headerStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <span>{title}</span>
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'rgb(var(--text-secondary))' 
        }}>
          {isOpen ? '▾' : '▸'}
        </span>
      </button>

      {isOpen && (
        <div style={contentStyle}>
          {children}
        </div>
      )}
    </div>
  )
}