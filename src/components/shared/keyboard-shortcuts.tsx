'use client'

import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { searchModalOpenAtom } from '@/atoms/search'

export function KeyboardShortcuts() {
  const setSearchModalOpen = useSetAtom(searchModalOpenAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSearchModalOpen])

  return null
}
