'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import {
  searchModalOpenAtom,
  searchQueryAtom,
  searchSelectedIndexAtom,
} from '@/atoms/search'

const SEARCH_ITEMS = [
  { id: 'home', title: 'HOME', path: '/', category: 'PAGES' },
  { id: 'work', title: 'WORK', path: '/work', category: 'PAGES' },
  { id: 'projects', title: 'PROJECTS', path: '/projects', category: 'PAGES' },
  { id: 'about', title: 'ABOUT', path: '/about', category: 'PAGES' },
  { id: 'logs', title: 'LOGS', path: '/logs', category: 'PAGES' },
  {
    id: 'logs-settings',
    title: 'LOGS SETTINGS',
    path: '/logs/settings',
    category: 'SETTINGS',
  },
]

export function SearchModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useAtom(searchModalOpenAtom)
  const [query, setQuery] = useAtom(searchQueryAtom)
  const [selectedIndex, setSelectedIndex] = useAtom(searchSelectedIndexAtom)

  const filteredItems = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = useCallback(
    (path: string) => {
      router.push(path)
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(0)
    },
    [router, setIsOpen, setQuery, setSelectedIndex]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex].path)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    selectedIndex,
    filteredItems,
    setIsOpen,
    setQuery,
    setSelectedIndex,
    handleSelect,
  ])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query, setSelectedIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/50"
            exit={{ opacity: 1 }}
            initial={{ opacity: 1 }}
            onClick={() => {
              setIsOpen(false)
              setQuery('')
              setSelectedIndex(0)
            }}
            transition={{ duration: 0 }}
          />
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[101] w-full max-w-2xl"
            exit={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
          >
            <div
              style={{
                backgroundColor: 'rgb(var(--background-start))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '0',
                overflow: 'hidden',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid rgb(var(--border))',
                }}
              >
                <input
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: 'rgb(var(--text-primary))',
                  }}
                  type="text"
                  value={query}
                />
              </div>

              {filteredItems.length > 0 && (
                <div
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background:
                          index === selectedIndex
                            ? 'rgb(var(--surface-1))'
                            : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgb(var(--border))',
                        cursor: 'pointer',
                        transition: 'background 0.1s ease',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-primary))',
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <div>{item.title}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgb(var(--text-secondary))',
                            marginTop: '0.25rem',
                          }}
                        >
                          {item.category}
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgb(var(--text-secondary))',
                          }}
                        >
                          ↵
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 && query && (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
