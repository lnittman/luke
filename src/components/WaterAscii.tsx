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
  mode?: 'data' | 'procedural';
  rows?: number;
  columns?: number;
  speed?: number; // procedural animation speed multiplier
  characters?: string[]; // from low intensity to high
  seed?: number; // for noise
}

export function WaterAscii({
  className = '',
  style,
  frameIntervalMs = 150,
  lineStart,
  lineEnd,
  stripDigits = false,
  mode = 'data',
  rows = 8,
  columns = 32,
  speed = 1,
  characters = [' ', '·', '.', '˳', '~', '≈', '≋'],
  seed = 1,
}: WaterAsciiProps) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (mode === 'procedural') {
      let rafId = 0;
      const start = performance.now();

      // Pseudo-random noise helper
      const noise = (x: number, y: number, t: number) => {
        const n = Math.sin((x * 12.9898 + y * 78.233 + (t + seed) * 0.015) * 43758.5453);
        return n - Math.floor(n);
      };

      const render = (now: number) => {
        if (!ref.current) return;
        const t = ((now - start) / 1000) * speed;

        let out = '';
        for (let row = 0; row < rows; row++) {
          const y = row / rows;
          // vertical drift to create interference between layers
          const drift = Math.sin(t * 0.7 + y * Math.PI * 1.5) * 0.5;
          for (let col = 0; col < columns; col++) {
            const x = col / columns;
            // Two overlapping waves + light noise
            const w1 = Math.sin((x * Math.PI * 2 * 1.2) + t * 2.2 + y * 0.8);
            const w2 = Math.sin((x * Math.PI * 2 * 2.6) - t * 1.4 + y * 2.3 + drift);
            const n = noise(col, row, t * 60) * 0.6 - 0.3;
            let v = (w1 * 0.6 + w2 * 0.4 + n) * (0.7 + y * 0.6);
            // Normalize to 0..1
            v = Math.max(0, Math.min(1, (v + 1) / 2));
            const idx = Math.min(characters.length - 1, Math.floor(v * characters.length));
            out += characters[idx];
          }
          if (row < rows - 1) out += '\n';
        }

        ref.current.textContent = out;
        rafId = requestAnimationFrame(render);
      };

      rafId = requestAnimationFrame(render);

      return () => cancelAnimationFrame(rafId);
    } else {
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
    }
  }, [mode, frameIntervalMs, lineStart, lineEnd, stripDigits, rows, columns, speed, characters, seed]);

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