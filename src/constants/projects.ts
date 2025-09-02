export interface Project {
  id: string
  name: string
  emoji: string
  description: string
  demoUrl?: string
  appUrl?: string
  sourceUrl: string
  videos?: { src: string; title: string }[]
  content: {
    overview: {
      title: string
      items: string[]
    }
    core: {
      title: string
      items: string[]
    }
    architecture: {
      title: string
      items: string[]
    }
    tech: {
      title: string
      items: (string | { name: string; documentationUrl: string })[]
    }
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'radar',
    name: 'radar',
    emoji: '📡',
    description: 'ping generation platform',
    appUrl: 'https://radar-xyz.vercel.app',
    sourceUrl: 'https://github.com/lnittman/radar',
    content: {
      overview: {
        title: 'overview',
        items: [
          'allows users to schedule agentic research tasks with configurable frequency (hourly, daily, weekly)',
          'generates human-friendly reports based on user radar configurations',
          'features a generative form UI on the homepage for intuitive radar creation',
          'native iOS app with SwiftUI and real-time synchronization',
        ],
      },
      core: {
        title: 'core',
        items: [
          'Hono API on Cloudflare Workers for edge computing',
          'Inngest background job scheduling for automated ping generation',
          'Mastra AI workflows with multi-agent orchestration',
          'real-time streaming interpretations with Server-Sent Events',
          'Stripe subscription management with usage-based billing',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo architecture',
          'Next.js 15 with React 19 and App Router',
          'Hono + Cloudflare Workers backend',
          'PostgreSQL (Neon) with Drizzle ORM for type-safe queries',
          'native iOS app with Swift Package Manager architecture',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          { name: 'React 19', documentationUrl: 'https://react.dev' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          {
            name: 'Tailwind CSS v4',
            documentationUrl: 'https://tailwindcss.com',
          },
          { name: 'Hono', documentationUrl: 'https://hono.dev' },
          { name: 'Cloudflare Workers', documentationUrl: 'https://workers.cloudflare.com' },
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          { name: 'Drizzle ORM', documentationUrl: 'https://orm.drizzle.team' },
          {
            name: 'PostgreSQL (Neon)',
            documentationUrl: 'https://neon.tech',
          },
          { name: 'Clerk', documentationUrl: 'https://clerk.com' },
          { name: 'Inngest', documentationUrl: 'https://inngest.com' },
          { name: 'Stripe', documentationUrl: 'https://stripe.com' },
          { name: 'OpenRouter', documentationUrl: 'https://openrouter.ai' },
          { name: 'Jotai', documentationUrl: 'https://jotai.org' },
          { name: 'SWR', documentationUrl: 'https://swr.vercel.app' },
          { name: 'Framer Motion', documentationUrl: 'https://www.framer.com/motion' },
          { name: 'PostHog', documentationUrl: 'https://posthog.com' },
          { name: 'Upstash Redis', documentationUrl: 'https://upstash.com' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          { name: 'pnpm workspaces', documentationUrl: 'https://pnpm.io/workspaces' },
          { name: 'SwiftUI', documentationUrl: 'https://developer.apple.com/xcode/swiftui' },
          { name: 'Vercel', documentationUrl: 'https://vercel.com' },
          { name: 'Biome', documentationUrl: 'https://biomejs.dev' },
        ],
      },
    },
  },
  {
    id: 'yuba',
    name: 'yuba',
    emoji: '🏔️',
    description: 'outdoor adventure guide',
    appUrl: 'https://yuba-xyz.vercel.app',
    sourceUrl: 'https://github.com/lnittman/yuba-xyz',
    content: {
      overview: {
        title: 'overview',
        items: [
          'conversational AI for natural outdoor activity discovery',
          'personalized difficulty ratings based on fitness level',
          'multi-activity support (hiking, biking, climbing, camping)',
          'real-time trip interpretation with streaming UI',
        ],
      },
      core: {
        title: 'core',
        items: [
          'Mastra framework with specialized outdoor agents',
          'AI-powered trip interpretation and suggestion engine',
          'location-aware search with coordinates and semantic matching',
          'progressive disclosure UI with smooth state transitions',
          'Clerk authentication with row-level security',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo with 20+ shared packages',
          'Next.js 15 with React Server Components',
          'Mastra AI orchestration for outdoor agents',
          'PostgreSQL with pgvector for semantic search',
          'modular services layer with clean separation',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          { name: 'React 19', documentationUrl: 'https://react.dev' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          {
            name: 'Tailwind CSS v4',
            documentationUrl: 'https://tailwindcss.com',
          },
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          {
            name: 'PostgreSQL',
            documentationUrl: 'https://www.postgresql.org',
          },
          {
            name: 'pgvector',
            documentationUrl: 'https://github.com/pgvector/pgvector',
          },
          { name: 'Clerk', documentationUrl: 'https://clerk.com' },
          { name: 'Jotai', documentationUrl: 'https://jotai.org' },
          { name: 'SWR', documentationUrl: 'https://swr.vercel.app' },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion',
          },
          { name: 'OpenRouter', documentationUrl: 'https://openrouter.ai' },
          { name: 'Mapbox GL', documentationUrl: 'https://docs.mapbox.com/mapbox-gl-js' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          { name: 'pnpm workspaces', documentationUrl: 'https://pnpm.io/workspaces' },
          { name: 'Radix UI', documentationUrl: 'https://www.radix-ui.com' },
          { name: 'PostHog', documentationUrl: 'https://posthog.com' },
          { name: 'Vercel', documentationUrl: 'https://vercel.com' },
          { name: 'Biome', documentationUrl: 'https://biomejs.dev' },
        ],
      },
    },
  },
  {
    id: 'webs-xyz',
    name: 'webs',
    emoji: '🌐',
    description: 'internet research agent',
    appUrl: 'https://webs-xyz.vercel.app',
    sourceUrl: 'https://github.com/lnittman/webs-xyz',
    content: {
      overview: {
        title: 'overview',
        items: [
          'intelligent content analysis replacing traditional browsing',
          'organized workspaces (Spaces) with custom settings',
          'real-time streaming responses with progressive UI updates',
          'collaborative research with shared insights and annotations',
        ],
      },
      core: {
        title: 'core',
        items: [
          'multi-URL batch analysis with parallel processing',
          'context-aware chat conversations about analyzed content',
          'automated charts and data visualizations',
          'knowledge graph visualization of URL relationships',
          'mobile-first PWA with offline capabilities',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo with 14+ shared packages',
          'Next.js 15 with React Server Components',
          'Convex backend for real-time data',
          'Server-Sent Events for streaming responses',
          'Clerk auth with row-level security',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          { name: 'React 19', documentationUrl: 'https://react.dev' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          {
            name: 'Tailwind CSS v4',
            documentationUrl: 'https://tailwindcss.com',
          },
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          {
            name: 'PostgreSQL',
            documentationUrl: 'https://www.postgresql.org',
          },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          {
            name: 'Server-Sent Events',
            documentationUrl:
              'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events',
          },
          { name: 'Jotai', documentationUrl: 'https://jotai.org' },
          { name: 'SWR', documentationUrl: 'https://swr.vercel.app' },
          { name: 'Clerk', documentationUrl: 'https://clerk.com' },
          { name: 'PostHog', documentationUrl: 'https://posthog.com' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          {
            name: 'pnpm workspaces',
            documentationUrl: 'https://pnpm.io/workspaces',
          },
        ],
      },
    },
  },
  {
    id: 'arbor',
    name: 'arbor',
    emoji: '🌳',
    description: 'LLM chat with projects and artifacts',
    appUrl: 'https://arbor-xyz.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/arbor',
    content: {
      overview: {
        title: 'overview',
        items: [
          'production-ready chat framework with cross-platform deployment',
          'multi-agent orchestration through Mastra framework',
          'Model Context Protocol (MCP) tool integration',
          'native iOS and desktop applications via Tauri',
        ],
      },
      core: {
        title: 'core',
        items: [
          'dynamic MCP tool injection for GitHub, Gmail, web scraping',
          'project-based chat organization with PostgreSQL persistence',
          'real-time streaming with tool call visualization',
          'multi-model support (Claude, GPT-4, Gemini)',
          'comprehensive auth with Clerk integration',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo with separate chat microservice',
          'Next.js 15 App Router with React Server Components',
          'Convex backend with native agents and workflows',
          'shared design system and component library',
          'production-ready logging and error handling',
        ],
      },
      tech: {
        title: 'stack',
        items: [
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Convex', documentationUrl: 'https://convex.dev' },
          { name: 'Convex Agents', documentationUrl: 'https://docs.convex.dev/agents' },
          { name: 'MCP', documentationUrl: 'https://modelcontextprotocol.io' },
          { name: 'Clerk Auth', documentationUrl: 'https://clerk.com' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          { name: 'Tauri', documentationUrl: 'https://tauri.app' },
          {
            name: 'Vercel AI SDK',
            documentationUrl: 'https://sdk.vercel.ai/docs',
          },
          {
            name: 'Tailwind CSS v4',
            documentationUrl: 'https://tailwindcss.com',
          },
          { name: 'Radix UI', documentationUrl: 'https://www.radix-ui.com' },
        ],
      },
    },
  },
  {
    id: 'voet',
    name: 'voet',
    emoji: '⚽️',
    description:
      'football intelligence platform with real-time data orchestration',
    demoUrl: 'https://voet-xyz.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/voet',
    content: {
      overview: {
        title: 'overview',
        items: [
          'football data platform aggregating multi-league statistics',
          'distributed data pipeline with entity extraction and linking',
          'real-time streaming chat with contextual football knowledge',
          'automated news summarization and match report generation',
        ],
      },
      core: {
        title: 'core',
        items: [
          'AI-powered workflows for intelligent data processing',
          'multi-stage extraction pipelines with schema validation',
          'entity recognition linking players, teams, and matches',
          'distributed cron orchestration for real-time updates',
          'structured data extraction from unstructured web content',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'Turborepo monorepo with Next.js 15 microservices',
          'Hono API on Cloudflare Workers for data ingestion',
          'PostgreSQL with Prisma ORM for complex entity relationships',
          'event-driven architecture with job queue processing',
          'Firecrawl web scraping with intelligent content parsing',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Hono', documentationUrl: 'https://hono.dev' },
          { name: 'Cloudflare Workers', documentationUrl: 'https://workers.cloudflare.com' },
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          { name: 'NeonDB', documentationUrl: 'https://neon.tech' },
          { name: 'OpenRouter', documentationUrl: 'https://openrouter.ai' },
          { name: 'Firecrawl', documentationUrl: 'https://firecrawl.dev' },
          { name: 'Clerk Auth', documentationUrl: 'https://clerk.com' },
          { name: 'PostHog', documentationUrl: 'https://posthog.com' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Zod', documentationUrl: 'https://zod.dev' },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion',
          },
        ],
      },
    },
  },
  {
    id: 'ther',
    name: 'ther',
    emoji: '🌸',
    description: 'empathetic mental wellness companion',
    demoUrl: 'https://ther-app.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/ther',
    content: {
      overview: {
        title: 'overview',
        items: [
          'supportive conversations for mental wellness',
          'personalized chat experience with contextual suggestions',
          'thoughtful design centered on empathy',
          'subscription-based access with flexible payment options',
        ],
      },
      core: {
        title: 'core',
        items: [
          'empathetic conversation system',
          'adaptive suggestion engine',
          'mental wellness content curation',
          'biometric authentication',
          'secure subscription management',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'next.js app with prisma ORM',
          'Convex backend for real-time chat',
          'cross-platform with tauri',
          'iOS native support',
          'stripe payment integration',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js', documentationUrl: 'https://nextjs.org' },
          { name: 'React 19', documentationUrl: 'https://react.dev' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Tailwind CSS', documentationUrl: 'https://tailwindcss.com' },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion',
          },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          {
            name: 'PostgreSQL',
            documentationUrl: 'https://www.postgresql.org',
          },
          { name: 'Gemini API', documentationUrl: 'https://ai.google.dev' },
          { name: 'Stripe', documentationUrl: 'https://stripe.com/docs' },
          { name: 'Tauri', documentationUrl: 'https://tauri.app' },
          { name: 'iOS', documentationUrl: 'https://developer.apple.com/ios' },
          {
            name: 'macOS',
            documentationUrl: 'https://developer.apple.com/macos',
          },
          { name: 'Rust', documentationUrl: 'https://www.rust-lang.org' },
          { name: 'Zustand', documentationUrl: 'https://zustand-demo.pmnd.rs' },
          { name: 'Zod', documentationUrl: 'https://zod.dev' },
          { name: 'SWR', documentationUrl: 'https://swr.vercel.app' },
          { name: 'Vercel', documentationUrl: 'https://vercel.com' },
        ],
      },
    },
  },
  {
    id: 'loops',
    name: 'loops',
    emoji: '∞',
    description: 'stem player for your music',
    demoUrl: 'https://loops-app.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/loops',
    content: {
      overview: {
        title: 'overview',
        items: [
          'audio stem separation engine',
          'interactive loop control interface',
          'real-time audio manipulation',
          'modern, minimalist UI design',
          'mobile-responsive audio workstation',
        ],
      },
      core: {
        title: 'core',
        items: [
          'advanced stem isolation (vocals, drums, bass, other)',
          'precise loop control with customizable segments',
          'dynamic tempo and playback rate adjustment',
          'individual stem volume and mute controls',
          'audio export and sharing capabilities',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'client-side audio processing engine',
          'Web Audio API with custom scheduling',
          'Python/FastAPI backend for stem separation',
          'Docker containerized audio processing',
          'efficient audio file streaming and caching',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js', documentationUrl: 'https://nextjs.org' },
          { name: 'React', documentationUrl: 'https://react.dev' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Tailwind CSS', documentationUrl: 'https://tailwindcss.com' },
          { name: 'Tone.js', documentationUrl: 'https://tonejs.github.io' },
          {
            name: 'Web Audio API',
            documentationUrl:
              'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
          },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion',
          },
          {
            name: 'Spleeter',
            documentationUrl: 'https://github.com/deezer/spleeter',
          },
          { name: 'FastAPI', documentationUrl: 'https://fastapi.tiangolo.com' },
          { name: 'Python', documentationUrl: 'https://www.python.org' },
          { name: 'Docker', documentationUrl: 'https://www.docker.com' },
          {
            name: 'Vercel KV',
            documentationUrl: 'https://vercel.com/storage/kv',
          },
          {
            name: 'Vercel Blob Storage',
            documentationUrl: 'https://vercel.com/storage/blob',
          },
          { name: 'Zustand', documentationUrl: 'https://zustand-demo.pmnd.rs' },
          { name: 'Railway', documentationUrl: 'https://railway.app' },
        ],
      },
    },
  },
  {
    id: 'cards',
    name: 'cards',
    emoji: '💼',
    description: 'professional identity and career platform',
    appUrl: 'https://cards-xyz.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/cards',
    content: {
      overview: {
        title: 'overview',
        items: [
          'intelligent job application tracking system',
          'multi-model cover letter generation and job matching',
          'advanced context management for coherent responses',
          'customizable workflow automation for job applications',
        ],
      },
      core: {
        title: 'core',
        items: [
          'multi-LLM architecture with provider abstraction',
          'embedding-based job-resume matching',
          'automated application workflows',
          'context-aware prompt engineering',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'next.js app router with RSC',
          'vercel edge runtime optimization',
          'vector embeddings with pgvector',
          'Convex backend for job tracking',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js 14', documentationUrl: 'https://nextjs.org' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Tailwind CSS', documentationUrl: 'https://tailwindcss.com' },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          {
            name: 'Vercel AI SDK',
            documentationUrl: 'https://sdk.vercel.ai/docs',
          },
          { name: 'Neon Database', documentationUrl: 'https://neon.tech' },
          {
            name: 'Vercel KV',
            documentationUrl: 'https://vercel.com/storage/kv',
          },
          { name: 'NextAuth.js', documentationUrl: 'https://next-auth.js.org' },
          { name: 'OpenRouter', documentationUrl: 'https://openrouter.ai' },
          { name: 'Jina', documentationUrl: 'https://jina.ai' },
          { name: 'Zustand', documentationUrl: 'https://zustand-demo.pmnd.rs' },
          { name: 'SWR', documentationUrl: 'https://swr.vercel.app' },
          { name: 'Zod', documentationUrl: 'https://zod.dev' },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion',
          },
          {
            name: 'Edge Functions',
            documentationUrl:
              'https://vercel.com/docs/functions/edge-functions',
          },
          {
            name: 'pgvector',
            documentationUrl: 'https://github.com/pgvector/pgvector',
          },
        ],
      },
    },
  },
  {
    id: 'squish',
    name: 'squish',
    emoji: '🐙',
    description:
      'multimodal content sharing platform',
    demoUrl: 'https://squish-xyz.vercel.app/',
    sourceUrl: 'https://github.com/orgs/squish-xyz/repositories',
    content: {
      overview: {
        title: 'overview',
        items: [
          'multimodal embeddings for intelligent content understanding',
          'real-time collaborative boards with WebSocket synchronization',
          'customizable column-based layouts with drag-and-drop',
          'fluid animations and polished interaction design',
        ],
      },
      core: {
        title: 'core',
        items: [
          'multimodal embeddings for content understanding',
          'vector similarity search with pgvector and custom indexing',
          'real-time board collaboration via Liveblocks CRDT',
          'distributed async job processing for embedding generation',
          'scalable file processing pipeline with progress tracking',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'Turborepo monorepo with 15+ modular packages',
          'Next.js 15 App Router with React Server Components',
          'Python/FastAPI backend with SQLModel ORM',
          'PostgreSQL with pgvector for semantic search',
          'scalable deployment on Railway and Neon',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Next.js 15', documentationUrl: 'https://nextjs.org' },
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Tailwind CSS', documentationUrl: 'https://tailwindcss.com' },
          {
            name: 'Framer Motion',
            documentationUrl: 'https://www.framer.com/motion/',
          },
          { name: 'Liveblocks', documentationUrl: 'https://liveblocks.io/' },
          { name: 'Python', documentationUrl: 'https://www.python.org' },
          {
            name: 'FastAPI',
            documentationUrl: 'https://fastapi.tiangolo.com/',
          },
          {
            name: 'PostgreSQL',
            documentationUrl: 'https://www.postgresql.org',
          },
          {
            name: 'pgvector',
            documentationUrl: 'https://github.com/pgvector/pgvector',
          },
          {
            name: 'SQLModel',
            documentationUrl: 'https://sqlmodel.tiangolo.com/',
          },
          { name: 'Redis', documentationUrl: 'https://redis.io' },
          {
            name: 'Vertex AI',
            documentationUrl: 'https://cloud.google.com/vertex-ai',
          },
          {
            name: 'OpenAI',
            documentationUrl: 'https://platform.openai.com/docs',
          },
          { name: 'Docker', documentationUrl: 'https://www.docker.com' },
          { name: 'Railway', documentationUrl: 'https://railway.app' },
          { name: 'Neon', documentationUrl: 'https://neon.tech' },
          {
            name: 'pnpm workspaces',
            documentationUrl: 'https://pnpm.io/workspaces',
          },
        ],
      },
    },
  },
  {
    id: 'helios',
    name: 'helios',
    emoji: '☀️',
    description:
      'native macOS menu bar app for display temperature control with fluid animations',
    sourceUrl: 'https://github.com/orgs/helios-xyz/repositories',
    content: {
      overview: {
        title: 'overview',
        items: [
          'native macOS menu bar app with instant access controls',
          'global keyboard shortcuts for quick adjustments',
          'smooth animated transitions with SwiftUI',
          'minimal, focused interface design',
        ],
      },
      core: {
        title: 'core',
        items: [
          'CoreDisplay API integration for hardware control',
          'real-time display temperature adjustments',
          'global hotkey system with customizable shortcuts',
          'persistent preferences with automatic restore',
          'multi-monitor support with individual controls',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'pure SwiftUI architecture with AppKit integration',
          'Metal shaders for real-time preview rendering',
          'Combine framework for reactive state management',
          'UserDefaults and SQLite for data persistence',
          'background daemon for system-level integration',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Swift', documentationUrl: 'https://www.swift.org' },
          {
            name: 'SwiftUI',
            documentationUrl: 'https://developer.apple.com/xcode/swiftui',
          },
          {
            name: 'Metal',
            documentationUrl: 'https://developer.apple.com/metal',
          },
          {
            name: 'Combine',
            documentationUrl:
              'https://developer.apple.com/documentation/combine',
          },
          {
            name: 'AppKit',
            documentationUrl:
              'https://developer.apple.com/documentation/appkit',
          },
          {
            name: 'CoreDisplay',
            documentationUrl:
              'https://developer.apple.com/documentation/coregraphics/quartz_display_services',
          },
          { name: 'SQLite', documentationUrl: 'https://www.sqlite.org' },
          {
            name: 'HotKey',
            documentationUrl: 'https://github.com/soffes/HotKey',
          },
          {
            name: 'UserDefaults',
            documentationUrl:
              'https://developer.apple.com/documentation/foundation/userdefaults',
          },
          {
            name: 'XCTest',
            documentationUrl:
              'https://developer.apple.com/documentation/xctest',
          },
        ],
      },
    },
  },
  {
    id: 'sine',
    name: 'sine',
    emoji: '🎵',
    demoUrl: 'https://sine-labs.com',
    description: 'MIDI-first mobile music agent',
    sourceUrl: 'https://github.com/lnittman/sine',
    content: {
      overview: {
        title: 'overview',
        items: [
          'native iOS MIDI sequencer with multi-track pattern composition',
          'advanced audio processing with VST3 plugin integration',
          'web-based sound pack management and collaborative sharing',
          'real-time audio manipulation through WebSocket streaming',
        ],
      },
      core: {
        title: 'core',
        items: [
          'custom MIDI engine with AVAudioUnitSampler for low-latency playback',
          'Pedalboard-based audio effects processing with customizable presets',
          'semantic search for sound discovery using embeddings',
          'distributed job queue for scalable audio processing',
          'cross-platform sync between iOS app and web utility',
        ],
      },
      architecture: {
        title: 'architecture',
        items: [
          'SwiftUI/SwiftData iOS app with MIDIKit integration',
          'Python/FastAPI backend with WebSocket audio streaming',
          'Next.js web platform with drag-and-drop pack management',
          'Google Cloud Storage for processed audio distribution',
          'PostgreSQL with Prisma ORM for metadata and user data',
        ],
      },
      tech: {
        title: 'tech',
        items: [
          {
            name: 'SwiftUI',
            documentationUrl: 'https://developer.apple.com/xcode/swiftui',
          },
          {
            name: 'SwiftData',
            documentationUrl:
              'https://developer.apple.com/documentation/swiftdata',
          },
          {
            name: 'MIDIKit',
            documentationUrl: 'https://github.com/orchetect/MIDIKit',
          },
          {
            name: 'AVFoundation',
            documentationUrl: 'https://developer.apple.com/av-foundation',
          },
          { name: 'Next.js', documentationUrl: 'https://nextjs.org' },
          {
            name: 'TypeScript',
            documentationUrl: 'https://www.typescriptlang.org',
          },
          { name: 'Tone.js', documentationUrl: 'https://tonejs.github.io/' },
          { name: 'FastAPI', documentationUrl: 'https://fastapi.tiangolo.com' },
          {
            name: 'Pedalboard',
            documentationUrl: 'https://spotify.github.io/pedalboard/',
          },
          {
            name: 'WebSockets',
            documentationUrl:
              'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
          },
          {
            name: 'PostgreSQL',
            documentationUrl: 'https://www.postgresql.org',
          },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          {
            name: 'Google Cloud Storage',
            documentationUrl: 'https://cloud.google.com/storage',
          },
          {
            name: 'OpenAI API',
            documentationUrl: 'https://platform.openai.com/docs',
          },
          {
            name: 'Vertex AI',
            documentationUrl: 'https://cloud.google.com/vertex-ai',
          },
          { name: 'Docker', documentationUrl: 'https://www.docker.com' },
          { name: 'Vercel', documentationUrl: 'https://vercel.com' },
        ],
      },
    },
  },
]
