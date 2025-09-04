'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { mousePositionAtom } from '@/atoms/mouse'

export function useMousePosition() {
  const setMousePosition = useSetAtom(mousePositionAtom)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [setMousePosition])
}

// Hook to get current mouse position
export function useCurrentMousePosition() {
  return useAtomValue(mousePositionAtom)
}
