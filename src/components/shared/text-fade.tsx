'use client';

import { CSSProperties, ReactNode } from 'react';

interface TextFadeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: 'right' | 'left' | 'both';
  fadeWidth?: string;
}

export function TextFade({ 
  children, 
  className = '', 
  style = {},
  direction = 'right',
  fadeWidth = '2rem'
}: TextFadeProps) {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <div style={{ 
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}>
        {children}
      </div>
      
      {/* Right fade */}
      {(direction === 'right' || direction === 'both') && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: fadeWidth,
            background: `linear-gradient(to right, transparent, rgb(var(--background-start)))`,
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Left fade */}
      {(direction === 'left' || direction === 'both') && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: fadeWidth,
            background: `linear-gradient(to left, transparent, rgb(var(--background-start)))`,
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}