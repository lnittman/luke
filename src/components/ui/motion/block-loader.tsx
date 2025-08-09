'use client';

import React, { useState, useEffect, useRef } from 'react';

const SEQUENCES = [
  ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
  ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
  ['▖', '▘', '▝', '▗'],
  ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▁'],
  ['▉', '▊', '▋', '▌', '▍', '▎', '▏', '▎', '▍', '▌', '▋', '▊', '▉'],
  ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
  ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'],
  ['◢', '◣', '◤', '◥'],
  ['◰', '◳', '◲', '◱'],
  ['◴', '◷', '◶', '◵'],
  ['◐', '◓', '◑', '◒'],
];

interface BlockLoaderProps {
  mode?: number;
  className?: string;
}

export function BlockLoader({ mode = 0, className = '' }: BlockLoaderProps) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  const sequence = SEQUENCES[mode] || SEQUENCES[0];
  const indexLength = sequence.length;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % indexLength);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [indexLength]);

  return (
    <span 
      className={`inline-block w-[1ch] text-center font-mono ${className}`}
      style={{ color: 'rgb(var(--accent-1))' }}
    >
      {sequence[index]}
    </span>
  );
}