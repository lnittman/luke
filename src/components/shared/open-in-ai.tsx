'use client'

import { Anthropic, OpenAI } from '@lobehub/icons'
import { Copy, FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import TurndownService from 'turndown'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import styles from './open-in-ai.module.scss'

const AI_PROVIDERS = [
  {
    name: 'Claude',
    baseUrl: 'https://claude.ai/new',
    icon: Anthropic,
  },
  {
    name: 'ChatGPT',
    baseUrl: 'https://chatgpt.com',
    icon: OpenAI,
  },
]

export function OpenInAI() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const getPageMarkdown = () => {
    // Get the main content area
    const innerViewport = document.querySelector('[class*="innerViewport"]')
    const content = innerViewport || document.querySelector('main') || document.body

    // Clone the content to avoid modifying the DOM
    const clone = content.cloneNode(true) as HTMLElement

    // Remove non-content elements (loaders, navigation, etc)
    clone.querySelectorAll('[class*="loader"]').forEach(el => el.remove())
    clone.querySelectorAll('nav').forEach(el => el.remove())
    clone.querySelectorAll('button').forEach(el => el.remove())

    // Remove page header
    const headerClone = clone.querySelector('[class*="header"]')
    if (headerClone) headerClone.remove()

    // Remove page footer
    const footerClone = clone.querySelector('[class*="footer"]')
    if (footerClone) footerClone.remove()

    // Handle accordions - convert visible sections to headings
    const accordions = clone.querySelectorAll('[class*="accordion"]')
    const closedSections: string[] = []

    accordions.forEach(accordion => {
      const title = accordion.querySelector('[class*="title"]')?.textContent || ''
      const contentDiv = accordion.querySelector('[class*="content"]')

      if (contentDiv) {
        // Accordion is open - include it with heading
        const replacement = document.createElement('div')
        const heading = document.createElement('h2')
        heading.textContent = title
        replacement.appendChild(heading)
        replacement.appendChild(contentDiv.cloneNode(true) as Node)
        accordion.replaceWith(replacement)
      } else {
        // Accordion is closed - track it and remove
        closedSections.push(title)
        accordion.remove()
      }
    })

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
    })

    let markdown = turndownService.turndown(clone.innerHTML)

    // Add note about closed sections if any
    if (closedSections.length > 0) {
      markdown += '\n\n---\n\n*Note: The following sections were closed and not included: ' + closedSections.join(', ') + '*'
    }

    return markdown
  }

  const handleCopyMarkdown = async () => {
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewMarkdown = () => {
    const md = getPageMarkdown()

    // Create a new window/tab with clean markdown display
    const markdownWindow = window.open('', '_blank')
    if (markdownWindow) {
      const pageName = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean).join('-')
      markdownWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${pageName}.md</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: monospace; background-color: #fff; color: #000;">
            <pre style="margin: 0; padding: 1rem; white-space: pre-wrap; word-break: break-word; font-size: 14px; line-height: 1.6;">${md}</pre>
          </body>
        </html>
      `)
      markdownWindow.document.close()
    }
    setOpen(false)
  }

  const handleOpenInProvider = async (provider: typeof AI_PROVIDERS[0]) => {
    const md = getPageMarkdown()
    const pageName = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean).join(' / ')

    const prompt = `Here's a page from Luke Nittmann's personal website (lukenittmann.com).

Page: ${pageName}

Content:

${md}

Please help me understand what this page is about and what Luke is communicating here.`

    // Build URL with query parameters based on provider
    let url = provider.baseUrl

    if (provider.name === 'ChatGPT') {
      // ChatGPT uses q parameter for pre-filled prompt
      const params = new URLSearchParams({ q: prompt })
      url = `${provider.baseUrl}?${params.toString()}`
    } else if (provider.name === 'Claude') {
      // Claude AI doesn't support URL parameters for prefilled prompts
      // Copy to clipboard as fallback
      await navigator.clipboard.writeText(prompt)
    }

    window.open(url, '_blank')
    setOpen(false)
  }

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={styles.trigger} aria-label="Open in AI">
            <span>✦</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className={styles.popover}>
          <button className={styles.button} onClick={handleCopyMarkdown}>
            <Copy className={styles.icon} />
            {copied ? 'Copied!' : 'Copy as Markdown'}
          </button>

          <button className={styles.button} onClick={handleViewMarkdown}>
            <FileText className={styles.icon} />
            View as Markdown
          </button>

          <div className={styles.labelRow}>
            <div className={styles.label}>Open in:</div>
            <div className={styles.providerGrid}>
              {AI_PROVIDERS.map((provider) => {
                const Icon = provider.icon
                return (
                  <Tooltip key={provider.name}>
                    <TooltipTrigger asChild>
                      <button
                        className={styles.providerButton}
                        onClick={() => handleOpenInProvider(provider)}
                      >
                        <Icon size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={styles.tooltip}>
                      {provider.name}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
