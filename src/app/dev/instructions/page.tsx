'use client'

import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { useEffect, useState } from 'react'

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
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <textarea
          className="border p-2 text-black"
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          value={value}
        />
        <button className="bg-blue-500 px-2 py-1 text-white" type="submit">
          Save
        </button>
      </form>
      <Link href="/">Back</Link>
    </div>
  )
}
