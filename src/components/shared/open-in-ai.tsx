'use client'

import { Anthropic, OpenAI } from '@lobehub/icons'
import { Copy, FileText } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
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
    url: 'https://claude.ai/new',
    icon: Anthropic,
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: OpenAI,
  },
]

export function OpenInAI() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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
    clone.querySelectorAll('header').forEach(el => el.remove())
    clone.querySelectorAll('footer').forEach(el => el.remove())

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
    })

    return turndownService.turndown(clone.innerHTML)
  }

  const handleCopyMarkdown = async () => {
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewMarkdown = () => {
    // Get page name from pathname, default to 'page' if root
    const pageName = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean).join('-')
    router.push(`/${pageName}.md`)
    setOpen(false)
  }

  const handleOpenInProvider = async (provider: typeof AI_PROVIDERS[0]) => {
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)
    window.open(provider.url, '_blank')
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
