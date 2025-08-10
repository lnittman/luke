'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import { BlockLoader } from '@/components/shared/block-loader'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import styles from '@/components/shared/root.module.scss'
import type { ActivityDetail } from '@/lib/db'

export default function SuggestionPage() {
  const params = useParams()
  const router = useRouter()
  const [suggestion, setSuggestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchSuggestion()
  }, [params.id])

  const fetchSuggestion = async () => {
    try {
      const response = await fetch(`/api/logs/suggestions/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch suggestion')
      const data = await response.json()
      setSuggestion(data)
    } catch (error) {
      console.error('Error fetching suggestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyPrompt = async () => {
    if (suggestion?.metadata?.prompt) {
      await navigator.clipboard.writeText(suggestion.metadata.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'rgb(var(--accent-2))'
      case 'high': return 'rgb(var(--accent-1))'
      case 'medium': return 'rgb(var(--text-primary))'
      case 'low': return 'rgb(var(--text-secondary))'
      default: return 'rgb(var(--text-secondary))'
    }
  }

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case 'minutes': return '< 1 hour'
      case 'hours': return '2-8 hours'
      case 'days': return '1-3 days'
      case 'weeks': return '1+ weeks'
      default: return effort
    }
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className={styles.header}>
          <div className={styles.column}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BlockLoader mode={2} />
              <h1>SUGGESTION</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              fontFamily: 'monospace',
              color: 'rgb(var(--text-secondary))',
            }}>
              loading suggestion...
            </div>
          </div>
        </div>
        <FooterNavigation />
      </DefaultLayout>
    )
  }

  if (!suggestion) {
    return (
      <DefaultLayout>
        <div className={styles.header}>
          <div className={styles.column}>
            <h1>SUGGESTION NOT FOUND</h1>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport}>
            <Link href="/logs" style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgb(var(--border))',
              textDecoration: 'none',
              color: 'rgb(var(--text-primary))',
              fontFamily: 'monospace',
            }}>
              ← Back to Logs
            </Link>
          </div>
        </div>
        <FooterNavigation />
      </DefaultLayout>
    )
  }

  const meta = suggestion.metadata?.suggestion || suggestion.metadata || {}

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>SUGGESTION</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* Back navigation */}
          <Link 
            href="/logs"
            style={{
              display: 'inline-block',
              marginBottom: '2rem',
              color: 'rgb(var(--text-secondary))',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-primary))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-secondary))'
            }}
          >
            ← Back to Logs
          </Link>

          {/* Suggestion header */}
          <div style={{
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgb(var(--border))',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontFamily: 'monospace',
            }}>
              {suggestion.title}
            </h2>

            {/* Metadata badges */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid rgb(var(--border))',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}>
                {meta.category || 'general'}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid',
                borderColor: getPriorityColor(meta.priority || 'medium'),
                color: getPriorityColor(meta.priority || 'medium'),
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}>
                {meta.priority || 'medium'} priority
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid rgb(var(--border))',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}>
                Est: {getEffortLabel(meta.estimatedEffort || 'hours')}
              </span>
            </div>

            {/* Rationale */}
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: 'rgb(var(--text-secondary))',
            }}>
              {suggestion.description || meta.rationale}
            </p>
          </div>

          {/* Dependencies */}
          {meta.dependencies && meta.dependencies.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: 'monospace',
              }}>
                Dependencies
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
              }}>
                {meta.dependencies.map((dep: string, i: number) => (
                  <li key={i} style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                    marginBottom: '0.25rem',
                  }}>
                    • {dep}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Context files */}
          {meta.contextFiles && meta.contextFiles.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: 'monospace',
              }}>
                Relevant Files
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                {meta.contextFiles.map((file: string, i: number) => (
                  <code key={i} style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgb(var(--surface-1))',
                    border: '1px solid rgb(var(--border))',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}>
                    {file}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* AI Prompt */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}>
                AI Assistant Prompt
              </h3>
              <button
                onClick={copyPrompt}
                style={{
                  padding: '0.5rem 1rem',
                  background: copied ? 'rgb(var(--accent-1))' : 'transparent',
                  border: '1px solid rgb(var(--border))',
                  color: copied ? 'rgb(var(--background-start))' : 'rgb(var(--text-primary))',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <pre style={{
              padding: '1.5rem',
              background: 'rgb(var(--surface-1))',
              border: '1px solid rgb(var(--border))',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
              {meta.prompt || 'No prompt available'}
            </pre>
          </div>

          {/* Related commits */}
          {meta.relatedCommits && meta.relatedCommits.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: 'monospace',
              }}>
                Related Commits
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                {meta.relatedCommits.map((sha: string, i: number) => (
                  <code key={i} style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgb(var(--surface-1))',
                    border: '1px solid rgb(var(--border))',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}>
                    {sha}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterNavigation />
    </DefaultLayout>
  )
}