'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

export default function InstructionsPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')

  useEffect(() => {
    fetch('/api/hero/instructions')
      .then((res) => res.json())
      .then((data) => setText(data.instructions))
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch('/api/hero/instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructions: text })
    })
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          className="border rounded p-2 text-black"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        {status === 'saved' && <p className="text-green-500">Saved!</p>}
      </form>
    </div>
  )
}
