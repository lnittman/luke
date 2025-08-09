'use client';

import React from 'react';

interface MetricTileProps {
  value: number;
  label: string;
  color?: string;
}

export function MetricTile({ value, label, color = 'var(--text-secondary)' }: MetricTileProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgb(var(--surface-1))',
        border: '1px solid rgb(var(--border))',
        minWidth: '100px',
        fontFamily: 'monospace',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = `rgb(${color})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgb(var(--border))';
      }}
    >
      <span style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold',
        color: `rgb(${color})`,
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{ 
        fontSize: '0.75rem',
        color: 'rgb(var(--text-secondary))',
        marginTop: '0.25rem',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
}