'use client';

import { useState, useTransition } from 'react';
import { connectGitHub, fetchGitHubRepos, toggleRepository, toggleGlobalLogs } from './actions';
import styles from '@/components/page/root.module.scss';

interface Repository {
  id: string;
  repoId: string | null;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  analysisEnabled: boolean;
  lastActivity: Date | null;
}

interface SettingsProps {
  initialSettings: {
    globalLogsEnabled: boolean;
    githubConnected: boolean;
    githubUser: string | null;
    repositories: Repository[];
  };
}

export function SettingsClient({ initialSettings }: SettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [githubToken, setGitHubToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleConnectGitHub = async () => {
    if (!githubToken) {
      setMessage({ type: 'error', text: 'Please enter a GitHub token' });
      return;
    }

    setLoading(true);
    setMessage(null);

    startTransition(async () => {
      const result = await connectGitHub(githubToken);
      if (result.success) {
        setMessage({ type: 'success', text: `Connected as ${result.username}` });
        setGitHubToken('');
        
        // Fetch repos after connecting
        const reposResult = await fetchGitHubRepos();
        if (reposResult.success) {
          setSettings(prev => ({
            ...prev,
            githubConnected: true,
            githubUser: result.username || null,
            repositories: reposResult.repos as Repository[],
          }));
          setMessage({ type: 'success', text: `Connected and found ${reposResult.repos.length} repositories` });
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to connect GitHub' });
      }
      setLoading(false);
    });
  };

  const handleRefreshRepos = async () => {
    setLoading(true);
    setMessage(null);

    startTransition(async () => {
      const result = await fetchGitHubRepos();
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          repositories: result.repos as Repository[],
        }));
        setMessage({ type: 'success', text: `Found ${result.repos.length} repositories` });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to fetch repositories' });
      }
      setLoading(false);
    });
  };

  const handleToggleRepo = async (repoId: string) => {
    const repo = settings.repositories.find(r => r.repoId === repoId);
    if (!repo) return;

    // Optimistically update UI
    setSettings(prev => ({
      ...prev,
      repositories: prev.repositories.map(r =>
        r.repoId === repoId ? { ...r, analysisEnabled: !r.analysisEnabled } : r
      ),
    }));

    startTransition(async () => {
      const result = await toggleRepository(repoId, !repo.analysisEnabled);
      if (!result.success) {
        // Revert on error
        setSettings(prev => ({
          ...prev,
          repositories: prev.repositories.map(r =>
            r.repoId === repoId ? { ...r, analysisEnabled: repo.analysisEnabled } : r
          ),
        }));
        setMessage({ type: 'error', text: 'Failed to update repository' });
      }
    });
  };

  const handleToggleGlobalLogs = async () => {
    const newValue = !settings.globalLogsEnabled;
    
    // Optimistically update UI
    setSettings(prev => ({ ...prev, globalLogsEnabled: newValue }));

    startTransition(async () => {
      const result = await toggleGlobalLogs(newValue);
      if (!result.success) {
        // Revert on error
        setSettings(prev => ({ ...prev, globalLogsEnabled: !newValue }));
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    });
  };

  const enabledRepos = settings.repositories.filter(r => r.analysisEnabled);
  const disabledRepos = settings.repositories.filter(r => !r.analysisEnabled);

  return (
    <>
      {/* Messages */}
      {message && (
        <div style={{
          padding: '1rem 24px',
          marginBottom: '2rem',
          border: `1px solid ${message.type === 'success' ? 'green' : 'red'}`,
          backgroundColor: message.type === 'success' ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}>
          {message.text}
        </div>
      )}

      {/* GitHub Connection */}
      {!settings.githubConnected ? (
        <div className={styles.row}>
          <div className={styles.column}>
            <h2>CONNECT GITHUB</h2>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: 'rgb(var(--text-secondary))',
              marginBottom: '1rem',
            }}>
              Connect your GitHub account to track repository activity
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGitHubToken(e.target.value)}
                placeholder="GitHub Personal Access Token"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  border: '1px solid rgb(var(--border))',
                  backgroundColor: 'transparent',
                  color: 'rgb(var(--text-primary))',
                }}
              />
              <button
                onClick={handleConnectGitHub}
                disabled={loading || !githubToken}
                style={{
                  padding: '0.5rem 1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  border: '1px solid rgb(var(--border))',
                  backgroundColor: 'transparent',
                  color: 'rgb(var(--text-primary))',
                  cursor: loading || !githubToken ? 'not-allowed' : 'pointer',
                  opacity: loading || !githubToken ? 0.5 : 1,
                }}
              >
                {loading ? 'connecting...' : 'connect →'}
              </button>
            </div>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'rgb(var(--text-secondary))',
              marginTop: '0.5rem',
            }}>
              Create a token at github.com/settings/tokens with &apos;repo&apos; scope
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.column}>
            <h2>GITHUB CONNECTION</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 24px',
              border: '1px solid rgb(var(--border))',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}>
              <div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Connected as {settings.githubUser}</strong>
                </div>
                <div style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.75rem' }}>
                  {settings.repositories.length} repositories available
                </div>
              </div>
              <button
                onClick={handleRefreshRepos}
                disabled={loading}
                title="Refresh repositories"
                aria-label="Refresh repositories"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  background: 'none',
                  border: '1px solid rgb(var(--border))',
                  color: 'rgb(var(--text-primary))',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'monospace',
                  padding: 0,
                  fontSize: '1rem',
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))';
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                }}
              >
                ↻
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Logs Setting */}
      <div className={styles.row}>
        <div className={styles.column}>
          <h2>GLOBAL LOGS</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 24px',
            border: '1px solid rgb(var(--border))',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}>
            <div>
              <div style={{ marginBottom: '0.25rem' }}>
                <strong>Generate Daily Activity Logs</strong>
              </div>
              <div style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.75rem' }}>
                AI-powered summaries of your development activity
              </div>
            </div>
            <button
              onClick={handleToggleGlobalLogs}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '1.75rem',
                background: settings.globalLogsEnabled ? 'rgb(var(--accent-1))' : 'rgb(var(--surface-1))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <span style={{
                position: 'absolute',
                width: '1.25rem',
                height: '1.25rem',
                background: 'rgb(var(--background-start))',
                borderRadius: '50%',
                transition: 'transform 0.2s ease',
                transform: settings.globalLogsEnabled ? 'translateX(0.75rem)' : 'translateX(-0.75rem)',
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Enabled Repositories */}
      {settings.githubConnected && (
        <>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>ENABLED REPOSITORIES ({enabledRepos.length})</h2>
              {enabledRepos.length === 0 ? (
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-secondary))',
                }}>
                  No repositories enabled. Enable repositories below to include them in logs.
                </p>
              ) : (
                <div className="space-y-0" style={{ marginTop: '0' }}>
                  {enabledRepos.map(repo => (
                    <div
                      key={repo.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 24px',
                        borderBottom: '1px solid rgb(var(--border))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1) / 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => repo.repoId && handleToggleRepo(repo.repoId)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>{repo.fullName}</strong>
                          {repo.language && (
                            <span style={{ 
                              marginLeft: '0.5rem', 
                              color: 'rgb(var(--text-secondary))',
                              fontSize: '0.75rem' 
                            }}>
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <div style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.75rem' }}>
                            {repo.description}
                          </div>
                        )}
                      </div>
                      <div style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        border: '1px solid rgb(var(--accent-1))',
                        background: 'rgb(var(--accent-1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ color: 'rgb(var(--background-start))' }}>✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Repositories */}
          {disabledRepos.length > 0 && (
            <div className={styles.row}>
              <div className={styles.column}>
                <h2>AVAILABLE REPOSITORIES ({disabledRepos.length})</h2>
                <div className="space-y-0" style={{ marginTop: '0' }}>
                  {disabledRepos.map(repo => (
                    <div
                      key={repo.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 24px',
                        borderBottom: '1px solid rgb(var(--border))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        opacity: 0.7,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1) / 0.5)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.opacity = '0.7';
                      }}
                      onClick={() => repo.repoId && handleToggleRepo(repo.repoId)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>{repo.fullName}</strong>
                          {repo.language && (
                            <span style={{ 
                              marginLeft: '0.5rem', 
                              color: 'rgb(var(--text-secondary))',
                              fontSize: '0.75rem' 
                            }}>
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <div style={{ color: 'rgb(var(--text-secondary))', fontSize: '0.75rem' }}>
                            {repo.description}
                          </div>
                        )}
                      </div>
                      <div style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        border: '1px solid rgb(var(--border))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {/* Empty checkbox */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}