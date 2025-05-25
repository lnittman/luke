'use client'

import { useEffect, useState } from 'react'

export function Hero() {
  const [text, setText] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/hero', { signal: controller.signal }).then(async (res) => {
      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) setText((t) => t + decoder.decode(value))
      }
    })
    return () => controller.abort()
  }, [])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-2xl w-full text-left font-mono p-4 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  )
}
