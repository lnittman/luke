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
    // Store original accordion states
    const accordionButtons = Array.from(document.querySelectorAll('[class*="accordion"] button[aria-expanded]'))
    const originalStates = accordionButtons.map(btn => btn.getAttribute('aria-expanded') === 'true')

    // Open all accordions temporarily by clicking closed ones
    accordionButtons.forEach((btn, idx) => {
      if (!originalStates[idx]) {
        (btn as HTMLButtonElement).click()
      }
    })

    // Get content after opening (synchronous - React will have updated the DOM)
    const innerViewport = document.querySelector('[class*="innerViewport"]')
    const content = innerViewport || document.querySelector('main') || document.body
    const clone = content.cloneNode(true) as HTMLElement

    // Remove non-content elements
    clone.querySelectorAll('[class*="loader"]').forEach(el => el.remove())
    clone.querySelectorAll('nav').forEach(el => el.remove())
    clone.querySelectorAll('button').forEach(el => el.remove())

    const headerClone = clone.querySelector('[class*="header"]')
    if (headerClone) headerClone.remove()

    const footerClone = clone.querySelector('[class*="footer"]')
    if (footerClone) footerClone.remove()

    // Convert accordions to headings
    const accordions = clone.querySelectorAll('[class*="accordion"]')
    accordions.forEach(accordion => {
      const title = accordion.querySelector('[class*="title"]')?.textContent || ''
      const contentDiv = accordion.querySelector('[class*="content"]')

      if (contentDiv) {
        const replacement = document.createElement('div')
        const heading = document.createElement('h2')
        heading.textContent = title
        replacement.appendChild(heading)
        replacement.appendChild(contentDiv.cloneNode(true) as Node)
        accordion.replaceWith(replacement)
      }
    })

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
    })

    const markdown = turndownService.turndown(clone.innerHTML)

    // Restore original accordion states
    accordionButtons.forEach((btn, idx) => {
      if (!originalStates[idx]) {
        (btn as HTMLButtonElement).click()
      }
    })

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

    const prompt = `You are helping someone learn about Luke Nittmann, a software engineer and product builder.

Below is content from the "${pageName}" page of Luke's personal website (lukenittmann.com). Your task is to:

1. Explain what this page reveals about Luke - his background, skills, interests, philosophy, and approach to building software
2. Highlight key insights about how Luke works, thinks, and builds products
3. If technical patterns or tools are mentioned, explain what they tell us about Luke's development style
4. Make this engaging and conversational - help the reader understand who Luke is through the content

Page: ${pageName}

Content:

${md}

---

Based on the content above, tell me about Luke Nittmann. What stands out about his approach, experience, and perspective?`

    // Copy prompt to clipboard first (since URLs have length limits)
    await navigator.clipboard.writeText(prompt)

    // Open the AI provider (prompt is in clipboard, ready to paste)
    window.open(provider.baseUrl, '_blank')

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
                      {provider.name} (copies prompt)
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
