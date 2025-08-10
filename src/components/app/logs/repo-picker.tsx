'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { TextFade } from '@/components/shared/text-fade'

interface Repository {
  id: string
  name: string
  owner: string
  fullName: string
}

interface RepoPickerProps {
  selectedRepo: string | null
  onRepoSelect: (repoId: string | null) => void
  isMobile?: boolean
}

export function RepoPicker({
  selectedRepo,
  onRepoSelect,
  isMobile = false,
}: RepoPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch repositories from settings
  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/logs/repos')
      const data = await response.json()

      if (data.repos) {
        const repos = data.repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          owner: repo.owner,
          fullName: repo.fullName,
        }))
        setRepositories(repos)
      }
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.owner.toLowerCase().includes(query) ||
        repo.fullName.toLowerCase().includes(query)
    )
  }, [repositories, searchQuery])

  const selectedRepoName = selectedRepo
    ? repositories.find((r) => r.id === selectedRepo)?.fullName || 'Unknown'
    : 'All Repositories'

  const handleSelect = (repoId: string | null) => {
    onRepoSelect(repoId)
    setIsOpen(false)
    setSearchQuery('')
  }

  if (isMobile) {
    // Mobile sheet implementation
    return (
      <>
        <button
          aria-label="Filter by Repository"
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgb(var(--surface-1))'
            e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.borderColor = 'rgb(var(--border))'
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            background: 'none',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--text-primary))',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            gap: '0.5rem',
          }}
          title="Filter by Repository"
        >
          <svg
            fill="currentColor"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed z-[100]"
              exit={{ opacity: 1 }}
              initial={{ opacity: 1 }}
              onClick={() => {
                setIsOpen(false)
                setSearchQuery('')
              }}
              style={{
                background: 'rgb(var(--background-start))',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'fixed',
                zIndex: 100,
              }}
              transition={{ duration: 0 }}
            >
              <div
                className="relative z-[101] flex h-full w-full flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with search - match logs page exactly */}
                <div
                  style={{
                    padding: '0.75rem 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid rgb(var(--border))',
                    backgroundColor: 'rgb(var(--background-start))',
                  }}
                >
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))'
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                      e.currentTarget.style.borderColor = 'rgb(var(--border))'
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'none',
                      border: '1px solid rgb(var(--border))',
                      color: 'rgb(var(--text-primary))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                      padding: 0,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    ←
                  </button>

                  <div
                    style={{
                      position: 'relative',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid rgb(var(--border))',
                      padding: '0 0.75rem',
                      height: '2.5rem',
                      backgroundColor: 'rgb(var(--surface-1))',
                    }}
                  >
                    <input
                      autoFocus
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="search repositories..."
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-primary))',
                        paddingRight: searchQuery ? '2rem' : '0',
                      }}
                      type="text"
                      value={searchQuery}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.7'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                        style={{
                          position: 'absolute',
                          right: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '1.5rem',
                          height: '1.5rem',
                          background: 'none',
                          border: 'none',
                          color: 'rgb(var(--text-primary))',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s ease',
                          fontFamily: 'monospace',
                          fontSize: '1rem',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Repository list */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    borderTop: '1px solid rgb(var(--border))',
                  }}
                >
                  <button
                    onClick={() => handleSelect(null)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      background:
                        selectedRepo === null
                          ? 'rgb(var(--surface-1))'
                          : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgb(var(--border))',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                      fontFamily: 'monospace',
                      color: 'rgb(var(--text-primary))',
                      textAlign: 'left',
                    }}
                  >
                    <TextFade style={{ fontSize: '0.875rem' }}>
                      all repositories
                    </TextFade>
                  </button>

                  {loading ? (
                    <div
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-secondary))',
                      }}
                    >
                      loading repositories...
                    </div>
                  ) : filteredRepos.length > 0 ? (
                    filteredRepos.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() => handleSelect(repo.id)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          background:
                            selectedRepo === repo.id
                              ? 'rgb(var(--surface-1))'
                              : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgb(var(--border))',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                          fontFamily: 'monospace',
                          color: 'rgb(var(--text-primary))',
                          textAlign: 'left',
                        }}
                      >
                        <TextFade style={{ fontSize: '0.875rem' }}>
                          {repo.fullName}
                        </TextFade>
                      </button>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-secondary))',
                      }}
                    >
                      no repositories found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop dropdown implementation
  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-label="Filter by Repository"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgb(var(--surface-1))'
          e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgb(var(--border))'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: '2.5rem',
          padding: '0 0.75rem',
          background: 'transparent',
          border: '1px solid rgb(var(--border))',
          color: 'rgb(var(--text-primary))',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
        title="Filter by Repository"
      >
        <span>{selectedRepoName}</span>
        <span style={{ fontSize: '0.625rem' }}>▾</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
            initial={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              minWidth: '250px',
              maxWidth: '400px',
              maxHeight: '400px',
              backgroundColor: 'rgb(var(--background-start))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '0',
              overflow: 'hidden',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
            }}
            transition={{ duration: 0 }}
          >
            {/* Search input */}
            <div
              style={{
                padding: '0.75rem',
                borderBottom: '1px solid rgb(var(--border))',
              }}
            >
              <input
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search repositories..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgb(var(--surface-1))',
                  border: '1px solid rgb(var(--border))',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-primary))',
                }}
                type="text"
                value={searchQuery}
              />
            </div>

            {/* Repository list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <button
                onClick={() => handleSelect(null)}
                onMouseEnter={(e) => {
                  if (selectedRepo !== null) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRepo !== null) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background:
                    selectedRepo === null
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
                all repositories
              </button>

              {loading ? (
                <div
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  loading repositories...
                </div>
              ) : filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelect(repo.id)}
                    onMouseEnter={(e) => {
                      if (selectedRepo !== repo.id) {
                        e.currentTarget.style.background =
                          'rgb(var(--surface-1))'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRepo !== repo.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.25rem',
                      background:
                        selectedRepo === repo.id
                          ? 'rgb(var(--surface-1))'
                          : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgb(var(--border))',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                      fontFamily: 'monospace',
                      color: 'rgb(var(--text-primary))',
                      textAlign: 'left',
                    }}
                  >
                    <TextFade style={{ fontSize: '0.875rem' }}>
                      {repo.fullName}
                    </TextFade>
                  </button>
                ))
              ) : (
                <div
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  no repositories found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
