export interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  demoUrl?: string;
  appUrl?: string;
  sourceUrl: string;
  videos?: { src: string; title: string }[];
  content: {
    overview: {
      title: string;
      items: string[];
    };
    core: {
      title: string;
      items: string[];
    };
    architecture: {
      title: string;
      items: string[];
    };
    tech: {
      title: string;
      items: (string | { name: string; documentationUrl: string })[];
    };
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'arbor',
    name: 'arbor',
    emoji: '🌳',
    description: 'enterprise-grade AI chat framework with multi-agent orchestration',
    appUrl: 'https://arbor-xyz.vercel.app/',
    sourceUrl: 'https://github.com/lnittman/arbor',
    content: {
      overview: {
        title: 'overview',
        items: [
          'production-ready AI chat framework with cross-platform deployment',
          'multi-agent orchestration through Mastra framework',
          'Model Context Protocol (MCP) tool integration',
          'native iOS and desktop applications via Tauri'
        ]
      },
      core: {
        title: 'core',
        items: [
          'dynamic MCP tool injection for GitHub, Gmail, web scraping',
          'project-based chat organization with PostgreSQL persistence',
          'real-time streaming with tool call visualization',
          'multi-model support (Claude, GPT-4, Gemini)',
          'comprehensive auth with Clerk integration'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo with separate AI microservice',
          'Next.js 15 App Router with React Server Components',
          'Mastra AI framework for agent orchestration',
          'shared design system and component library',
          'production-ready logging and error handling'
        ]
      },
      tech: {
        title: 'stack',
        items: [
          'Next.js 15',
          'TypeScript',
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          { name: 'MCP', documentationUrl: 'https://modelcontextprotocol.io' },
          'Prisma + PostgreSQL',
          'Clerk Auth',
          'Turborepo',
          'Swift + SwiftUI (iOS native)',
          'Tauri (desktop daemon)',
          'Vercel AI SDK',
          'Tailwind CSS v4',
          'Radix UI'
        ]
      }
    }
  },
  {
    id: 'react-llm',
    name: 'react-llm',
    emoji: '💬',
    description: 'browser-native AI coding assistant for React developers',
    demoUrl: 'https://react-llm.vercel.app',
    sourceUrl: 'https://github.com/lnittman/react-llm',
    content: {
      overview: {
        title: 'overview',
        items: [
          'visual component selection through React fiber traversal',
          'multi-model AI chat with 100+ LLMs via OpenRouter',
          'live code editing with File System Access API',
          'browser-native architecture requiring zero extensions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'bippy-powered React fiber instrumentation for component detection',
          'shadow DOM isolation for seamless UI integration',
          'SQLite WASM with OPFS for persistent local storage',
          'unified LLM hub supporting OpenRouter, OpenAI, Anthropic, and Google'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'monorepo structure with core library, docs, and marketing sites',
          'preact-based UI for minimal bundle size (~50KB gzipped)',
          'web worker architecture for performance isolation',
          'plugin system for Next.js, Vite, and browser extension'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'typescript',
          'preact',
          { name: 'bippy', documentationUrl: 'https://github.com/aidenybai/bippy' },
          'sqlite wasm',
          'openrouter api',
          'file system access api',
          'shadow dom',
          'web workers',
          'opfs',
          'turbo',
          'tsup',
          'vitest',
          'marked',
          '@preact/signals'
        ]
      }
    }
  },
  {
    id: 'webs-xyz',
    name: 'webs',
    emoji: '🌐',
    description: 'AI-native web research platform that transforms URLs into intelligent insights',
    appUrl: 'https://webs-xyz.vercel.app',
    sourceUrl: 'https://github.com/lnittman/webs-xyz',
    content: {
      overview: {
        title: 'overview',
        items: [
          'AI-powered content analysis replacing traditional browsing',
          'organized workspaces (Spaces) with custom AI settings',
          'real-time streaming responses with progressive UI updates',
          'collaborative research with shared insights and annotations'
        ]
      },
      core: {
        title: 'core',
        items: [
          'multi-URL batch analysis with parallel AI processing',
          'context-aware chat conversations about analyzed content',
          'AI-generated charts and data visualizations',
          'knowledge graph visualization of URL relationships',
          'mobile-first PWA with offline capabilities'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'turborepo monorepo with 14+ shared packages',
          'Next.js 15 with React Server Components',
          'Mastra AI framework for agent orchestration',
          'Server-Sent Events for real-time streaming',
          'Clerk auth with row-level security'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'Next.js 15.3',
          'React 19',
          'TypeScript',
          'Tailwind CSS v4',
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          'PostgreSQL + Prisma',
          'Server-Sent Events',
          'Jotai',
          'SWR',
          'Clerk',
          'PostHog',
          'Turborepo',
          'pnpm workspaces'
        ]
      }
    }
  },
  {
    id: 'squish',
    name: 'squish',
    emoji: '🐙',
    description: 'multimodal AI content platform with semantic search and real-time collaboration',
    demoUrl: 'https://squish-xyz.vercel.app/',
    sourceUrl: 'https://github.com/orgs/squish-xyz/repositories',
    content: {
      overview: {
        title: 'overview',
        items: [
          'multimodal AI embeddings for intelligent content understanding',
          'real-time collaborative boards with WebSocket synchronization',
          'customizable column-based layouts with drag-and-drop',
          'fluid animations and polished interaction design'
        ]
      },
      core: {
        title: 'core',
        items: [
          'Vertex AI multimodal embeddings for content understanding',
          'vector similarity search with pgvector and custom indexing',
          'real-time board collaboration via Liveblocks CRDT',
          'distributed async job processing for embedding generation',
          'scalable file processing pipeline with progress tracking'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'Turborepo monorepo with 15+ modular packages',
          'Next.js 15 App Router with React Server Components',
          'FastAPI microservices with SQLModel ORM',
          'PostgreSQL with pgvector for semantic search',
          'scalable deployment on Railway and Neon'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'Next.js 15',
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          'TypeScript',
          'Tailwind CSS',
          { name: 'Framer Motion', documentationUrl: 'https://www.framer.com/motion/' },
          { name: 'Liveblocks', documentationUrl: 'https://liveblocks.io/' },
          'Python',
          { name: 'FastAPI', documentationUrl: 'https://fastapi.tiangolo.com/' },
          'PostgreSQL',
          { name: 'pgvector', documentationUrl: 'https://github.com/pgvector/pgvector' },
          { name: 'SQLModel', documentationUrl: 'https://sqlmodel.tiangolo.com/' },
          'Redis',
          'Vertex AI',
          'OpenAI',
          'Docker',
          'Railway',
          'Neon',
          'pnpm workspaces'
        ]
      }
    }
  },
  {
    id: 'voet',
    name: 'voet',
    emoji: '⚽️',
    description: 'AI-powered football intelligence platform with real-time data orchestration',
    demoUrl: 'https://voet-xyz.vercel.app/',
    sourceUrl: 'https://github.com/nithya/voet',
    content: {
      overview: {
        title: 'overview',
        items: [
          'AI-native football data platform aggregating multi-league statistics',
          'distributed data pipeline with entity extraction and linking',
          'real-time streaming chat with contextual football knowledge',
          'automated news summarization and match report generation'
        ]
      },
      core: {
        title: 'core',
        items: [
          'Mastra-powered AI workflows for intelligent data processing',
          'multi-stage extraction pipelines with schema validation',
          'entity recognition linking players, teams, and matches',
          'distributed cron orchestration for real-time updates',
          'structured data extraction from unstructured web content'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'Turborepo monorepo with Next.js 15 microservices',
          'event-driven architecture with job queue processing',
          'PostgreSQL with Prisma ORM for complex entity relationships',
          'AI service layer with OpenRouter LLM integration',
          'Firecrawl web scraping with intelligent content parsing'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          { name: 'Mastra', documentationUrl: 'https://mastra.ai' },
          'Next.js 15',
          { name: 'Turborepo', documentationUrl: 'https://turbo.build/repo' },
          { name: 'Prisma', documentationUrl: 'https://www.prisma.io' },
          { name: 'NeonDB', documentationUrl: 'https://neon.tech' },
          { name: 'OpenRouter', documentationUrl: 'https://openrouter.ai' },
          { name: 'Firecrawl', documentationUrl: 'https://firecrawl.dev' },
          { name: 'Clerk Auth', documentationUrl: 'https://clerk.com' },
          { name: 'PostHog', documentationUrl: 'https://posthog.com' },
          'TypeScript',
          'Zod validation',
          'Framer Motion'
        ]
      }
    }
  },
  {
    id: 'sine',
    name: 'sine',
    emoji: '🎵',
    description: 'AI-powered MIDI sequencer and collaborative music creation platform for iOS',
    demoUrl: 'https://sine-labs.com',
    sourceUrl: 'https://github.com/nithya/sine',
    content: {
      overview: {
        title: 'overview',
        items: [
          'native iOS MIDI sequencer with multi-track pattern composition',
          'AI-powered audio processing with VST3 plugin integration',
          'web-based sound pack management and collaborative sharing',
          'real-time audio manipulation through WebSocket streaming'
        ]
      },
      core: {
        title: 'core',
        items: [
          'custom MIDI engine with AVAudioUnitSampler for low-latency playback',
          'Pedalboard-based audio effects processing with customizable presets',
          'semantic search for sound discovery using AI embeddings',
          'distributed job queue for scalable audio processing',
          'cross-platform sync between iOS app and web utility'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'SwiftUI/SwiftData iOS app with MIDIKit integration',
          'FastAPI service layer with WebSocket audio streaming',
          'Next.js web platform with drag-and-drop pack management',
          'Google Cloud Storage for processed audio distribution',
          'PostgreSQL with Prisma ORM for metadata and user data'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'SwiftUI',
          'SwiftData',
          { name: 'MIDIKit', documentationUrl: 'https://github.com/orchetect/MIDIKit' },
          'AVFoundation',
          'Next.js',
          'TypeScript',
          { name: 'Tone.js', documentationUrl: 'https://tonejs.github.io/' },
          'FastAPI',
          { name: 'Pedalboard', documentationUrl: 'https://spotify.github.io/pedalboard/' },
          'WebSockets',
          'PostgreSQL',
          'Prisma',
          'Google Cloud Storage',
          'OpenAI API',
          'Vertex AI',
          'Docker',
          'Vercel'
        ]
      }
    }
  },
  {
    id: 'helios',
    name: 'helios',
    emoji: '☀️',
    description: 'native macOS menu bar app for display temperature control with fluid animations',
    sourceUrl: 'https://github.com/orgs/helios-xyz/repositories',
    content: {
      overview: {
        title: 'overview',
        items: [
          'native macOS menu bar app with instant access controls',
          'global keyboard shortcuts for quick adjustments',
          'smooth animated transitions with SwiftUI',
          'minimal, focused interface design'
        ]
      },
      core: {
        title: 'core',
        items: [
          'CoreDisplay API integration for hardware control',
          'real-time display temperature adjustments',
          'global hotkey system with customizable shortcuts',
          'persistent preferences with automatic restore',
          'multi-monitor support with individual controls'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'pure SwiftUI architecture with AppKit integration',
          'Metal shaders for real-time preview rendering',
          'Combine framework for reactive state management',
          'UserDefaults and SQLite for data persistence',
          'background daemon for system-level integration'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'Swift',
          'SwiftUI',
          'Metal',
          'Combine',
          'AppKit',
          'CoreDisplay',
          'SQLite',
          'HotKey',
          'UserDefaults',
          'XCTest'
        ]
      }
    }
  },
  {
    id: 'ther',
    name: 'ther',
    emoji: '🌸',
    description: 'empathetic mental wellness companion',
    demoUrl: 'https://ther-app.vercel.app/',
    sourceUrl: 'https://github.com/nithya/ther',
    content: {
      overview: {
        title: 'overview',
        items: [
          'supportive AI conversations for mental wellness',
          'personalized chat experience with contextual suggestions',
          'thoughtful design centered on empathy',
          'subscription-based access with flexible payment options'
        ]
      },
      core: {
        title: 'core',
        items: [
          'empathetic conversation system',
          'adaptive suggestion engine',
          'mental wellness content curation',
          'biometric authentication',
          'secure subscription management'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'next.js app with prisma ORM',
          'cross-platform with tauri',
          'iOS native support',
          'stripe payment integration',
          'secure API architecture'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'react 19',
          'typescript',
          'tailwind',
          'framer motion',
          'prisma',
          'postgresql',
          'generative AI',
          'stripe',
          'tauri',
          'iOS',
          'macOS',
          'rust',
          'zustand',
          'zod',
          'SWR',
          'vercel'
        ]
      }
    }
  },
  {
    id: 'loops',
    name: 'loops',
    emoji: '∞',
    description: 'stem player for your music with intelligent audio processing',
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
          'mobile-responsive audio workstation'
        ]
      },
      core: {
        title: 'core',
        items: [
          'AI-powered stem isolation (vocals, drums, bass, other)',
          'precise loop control with customizable segments',
          'dynamic tempo and playback rate adjustment',
          'individual stem volume and mute controls',
          'audio export and sharing capabilities'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'client-side audio processing engine',
          'Web Audio API with custom scheduling',
          'distributed backend with serverless functions',
          'audio processing microservices',
          'efficient audio file streaming and caching'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'react',
          'typescript',
          'tailwind',
          'tone.js',
          'web audio API',
          'framer motion',
          'spleeter',
          'fastAPI',
          'python',
          'docker',
          'vercel KV',
          'vercel blob storage',
          'zustand',
          'railway'
        ]
      }
    }
  },
  {
    id: 'jobs',
    name: 'cards',
    emoji: '💼',
    description: 'AI-powered job application platform with multi-LLM orchestration',
    appUrl: 'https://cards-xyz.vercel.app/',
    sourceUrl: 'https://github.com/nithya/jobs',
    content: {
      overview: {
        title: 'overview',
        items: [
          'intelligent job application tracking with LLM integration',
          'multi-model AI for cover letter generation and job matching',
          'advanced context management for coherent AI responses',
          'customizable workflow automation for job applications'
        ]
      },
      core: {
        title: 'core',
        items: [
          'multi-LLM architecture with provider abstraction',
          'embedding-based job-resume matching',
          'automated application workflows',
          'context-aware prompt engineering'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'next.js app router with RSC',
          'vercel edge runtime optimization',
          'vector storage integration',
          'serverless AI processing'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js 14',
          'typescript',
          'tailwind',
          'prisma',
          'vercel ai sdk',
          'neon database',
          'vercel kv',
          'next-auth',
          'openrouter',
          'jina',
          'zustand',
          'swr',
          'zod',
          'framer motion',
          'edge functions',
          'pgvector'
        ]
      }
    }
  },
]; 