'use client'

import { useEffect, useState } from 'react'
import TurndownService from 'turndown'
import { DefaultLayout } from '@/components/shared/default-layout'
import { BlockLoader } from '@/components/shared/block-loader'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function MarkdownPage({ params }: PageProps) {
  const [markdown, setMarkdown] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return

    // Convert slug back to path (home -> /, process -> /process, etc)
    const path = slug === 'home' ? '/' : `/${slug.replace('-', '/')}`

    // Fetch the page HTML and convert to markdown
    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const content = doc.querySelector('main') || doc.body

        const turndownService = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
        })

        const md = turndownService.turndown(content.innerHTML)
        setMarkdown(md)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch markdown:', err)
        setMarkdown('# Error\n\nFailed to load markdown preview.')
        setLoading(false)
      })
  }, [slug])

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={3} />
            <h1>{slug.toUpperCase()}.MD</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className={styles.column}>
            {loading ? (
              <p>Loading markdown...</p>
            ) : (
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'rgb(var(--text-primary))',
                }}
              >
                {markdown}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  )
}
