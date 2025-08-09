'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextFade } from '@/components/shared/text-fade';

interface Repository {
  id: string;
  name: string;
  owner: string;
  fullName: string;
}

interface RepoPickerProps {
  selectedRepo: string | null;
  onRepoSelect: (repoId: string | null) => void;
  isMobile?: boolean;
}

export function RepoPicker({ selectedRepo, onRepoSelect, isMobile = false }: RepoPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch repositories from settings
  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/logs/settings');
      const data = await response.json();
      
      if (data.repositories) {
        const repos = data.repositories.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          owner: repo.owner,
          fullName: `${repo.owner}/${repo.name}`
        }));
        setRepositories(repos);
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return repositories.filter(repo => 
      repo.name.toLowerCase().includes(query) ||
      repo.owner.toLowerCase().includes(query) ||
      repo.fullName.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);

  const selectedRepoName = selectedRepo 
    ? repositories.find(r => r.id === selectedRepo)?.fullName || 'Unknown'
    : 'All Repositories';

  const handleSelect = (repoId: string | null) => {
    onRepoSelect(repoId);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (isMobile) {
    // Mobile sheet implementation
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          title="Filter by Repository"
          aria-label="Filter by Repository"
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgb(var(--surface-1))';
            e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.borderColor = 'rgb(var(--border))';
          }}
        >
          <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>R</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100]"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
              style={{ background: 'rgb(var(--background-start))' }}
            >
              <div className="relative z-[101] flex h-full w-full flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header with search */}
                <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery('');
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))';
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.borderColor = 'rgb(var(--border))';
                    }}
                  >
                    ←
                  </button>
                  
                  <div style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgb(var(--border))',
                    padding: '0 0.75rem',
                    height: '2.5rem',
                    backgroundColor: 'rgb(var(--surface-1))'
                  }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="search repositories..."
                      autoFocus
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
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Repository list */}
                <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgb(var(--border))' }}>
                  <button
                    onClick={() => handleSelect(null)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      background: selectedRepo === null ? 'rgb(var(--surface-1))' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgb(var(--border))',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                      fontFamily: 'monospace',
                      color: 'rgb(var(--text-primary))',
                      textAlign: 'left',
                    }}
                  >
                    <TextFade style={{ fontSize: '0.875rem' }}>all repositories</TextFade>
                  </button>

                  {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
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
                          background: selectedRepo === repo.id ? 'rgb(var(--surface-1))' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgb(var(--border))',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                          fontFamily: 'monospace',
                          color: 'rgb(var(--text-primary))',
                          textAlign: 'left',
                        }}
                      >
                        <TextFade style={{ fontSize: '0.875rem' }}>{repo.fullName}</TextFade>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                      no repositories found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop dropdown implementation
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Filter by Repository"
        aria-label="Filter by Repository"
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
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgb(var(--surface-1))';
          e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgb(var(--border))';
        }}
      >
        <span>{selectedRepoName}</span>
        <span style={{ fontSize: '0.625rem' }}>▾</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
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
          >
            {/* Search input */}
            <div style={{ padding: '0.75rem', borderBottom: '1px solid rgb(var(--border))' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search repositories..."
                autoFocus
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
              />
            </div>

            {/* Repository list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <button
                onClick={() => handleSelect(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: selectedRepo === null ? 'rgb(var(--surface-1))' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgb(var(--border))',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-primary))',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (selectedRepo !== null) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRepo !== null) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                all repositories
              </button>

              {loading ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                  loading repositories...
                </div>
              ) : filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelect(repo.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.25rem',
                      background: selectedRepo === repo.id ? 'rgb(var(--surface-1))' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgb(var(--border))',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                      fontFamily: 'monospace',
                      color: 'rgb(var(--text-primary))',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRepo !== repo.id) {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRepo !== repo.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <TextFade style={{ fontSize: '0.875rem' }}>{repo.fullName}</TextFade>
                  </button>
                ))
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                  no repositories found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}