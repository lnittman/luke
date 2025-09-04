'use client'

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export default function InstructionsPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const [value, setValue] = useState('')
  const instructions = useQuery(api.functions.queries.settings.getHeroInstructions, {})
  const setInstructions = useMutation(api.functions.mutations.settings.setHeroInstructions)

  useEffect(() => {
    if (typeof instructions === 'string') setValue(instructions)
  }, [instructions])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await setInstructions({ instructions: value })
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
