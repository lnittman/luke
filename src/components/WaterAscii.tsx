'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import waterData from './effects/water-data.json';

interface WaterAsciiProps {
  className?: string;
  style?: CSSProperties;
  frameIntervalMs?: number;
  lineStart?: number; // inclusive
  lineEnd?: number;   // exclusive
  stripDigits?: boolean; // remove 0-9 and dots
}

export function WaterAscii({
  className = '',
  style,
  frameIntervalMs = 150,
  lineStart,
  lineEnd,
  stripDigits = false,
}: WaterAsciiProps) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let index = 0;

    const renderFrame = () => {
      if (!ref.current) return;
      let frame = waterData[index] as string;

      if (typeof lineStart === 'number' || typeof lineEnd === 'number') {
        const lines = frame.split('\n');
        const sliced = lines.slice(lineStart ?? 0, lineEnd ?? lines.length);
        frame = sliced.join('\n');
      }

      if (stripDigits) {
        frame = frame.replace(/[0-9.]/g, ' ');
      }

      ref.current.textContent = frame;
      index = (index + 1) % waterData.length;
    };

    const interval = setInterval(renderFrame, frameIntervalMs);
    renderFrame();

    return () => clearInterval(interval);
  }, [frameIntervalMs, lineStart, lineEnd, stripDigits]);

  return (
    <pre
      ref={ref}
      className={className}
      style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: '1.2',
        margin: 0,
        whiteSpace: 'pre',
        color: 'rgb(var(--accent-2))',
        opacity: 0.8,
        ...style,
      }}
    />
  );
}