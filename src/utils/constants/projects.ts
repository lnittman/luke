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
    id: 'squish',
    name: 'squish',
    emoji: '🐙',
    description: 'semantic social network for content sharing and discovery',
    demoUrl: 'https://squish-web.vercel.app/',
    sourceUrl: 'https://github.com/orgs/squish-xyz/repositories',
    videos: [
      { src: 'assets/squish-demo-2.mp4', title: 'asset organization' },
      { src: 'assets/squish-demo.mp4', title: 'semantic search demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'fun file storage',
          'abstract content discovery pain with AI',
          'customizable, column-based home page',
          'fluid animations + interactions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'embedding-based content organization',
          'semantic search engine',
          'interactive boards + comments',
          'real-time collaborative boards',
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'monorepo webapp with shared packages',
          'modular, service-based fastapi backend',
          'interactive + living documentation',
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'turborepo',
          'typescript',
          'tailwind',
          'motion',
          'liveblocks',
          'python',
          'fastapi',
          'postgresql',
          'alembic',
          'sqlmodel',
          'pgvector',
          'railway',
          'neon',
          'docker',
          'vertexai',
          'openai'
        ]
      }
    }
  },
  {
    id: 'top',
    name: 'top',
    emoji: '🧠',
    description: 'vision-first development platform',
    demoUrl: 'https://top-web.vercel.app/',
    sourceUrl: 'https://github.com/orgs/top-labs/repositories',
    videos: [
      { src: 'assets/top.mp4', title: 'platform demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'natural language development',
          'vision-driven architecture',
          'context-aware tooling',
          'seamless abstraction of best practices'
        ]
      },
      core: {
        title: 'core',
        items: [
          'intelligent context system',
          'natural language interface',
          'semantic project mapping',
          'adaptive documentation'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'distributed platform',
          'llm pipeline system',
          'vector embeddings',
          'context graph'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'typescript',
          'postgresql',
          'pgvector',
          'vertexai',
          'openai',
          'turborepo',
          'tailwind',
          'motion',
          'markdown',
          'clerk',
          'ast',
        ]
      }
    }
  },
  {
    id: 'voet',
    name: 'voet',
    emoji: '⚽️',
    description: 'football intelligence platform with AI-powered analysis',
    demoUrl: 'https://voet-app.vercel.app/',
    sourceUrl: 'https://github.com/nithya/voet',
    videos: [
      { src: 'assets/voet-demo.mp4', title: 'platform demo' },
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'real-time football data aggregation platform',
          'AI-powered news analysis with entity extraction',
          'comprehensive football statistics visualization',
          'intelligent data scraping and enrichment pipeline'
        ]
      },
      core: {
        title: 'core',
        items: [
          'multi-source data orchestration system',
          'Gemini-powered content analysis & entity recognition',
          'automated entity linking for players, teams, and matches',
          'distributed job queue for scheduled data updates'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'modular scraper system with orchestration layer',
          'LLM pipeline for content extraction and classification',
          'Redis queue for resilient distributed processing',
          'relational schema with rich entity relationships'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'typescript',
          'tailwind',
          'prisma',
          'postgresql',
          'redis',
          'upstash',
          'gemini api',
          'cheerio',
          'SWR',
          'zustand',
          'framer motion',
          'jina',
          'vercel',
        ]
      }
    }
  },
  {
    id: 'sine',
    name: 'sine',
    emoji: '🎵',
    description: 'midi-based beatmaking app for ios',
    demoUrl: 'https://sine.app',
    sourceUrl: 'https://github.com/nithya/sine',
    videos: [
      { src: 'assets/sine-ios.mp4', title: 'ios app demo' },
      { src: 'assets/sine-pack-utility.mp4', title: 'pack utility' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'midi pattern sequencing',
          'web-based midi/sound pack upload utility',
          'collaborative sound sharing',
          'ai audio manipulation'
        ]
      },
      core: {
        title: 'core',
        items: [
          'midi engine + patterns',
          'semantic search',
          'pack management',
          'real-time sync'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'native ios client',
          'websocket streaming',
          'edge deployment',
          'vector search'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'swift',
          'webkit',
          'next.js',
          'typescript',
          'rust',
          'audio tools',
          'video server',
          'postgresql',
          'vertexai',
          'openai',
          'worker',
          'streams',
          's3',
          'vapor'
        ]
      }
    }
  },
  {
    id: 'helios',
    name: 'helios',
    emoji: '☀️',
    description: 'display temperature control menu bar widget for macOS',
    demoUrl: 'https://helios.app',
    sourceUrl: 'https://github.com/orgs/helios-xyz/repositories',
    videos: [
      { src: 'assets/helios.mp4', title: 'app demo' }
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'native menu bar interface',
          'keyboard shortcuts',
          'fluid animations',
          'minimal interactions'
        ]
      },
      core: {
        title: 'core',
        items: [
          'display control',
          'atomic operations',
          'event system',
          'state persistence'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'native macos app',
          'metal rendering',
          'event streaming',
          'local storage'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'swift',
          'swiftui',
          'metal',
          'combine',
          'appkit',
          'sqlite',
          'hotkey',
        ]
      }
    }
  },
  {
    id: 'ther',
    name: 'ther',
    emoji: '🌸',
    description: 'empathetic AI companion for mental wellness',
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
    sourceUrl: 'https://github.com/yourusername/loops',
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
    name: 'jobs',
    emoji: '💼',
    description: 'personalized job application tracking platform with AI capabilities',
    appUrl: 'https://jobs-xyz.vercel.app/',
    sourceUrl: 'https://github.com/nithya/jobs',
    videos: [
      { src: 'assets/jobs-demo.mp4', title: 'app demo' }
    ],
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