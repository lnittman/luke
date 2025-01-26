export interface Project {
  id: string;
  name: string;
  emoji: string;
  description: string;
  demoUrl: string;
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
      items: string[];
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
          'next.js 14',
          'typescript',
          'fastapi',
          'python',
          'postgresql',
          'pgvector',
          'redis',
          'websocket',
          'liveblocks',
          'tailwind',
          'framer',
          'vercel',
          'railway',
          'turborepo',
          'docker',
          'graphql',
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
          'python',
          'fastapi',
          'postgresql',
          'pgvector',
          'vertexai',
          'openai',
          'redis',
          'turborepo',
          'docker',
          'tailwind',
          'framer',
          'markdown',
          'ast',
          'llm',
          'vercel',
          'railway'
        ]
      }
    }
  },
  {
    id: 'drib',
    name: 'drib',
    emoji: '⚽️',
    description: 'ai-first football platform',
    demoUrl: 'https://drib.app',
    sourceUrl: 'https://github.com/nithya/drib',
    videos: [
      { src: 'assets/drib-demo.mp4', title: 'platform demo' },
    ],
    content: {
      overview: {
        title: 'overview',
        items: [
          'real-time match analytics',
          'ai-powered tactical insights',
          'social match threads',
          'dashboard+widget interface'
        ]
      },
      core: {
        title: 'core',
        items: [
          'advanced metrics engine',
          'pattern recognition',
          'live match tracking',
          'community spaces'
        ]
      },
      architecture: {
        title: 'architecture',
        items: [
          'monorepo structure',
          'real-time websockets',
          'vector embeddings',
          'edge deployment'
        ]
      },
      tech: {
        title: 'tech',
        items: [
          'next.js',
          'typescript',
          'python',
          'fastapi',
          'postgresql',
          'redis',
          'websocket',
          'liveblocks',
          'clerk',
          'vertexai',
          'openai',
          'turborepo',
          'docker',
          'tailwind',
          'framer',
          'resend',
          'knock',
          'gcp'
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
          'swiftui',
          'coreaudio',
          'midikit',
          'python',
          'fastapi',
          'postgresql',
          'redis',
          'websocket',
          'docker',
          'gcp',
          'vertexai',
          'openai',
          'neon',
          'railway',
          'vst3'
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
          'keychain',
          'hotkey',
          'docker',
          'ci/cd'
        ]
      }
    }
  }
]; 