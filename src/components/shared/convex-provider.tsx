'use client'

import type { ReactNode } from 'react'
import { ConvexProvider } from 'convex/react'
import { convex } from '@/lib/convex'

export function AppConvexProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}

