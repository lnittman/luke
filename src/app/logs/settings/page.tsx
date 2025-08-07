'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';
import { useRouter } from 'next/navigation';

interface Repository {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  analysisEnabled: boolean;
  analysisDepth: 'basic' | 'standard' | 'deep';
}

export default function LogsSettingsPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/logs/settings');
      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const addRepository = async () => {
    if (!newRepoUrl) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/logs/settings/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newRepoUrl }),
      });
      
      if (!response.ok) throw new Error('Failed to add repository');
      
      const repo = await response.json();
      setRepositories([...repositories, repo]);
      setNewRepoUrl('');
      setMessage({ type: 'success', text: 'Repository added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to add repository' });
    } finally {
      setLoading(false);
    }
  };

  const removeRepository = async (repoId: string) => {
    try {
      const response = await fetch(`/api/logs/settings/repositories/${repoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove repository');
      
      setRepositories(repositories.filter(r => r.id !== repoId));
      setMessage({ type: 'success', text: 'Repository removed' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove repository' });
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BlockLoader mode={2} />
              <h1>SETTINGS</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/logs" className="back-button" style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid rgb(var(--text-secondary))',
                backgroundColor: 'transparent',
                color: 'rgb(var(--text-primary))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
                ← back
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* Messages */}
          {message && (
            <div style={{
              padding: '1rem',
              marginBottom: '2rem',
              border: `1px solid ${message.type === 'success' ? 'green' : 'red'}`,
              backgroundColor: message.type === 'success' ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}>
              {message.text}
            </div>
          )}

          {/* Add Repository */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>ADD REPOSITORY</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    border: '1px solid rgb(var(--text-secondary))',
                    backgroundColor: 'transparent',
                    color: 'rgb(var(--text-primary))',
                  }}
                />
                <button
                  onClick={addRepository}
                  disabled={loading || !newRepoUrl}
                  style={{
                    padding: '0.5rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    border: '1px solid rgb(var(--text-secondary))',
                    backgroundColor: 'transparent',
                    color: 'rgb(var(--text-primary))',
                    cursor: loading || !newRepoUrl ? 'not-allowed' : 'pointer',
                    opacity: loading || !newRepoUrl ? 0.5 : 1,
                  }}
                >
                  {loading ? 'adding...' : 'add →'}
                </button>
              </div>
            </div>
          </div>

          {/* Tracked Repositories */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>TRACKED REPOSITORIES</h2>
              {repositories.length === 0 ? (
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-secondary))',
                }}>
                  No repositories tracked yet. Add one above to get started.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {repositories.map(repo => (
                    <div
                      key={repo.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '1px solid rgb(var(--text-secondary) / 0.2)',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>{repo.fullName}</strong>
                        </div>
                        {repo.description && (
                          <div style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.75rem' }}>
                            {repo.description}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeRepository(repo.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          border: '1px solid rgb(var(--text-secondary))',
                          backgroundColor: 'transparent',
                          color: 'rgb(var(--text-primary))',
                          cursor: 'pointer',
                        }}
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  );
}