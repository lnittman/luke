'use client'

import { Anthropic, OpenAI } from '@lobehub/icons'
import { Copy, FileText, Sparkles } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import TurndownService from 'turndown'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
    const content = document.querySelector('main') || document.body
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    return turndownService.turndown(content.innerHTML)
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={styles.trigger} aria-label="Open in AI">
          <Sparkles className={styles.icon} />
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

        <div className={styles.divider} />

        <div className={styles.label}>Open in:</div>

        <div className={styles.providerGrid}>
          {AI_PROVIDERS.map((provider) => {
            const Icon = provider.icon
            return (
              <button
                key={provider.name}
                className={styles.providerButton}
                onClick={() => handleOpenInProvider(provider)}
              >
                <Icon className={styles.icon} size={16} />
                {provider.name}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
