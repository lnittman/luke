# Next.js Project Initialization Guide 2025

> Comprehensive guide for initializing modern Next.js applications with AI capabilities, edge deployment, and best practices

## Table of Contents
- [Development Environment](#development-environment)
- [Project Setup](#project-setup)
- [Core Configuration](#core-configuration)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Testing Setup](#testing-setup)
- [CI/CD Integration](#cicd-integration)
- [Setup Cards](#setup-cards)

## Development Environment

### Prerequisites
- Node.js 20.0+
- PNPM 8.0+
- VS Code with recommended extensions

### Initial Setup
```bash
# Install or update PNPM
corepack enable
corepack prepare pnpm@latest --activate

# Create new Next.js project
pnpm create next-app@canary my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project
cd my-ai-app

# Initialize Prisma
pnpm prisma init

# Install core dependencies
pnpm add @vercel/ai ai openai @vercel/analytics @vercel/kv
pnpm add @vercel/blob @neondatabase/serverless @vercel/postgres
pnpm add @prisma/client @prisma/adapter-neon zod
pnpm add swr zustand jotai @vercel/speed-insights
pnpm add framer-motion @radix-ui/react-* class-variance-authority
pnpm add clsx tailwind-merge lucide-react

# Install dev dependencies
pnpm add -D prisma typescript @types/node @types/react @types/react-dom
pnpm add -D @biomejs/biome eslint-config-next
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jest @types/jest jest-environment-jsdom
```

## Project Setup

### Next.js Configuration
```typescript
// next.config.mjs
import { withAxiom } from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      '@headlessui/react',
      '@heroicons/react',
      'framer-motion',
      '@radix-ui/react-*',
    ],
  },
}

export default withAxiom(nextConfig)
```

### Environment Setup
```bash
# .env.local
DATABASE_URL="postgres://..."
OPENAI_API_KEY="sk-..."
OPENROUTER_API_KEY="..."
KV_URL="..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
BLOB_READ_WRITE_TOKEN="..."
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
```

## Setup Cards

### Card 1: Next.js Base Setup
```bash
# Initialize project
pnpm create next-app@canary my-ai-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-ai-app

# Add core dependencies
pnpm add @vercel/ai ai openai
pnpm add swr zustand jotai
pnpm add @vercel/analytics @vercel/speed-insights

# Add development dependencies
pnpm add -D @biomejs/biome
pnpm add -D @testing-library/react @testing-library/jest-dom
```

### Card 2: Database & Storage Setup
```bash
# Install dependencies
pnpm add @vercel/postgres @vercel/kv @prisma/client

# Initialize Prisma
pnpm prisma init

# Add schema
cat << EOF > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
EOF

# Generate client
pnpm prisma generate
```

### Card 3: State Management Setup
```typescript
// lib/stores/app-store.ts
import { create } from 'zustand'
import { atom } from 'jotai'

// Zustand store
interface AppState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}))

// Jotai atoms
export const userAtom = atom({
  id: '',
  email: '',
})

export const themeAtom = atom('light')
```

### Card 4: Data Fetching Setup
```typescript
// lib/fetchers.ts
import useSWR from 'swr'
import { kv } from '@vercel/kv'
import { sql } from '@vercel/postgres'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

export async function getKVData(key: string) {
  return kv.get(key)
}

export async function queryDB() {
  return sql`SELECT * FROM users`
}
```

### Card 5: AI Integration Setup
```typescript
// lib/ai-config.ts
import { Configuration } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createChatStream(messages: any[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages,
      stream: true,
    }),
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

### Card 6: Testing Setup
```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)

// jest.setup.ts
import '@testing-library/jest-dom'
import { server } from './src/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Card 7: Performance Monitoring
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
```

## Best Practices

1. **Project Structure**
   - Use feature-based organization
   - Keep components atomic
   - Separate business logic
   - Maintain type safety

2. **State Management**
   - Use Zustand for global state
   - Use Jotai for atomic state
   - Implement proper persistence
   - Handle loading states

3. **Data Fetching**
   - Use SWR for client data
   - Implement proper caching
   - Handle error states
   - Use suspense boundaries

4. **Testing**
   - Write unit tests
   - Use integration tests
   - Mock external services
   - Test edge cases

5. **Performance**
   - Monitor with Speed Insights
   - Use proper caching
   - Optimize bundle size
   - Implement proper logging

## Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [SWR Documentation](https://swr.vercel.app)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Jotai Documentation](https://jotai.org)

### Tools and SDKs
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel KV Dashboard](https://vercel.com/dashboard/stores)
- [Vercel Postgres Dashboard](https://vercel.com/dashboard/postgres)
- [Speed Insights Dashboard](https://vercel.com/speed-insights)

### Community Resources
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Vercel AI SDK GitHub](https://github.com/vercel/ai)
- [Next.js Discord](https://discord.gg/nextjs)
- [Vercel Templates](https://vercel.com/templates)

---

*Note: Keep this document updated with the latest versions and best practices. Always check the official documentation for the most recent changes.*
