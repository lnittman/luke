'use client';

import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { mousePositionAtom } from '@/store/atoms';

export function useMousePosition() {
  const setMousePosition = useSetAtom(mousePositionAtom);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setMousePosition]);
}

// Hook to get current mouse position
export function useCurrentMousePosition() {
  return useAtomValue(mousePositionAtom);
}