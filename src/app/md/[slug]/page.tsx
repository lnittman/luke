'use client'

import { useEffect, useState } from 'react'
import TurndownService from 'turndown'

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

  if (loading) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{slug}.md</title>
        </head>
        <body style={{ margin: 0, padding: 0, fontFamily: 'monospace' }}>
          <pre style={{ margin: 0, padding: '1rem', whiteSpace: 'pre-wrap' }}>
            Loading markdown...
          </pre>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{slug}.md</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'monospace', backgroundColor: '#fff', color: '#000' }}>
        <pre style={{ margin: 0, padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.6' }}>
          {markdown}
        </pre>
      </body>
    </html>
  )
}
