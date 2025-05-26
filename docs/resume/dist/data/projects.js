"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectById = exports.getFeaturedProjects = exports.getProjectsByTags = exports.projects = void 0;
exports.projects = [
    {
        id: "ther",
        name: "Ther",
        url: "https://ther-app.vercel.app/",
        description: "Empathetic AI companion for mental wellness",
        highlights: [
            "Built supportive AI therapist system with personalized chat experience and agentic framework",
            "Implemented adaptive suggestion engine with contextual intelligence",
            "Developed secure subscription management with Stripe integration",
            "Created cross-platform experience with Tauri (iOS/macOS native support)"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "React", url: "https://react.dev/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind", url: "https://tailwindcss.com/" },
                    { name: "Framer Motion", url: "https://www.framer.com/motion/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Prisma", url: "https://www.prisma.io/" },
                    { name: "PostgreSQL", url: "https://www.postgresql.org/" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "Gemini API", url: "https://ai.google.dev/" },
                    { name: "Prompt Engineering" }
                ]
            },
            {
                category: "Payments",
                technologies: [
                    { name: "Stripe Connect", url: "https://stripe.com/connect" },
                    { name: "Payments API" }
                ]
            },
            {
                category: "Cross-platform",
                technologies: [
                    { name: "Tauri", url: "https://tauri.app/" }
                ]
            },
            {
                category: "State/Utilities",
                technologies: [
                    { name: "Zustand", url: "https://zustand-demo.pmnd.rs/" },
                    { name: "Zod", url: "https://zod.dev/" },
                    { name: "SWR", url: "https://swr.vercel.app/" }
                ]
            }
        ],
        tags: ["ai", "mental-health", "fullstack", "payments", "cross-platform"],
        featured: true,
        status: "active"
    },
    {
        id: "cards",
        name: "Cards",
        url: "https://cards-xyz.vercel.app/",
        description: "Personalized job application tracking platform with AI capabilities",
        highlights: [
            "Designed multi-provider agentic system with model abstraction for varied AI responses",
            "Built embedding-based job-resume matching system for intelligent recommendations",
            "Generated personalized job application cards from user's links, resume, and web presence",
            "Implemented context-aware prompt engineering for coherent AI responses",
            "Created serverless AI processing pipeline with edge function optimization"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "React", url: "https://react.dev/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind", url: "https://tailwindcss.com/" },
                    { name: "Framer Motion", url: "https://www.framer.com/motion/" },
                    { name: "shadcn/ui", url: "https://ui.shadcn.com/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Prisma", url: "https://www.prisma.io/" },
                    { name: "NextAuth", url: "https://next-auth.js.org/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "Neon Database", url: "https://neon.tech/" },
                    { name: "Vercel KV", url: "https://vercel.com/storage/kv" },
                    { name: "pgvector", url: "https://github.com/pgvector/pgvector" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "OpenRouter", url: "https://openrouter.ai/" },
                    { name: "Jina", url: "https://jina.ai/" },
                    { name: "Vercel AI SDK", url: "https://sdk.vercel.ai/docs" }
                ]
            },
            {
                category: "State/Utilities",
                technologies: [
                    { name: "Zustand", url: "https://zustand-demo.pmnd.rs/" },
                    { name: "SWR", url: "https://swr.vercel.app/" },
                    { name: "Zod", url: "https://zod.dev/" }
                ]
            }
        ],
        tags: ["ai", "job-search", "embeddings", "fullstack", "serverless"],
        featured: true,
        status: "active"
    },
    {
        id: "voet",
        name: "Voet",
        url: "https://voet-app.vercel.app/",
        description: "Football intelligence platform with AI-powered analysis",
        highlights: [
            "Architected real-time data aggregation system with multi-source orchestration",
            "Implemented intelligent content analysis with entity recognition using agentic workflows",
            "Built distributed job queue for resilient scheduled data updates",
            "Developed relational schema with rich entity relationships"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind", url: "https://tailwindcss.com/" },
                    { name: "Framer Motion", url: "https://www.framer.com/motion/" },
                    { name: "Recharts", url: "https://recharts.org/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Prisma", url: "https://www.prisma.io/" },
                    { name: "Redis", url: "https://redis.io/" },
                    { name: "Upstash", url: "https://upstash.com/" },
                    { name: "tRPC", url: "https://trpc.io/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "PostgreSQL", url: "https://www.postgresql.org/" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "Gemini API", url: "https://ai.google.dev/" },
                    { name: "Jina", url: "https://jina.ai/" },
                    { name: "Vector DB" },
                    { name: "Embeddings" }
                ]
            },
            {
                category: "Data Extraction",
                technologies: [
                    { name: "Cheerio", url: "https://cheerio.js.org/" },
                    { name: "Puppeteer", url: "https://pptr.dev/" },
                    { name: "Playwright", url: "https://playwright.dev/" }
                ]
            },
            {
                category: "State/Utilities",
                technologies: [
                    { name: "SWR", url: "https://swr.vercel.app/" },
                    { name: "Zustand", url: "https://zustand-demo.pmnd.rs/" },
                    { name: "MSW", url: "https://mswjs.io/" },
                    { name: "Zod", url: "https://zod.dev/" }
                ]
            }
        ],
        tags: ["ai", "data-aggregation", "sports", "fullstack", "real-time"],
        featured: true,
        status: "active"
    },
    {
        id: "squish",
        name: "Squish",
        url: "https://squish-web.vercel.app/",
        description: "Semantic social network for content sharing and discovery",
        highlights: [
            "Developed embedding-based content organization system with semantic search",
            "Built real-time collaborative boards with interactive comments",
            "Created modular, service-based FastAPI backend with monorepo webapp",
            "Implemented fluid animations and interactions for enhanced UX"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind", url: "https://tailwindcss.com/" },
                    { name: "Motion", url: "https://motion.dev/" },
                    { name: "Radix UI", url: "https://www.radix-ui.com/" },
                    { name: "react-spring", url: "https://www.react-spring.dev/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "Python", url: "https://www.python.org/" },
                    { name: "FastAPI", url: "https://fastapi.tiangolo.com/" },
                    { name: "asyncio", url: "https://docs.python.org/3/library/asyncio.html" },
                    { name: "pydantic", url: "https://docs.pydantic.dev/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "PostgreSQL", url: "https://www.postgresql.org/" },
                    { name: "pgvector", url: "https://github.com/pgvector/pgvector" },
                    { name: "Neon", url: "https://neon.tech/" }
                ]
            },
            {
                category: "Collaboration",
                technologies: [
                    { name: "Liveblocks", url: "https://liveblocks.io/" },
                    { name: "WebSockets", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "VertexAI", url: "https://cloud.google.com/vertex-ai" },
                    { name: "OpenAI", url: "https://openai.com/" },
                    { name: "CLIP", url: "https://openai.com/research/clip" },
                    { name: "Vector Embeddings" }
                ]
            },
            {
                category: "Infrastructure",
                technologies: [
                    { name: "Docker", url: "https://www.docker.com/" },
                    { name: "Railway", url: "https://railway.app/" }
                ]
            },
            {
                category: "Architecture",
                technologies: [
                    { name: "Turborepo", url: "https://turbo.build/repo" },
                    { name: "NX", url: "https://nx.dev/" },
                    { name: "Module Federation" }
                ]
            }
        ],
        tags: ["social", "semantic-search", "collaboration", "fullstack", "python"],
        featured: false,
        status: "active"
    },
    {
        id: "loops",
        name: "Loops",
        url: "https://loops-xyz.vercel.app/",
        description: "Stem player for your music with intelligent audio processing",
        highlights: [
            "React / Next.js web app with 4 independent stem track audio loops",
            "Built AI-powered stem isolation system for vocals, drums, bass, and other",
            "Implemented client-side audio processing engine with Web Audio API",
            "Developed efficient audio file streaming and caching system"
        ],
        techStack: [
            {
                category: "Frontend",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "React", url: "https://react.dev/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" },
                    { name: "Tailwind", url: "https://tailwindcss.com/" },
                    { name: "Framer Motion", url: "https://www.framer.com/motion/" }
                ]
            },
            {
                category: "Audio",
                technologies: [
                    { name: "Tone.js", url: "https://tonejs.github.io/" },
                    { name: "Web Audio API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" },
                    { name: "AudioWorklet", url: "https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet" },
                    { name: "WebMIDI", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API" },
                    { name: "FFmpeg.wasm", url: "https://ffmpegwasm.github.io/" }
                ]
            },
            {
                category: "Backend",
                technologies: [
                    { name: "FastAPI", url: "https://fastapi.tiangolo.com/" },
                    { name: "Python", url: "https://www.python.org/" }
                ]
            },
            {
                category: "Storage",
                technologies: [
                    { name: "Vercel KV", url: "https://vercel.com/storage/kv" },
                    { name: "Vercel Blob Storage", url: "https://vercel.com/storage/blob" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "Spleeter", url: "https://github.com/deezer/spleeter" }
                ]
            },
            {
                category: "Infrastructure",
                technologies: [
                    { name: "Docker", url: "https://www.docker.com/" },
                    { name: "Railway", url: "https://railway.app/" },
                    { name: "AWS Lambda", url: "https://aws.amazon.com/lambda/" }
                ]
            },
            {
                category: "State",
                technologies: [
                    { name: "Zustand", url: "https://zustand-demo.pmnd.rs/" },
                    { name: "Redux Toolkit", url: "https://redux-toolkit.js.org/" },
                    { name: "Immer", url: "https://immerjs.github.io/immer/" }
                ]
            }
        ],
        tags: ["audio", "web-audio", "ai", "music", "frontend"],
        featured: true,
        status: "active"
    },
    {
        id: "sine",
        name: "Sine",
        url: "https://sine-labs.com",
        description: "MIDI-based beatmaking app for iOS",
        highlights: [
            "Built native iOS client with comprehensive MIDI engine and patterns",
            "Developed web-based MIDI/sound pack upload utility",
            "Implemented AI audio manipulation and semantic search with agentic asset organization",
            "Created real-time sync with websocket streaming"
        ],
        techStack: [
            {
                category: "iOS",
                technologies: [
                    { name: "Swift", url: "https://www.swift.org/" },
                    { name: "AVFoundation", url: "https://developer.apple.com/av-foundation/" },
                    { name: "AudioKit", url: "https://audiokit.io/" },
                    { name: "CoreAudio", url: "https://developer.apple.com/documentation/coreaudio" },
                    { name: "MIDIKit", url: "https://github.com/orchetect/MIDIKit" },
                    { name: "App Intents", url: "https://developer.apple.com/documentation/appintents" }
                ]
            },
            {
                category: "Web",
                technologies: [
                    { name: "Next.js", url: "https://nextjs.org/" },
                    { name: "TypeScript", url: "https://www.typescriptlang.org/" }
                ]
            },
            {
                category: "Audio",
                technologies: [
                    { name: "Pedalboard", url: "https://github.com/spotify/pedalboard" },
                    { name: "FFmpeg", url: "https://ffmpeg.org/" },
                    { name: "Soundpipe", url: "https://github.com/PaulBatchelor/Soundpipe" },
                    { name: "AudioUnits", url: "https://developer.apple.com/documentation/audiounit" },
                    { name: "VST3", url: "https://www.steinberg.net/developers/" }
                ]
            },
            {
                category: "Database",
                technologies: [
                    { name: "PostgreSQL", url: "https://www.postgresql.org/" },
                    { name: "Core Data", url: "https://developer.apple.com/documentation/coredata" }
                ]
            },
            {
                category: "AI/ML",
                technologies: [
                    { name: "VertexAI", url: "https://cloud.google.com/vertex-ai" },
                    { name: "OpenAI", url: "https://openai.com/" },
                    { name: "Audio Embeddings" }
                ]
            },
            {
                category: "Cloud",
                technologies: [
                    { name: "GCP", url: "https://cloud.google.com/" },
                    { name: "Cloud Storage", url: "https://cloud.google.com/storage" },
                    { name: "Cloud Run", url: "https://cloud.google.com/run" }
                ]
            }
        ],
        tags: ["ios", "audio", "midi", "ai", "mobile", "music"],
        featured: true,
        status: "active"
    }
];
const getProjectsByTags = (tags) => {
    return exports.projects.filter(project => tags.some(tag => project.tags.includes(tag)));
};
exports.getProjectsByTags = getProjectsByTags;
const getFeaturedProjects = () => {
    return exports.projects.filter(project => project.featured);
};
exports.getFeaturedProjects = getFeaturedProjects;
const getProjectById = (id) => {
    return exports.projects.find(project => project.id === id);
};
exports.getProjectById = getProjectById;
//# sourceMappingURL=projects.js.map