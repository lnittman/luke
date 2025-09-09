'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './log-accordion.module.scss'

export interface LogItem {
  id: string
  date: string
  title: string
  summary: string
  haiku: string | null
  bullets: string[]
  totalCommits: number
  totalRepos: number
  productivityScore: number
  version: number
  createdAt: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function LogAccordion({ log, defaultOpen = false }: { log: LogItem, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const firstLine = (log.summary || '').split('\n')[0]
  return (
    <div className={styles.accordion}>
      <button aria-expanded={isOpen} className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine}>
            <span className={styles.emoji}>✦</span>
            <Link className={styles.name} href={`/logs/${log.id}`} onClick={(e) => e.stopPropagation()}>
              {log.title}
            </Link>
          </div>
          <div className={styles.description}>
            <time style={{ marginRight: '0.75rem' }}>{formatDate(log.date)}</time>
            {firstLine}
          </div>
        </div>
        <div className={styles.actions}>
          <span className={styles.arrow}>{isOpen ? '▾' : '▸'}</span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.content}>
          {log.haiku && (
            <pre style={{ fontFamily: 'monospace', fontSize: '.875rem', color: 'rgb(var(--accent-2))', margin: '0 0 1rem 0', fontStyle: 'italic', lineHeight: 1.6 }}>{log.haiku}</pre>
          )}

          <p style={{ fontSize: '.875rem', lineHeight: 1.6, margin: 0 }}>{log.summary}</p>

          <div className={styles.metrics}>
            <div>
              <span style={{ color: 'rgb(var(--text-secondary))' }}>commits: </span>
              <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalCommits}</span>
            </div>
            <div>
              <span style={{ color: 'rgb(var(--text-secondary))' }}>repos: </span>
              <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalRepos}</span>
            </div>
            <div>
              <span style={{ color: 'rgb(var(--text-secondary))' }}>productivity: </span>
              <span style={{ color: 'rgb(var(--accent-2))' }}>{'█'.repeat(log.productivityScore)}{'░'.repeat(10 - log.productivityScore)}</span>
            </div>
          </div>

          {log.bullets?.length > 0 && (
            <div className={styles.section}>
              <h3>HIGHLIGHTS</h3>
              <ul>
                {log.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}

          <div className={styles.buttons}>
            <Link className={styles.link} href={`/logs/${log.id}`} onClick={(e) => e.stopPropagation()}>OPEN DETAILS</Link>
          </div>
        </div>
      )}
    </div>
  )
}

