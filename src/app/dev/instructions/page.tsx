'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'

export default function InstructionsPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const [value, setValue] = useState('')

  useEffect(() => {
    fetch('/api/hero/instructions')
      .then((r) => r.json())
      .then((d) => setValue(d.instructions || ''))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch('/api/hero/instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructions: value }),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="border p-2 text-black"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
        />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1">
          Save
        </button>
      </form>
      <Link href="/">Back</Link>
    </div>
  )
}
