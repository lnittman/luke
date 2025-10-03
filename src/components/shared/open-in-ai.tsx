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

  const openAllAccordions = async () => {
    const closedAccordions = document.querySelectorAll('button[aria-expanded="false"]')

    closedAccordions.forEach(button => {
      if (button instanceof HTMLElement) {
        button.click()
      }
    })

    // Wait for React state updates and DOM to render
    if (closedAccordions.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  const getPageMarkdown = () => {
    // Get the main content area - look for innerViewport first, then content
    const innerViewport = document.querySelector('[class*="innerViewport"]')
    const content = innerViewport || document.querySelector('main') || document.body

    // Clone the content to avoid modifying the DOM
    const clone = content.cloneNode(true) as HTMLElement

    // Remove non-content elements (loaders, navigation, etc)
    clone.querySelectorAll('[class*="loader"]').forEach(el => el.remove())
    clone.querySelectorAll('nav').forEach(el => el.remove())
    clone.querySelectorAll('button').forEach(el => el.remove())

    // Remove the page header (not headers inside content)
    const pageHeader = document.querySelector('[class*="header"]')
    if (pageHeader) {
      const headerClone = clone.querySelector('[class*="header"]')
      if (headerClone) headerClone.remove()
    }

    // Remove the page footer (not footers inside content)
    const pageFooter = document.querySelector('[class*="footer"]')
    if (pageFooter) {
      const footerClone = clone.querySelector('[class*="footer"]')
      if (footerClone) footerClone.remove()
    }

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
    })

    return turndownService.turndown(clone.innerHTML)
  }

  const handleCopyMarkdown = async () => {
    await openAllAccordions()
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewMarkdown = async () => {
    await openAllAccordions()
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
    await openAllAccordions()
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
