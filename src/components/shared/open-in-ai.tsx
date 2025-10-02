'use client'

import { Copy, FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'
import TurndownService from 'turndown'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const AI_PROVIDERS = [
  {
    name: 'Claude',
    url: 'https://claude.ai/new',
    color: 'bg-[#CC9B7A]',
    textColor: 'text-white',
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    color: 'bg-[#10A37F]',
    textColor: 'text-white',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    color: 'bg-[#8E75FF]',
    textColor: 'text-white',
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    color: 'bg-[#0FA7FF]',
    textColor: 'text-white',
  },
  {
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn',
    color: 'bg-[#00D4AA]',
    textColor: 'text-white',
  },
]

export function OpenInAI() {
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  const getPageMarkdown = () => {
    // Get the main content area - adjust selector based on your page structure
    const content = document.querySelector('main') || document.body
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })

    // Convert HTML to Markdown
    const md = turndownService.turndown(content.innerHTML)
    return md
  }

  const handleCopyMarkdown = async () => {
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewMarkdown = () => {
    const md = getPageMarkdown()
    setMarkdown(md)
    setViewOpen(true)
    setOpen(false)
  }

  const handleOpenInProvider = async (provider: typeof AI_PROVIDERS[0]) => {
    // Copy markdown to clipboard
    const md = getPageMarkdown()
    await navigator.clipboard.writeText(md)

    // Open provider in new tab
    window.open(provider.url, '_blank')

    // Close popover
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sparkles className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 p-3">
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleCopyMarkdown}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy as Markdown'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleViewMarkdown}
            >
              <FileText className="h-4 w-4 mr-2" />
              View as Markdown
            </Button>

            <div className="pt-2 border-t">
              <p className="text-xs font-mono uppercase mb-2 text-muted-foreground">
                Open in:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AI_PROVIDERS.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    size="sm"
                    className={`${provider.color} ${provider.textColor} hover:opacity-90 border-none`}
                    onClick={() => handleOpenInProvider(provider)}
                  >
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Markdown Preview</DialogTitle>
            <DialogDescription>
              Page content converted to markdown
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto">
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {markdown}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
