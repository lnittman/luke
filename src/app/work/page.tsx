import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { WorkExperience } from '@/components/work/WorkExperience';
import { WORK_EXPERIENCES } from '@/constants/work';
import styles from '@/components/page/root.module.scss';

export default function Work() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={4} />
            <h1>WORK</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <details>
              <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
                <h2 style={{ marginBottom: '0', display: 'inline' }}>EXPERIENCE</h2>
              </summary>
              <div>
                <div className="space-y-0" style={{ marginTop: '0' }}>
                  {WORK_EXPERIENCES.map((experience) => (
                    <WorkExperience key={experience.id} experience={experience} />
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <details>
              <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
                <h2 style={{ marginBottom: '0', display: 'inline' }}>SKILLS</h2>
              </summary>
              <div>
                
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>Languages</h3>
            <p>
              <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">TypeScript</a>, <a href="https://www.python.org" target="_blank" rel="noopener noreferrer">Python</a>, <a href="https://www.swift.org" target="_blank" rel="noopener noreferrer">Swift</a>, <a href="https://www.rust-lang.org" target="_blank" rel="noopener noreferrer">Rust</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">JavaScript</a>, <a href="https://www.postgresql.org/docs/current/sql.html" target="_blank" rel="noopener noreferrer">SQL</a>
            </p>
            
            <h3>Web Frontend</h3>
            <p>
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>, <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>, <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>, <a href="https://www.framer.com/motion" target="_blank" rel="noopener noreferrer">Framer Motion</a>, <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">shadcn/ui</a>, <a href="https://www.radix-ui.com" target="_blank" rel="noopener noreferrer">Radix UI</a>, <a href="https://preactjs.com" target="_blank" rel="noopener noreferrer">Preact</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" target="_blank" rel="noopener noreferrer">WebGL</a>
            </p>
            
            <h3>iOS & macOS</h3>
            <p>
              <a href="https://developer.apple.com/xcode/swiftui" target="_blank" rel="noopener noreferrer">SwiftUI</a>, <a href="https://developer.apple.com/documentation/swiftdata" target="_blank" rel="noopener noreferrer">SwiftData</a>, <a href="https://developer.apple.com/documentation/combine" target="_blank" rel="noopener noreferrer">Combine</a>, <a href="https://developer.apple.com/metal" target="_blank" rel="noopener noreferrer">Metal</a>, <a href="https://developer.apple.com/av-foundation" target="_blank" rel="noopener noreferrer">AVFoundation</a>, <a href="https://developer.apple.com/documentation/appkit" target="_blank" rel="noopener noreferrer">AppKit</a>, <a href="https://developer.apple.com/documentation/coredata" target="_blank" rel="noopener noreferrer">Core Data</a>
            </p>
            
            <h3>Backend & APIs</h3>
            <p>
              <a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer">FastAPI</a>, <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a>, <a href="https://www.prisma.io" target="_blank" rel="noopener noreferrer">Prisma</a>, <a href="https://trpc.io" target="_blank" rel="noopener noreferrer">tRPC</a>, <a href="https://graphql.org" target="_blank" rel="noopener noreferrer">GraphQL</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener noreferrer">WebSockets</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" target="_blank" rel="noopener noreferrer">Server-Sent Events</a>
            </p>
            
            <h3>Database & Storage</h3>
            <p>
              <a href="https://www.postgresql.org" target="_blank" rel="noopener noreferrer">PostgreSQL</a>, <a href="https://github.com/pgvector/pgvector" target="_blank" rel="noopener noreferrer">pgvector</a>, <a href="https://redis.io" target="_blank" rel="noopener noreferrer">Redis</a>, <a href="https://www.sqlite.org" target="_blank" rel="noopener noreferrer">SQLite</a>, <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">Neon</a>, <a href="https://cloud.google.com/storage" target="_blank" rel="noopener noreferrer">Google Cloud Storage</a>, <a href="https://vercel.com/storage" target="_blank" rel="noopener noreferrer">Vercel Storage</a>
            </p>
            
            <h3>AI/ML</h3>
            <p>
              <a href="https://openai.com" target="_blank" rel="noopener noreferrer">OpenAI</a>, <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer">Vertex AI</a>, <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer">Gemini</a>, <a href="https://www.anthropic.com" target="_blank" rel="noopener noreferrer">Claude</a>, <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter</a>, <a href="https://mastra.ai" target="_blank" rel="noopener noreferrer">Mastra</a>, <a href="https://sdk.vercel.ai" target="_blank" rel="noopener noreferrer">Vercel AI SDK</a>, <a href="https://jina.ai" target="_blank" rel="noopener noreferrer">Jina</a>, <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-embeddings-api" target="_blank" rel="noopener noreferrer">Multimodal Embeddings</a>, <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">MCP</a>
            </p>
            
            <h3>Audio & MIDI</h3>
            <p>
              <a href="https://tonejs.github.io" target="_blank" rel="noopener noreferrer">Tone.js</a>, <a href="https://audiokit.io" target="_blank" rel="noopener noreferrer">AudioKit</a>, <a href="https://github.com/orchetect/MIDIKit" target="_blank" rel="noopener noreferrer">MIDIKit</a>, <a href="https://spotify.github.io/pedalboard" target="_blank" rel="noopener noreferrer">Pedalboard</a>, <a href="https://github.com/deezer/spleeter" target="_blank" rel="noopener noreferrer">Spleeter</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" rel="noopener noreferrer">Web Audio API</a>, <a href="https://www.steinberg.net/developers" target="_blank" rel="noopener noreferrer">VST3</a>, <a href="https://developer.apple.com/documentation/coreaudio" target="_blank" rel="noopener noreferrer">CoreAudio</a>
            </p>
            
            <h3>DevOps & Infrastructure</h3>
            <p>
              <a href="https://www.docker.com" target="_blank" rel="noopener noreferrer">Docker</a>, <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a>, <a href="https://railway.app" target="_blank" rel="noopener noreferrer">Railway</a>, <a href="https://turbo.build" target="_blank" rel="noopener noreferrer">Turborepo</a>, <a href="https://pnpm.io" target="_blank" rel="noopener noreferrer">pnpm</a>, <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>, <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">AWS</a>, <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud</a>
            </p>
            
            <h3>State & Data Management</h3>
            <p>
              <a href="https://zustand-demo.pmnd.rs" target="_blank" rel="noopener noreferrer">Zustand</a>, <a href="https://jotai.org" target="_blank" rel="noopener noreferrer">Jotai</a>, <a href="https://swr.vercel.app" target="_blank" rel="noopener noreferrer">SWR</a>, <a href="https://redux.js.org" target="_blank" rel="noopener noreferrer">Redux</a>, <a href="https://zod.dev" target="_blank" rel="noopener noreferrer">Zod</a>, <a href="https://react-hook-form.com" target="_blank" rel="noopener noreferrer">React Hook Form</a>
            </p>
            
            <h3>Cross-Platform</h3>
            <p>
              <a href="https://tauri.app" target="_blank" rel="noopener noreferrer">Tauri</a>, <a href="https://reactnative.dev" target="_blank" rel="noopener noreferrer">React Native</a>, <a href="https://liveblocks.io" target="_blank" rel="noopener noreferrer">Liveblocks</a>, <a href="https://clerk.com" target="_blank" rel="noopener noreferrer">Clerk Auth</a>, <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>, <a href="https://posthog.com" target="_blank" rel="noopener noreferrer">PostHog</a>
            </p>
          </div>
        </div>

              </div>
            </details>
          </div>
        </div>
        
        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <details>
              <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
                <h2 style={{ marginBottom: '0', display: 'inline' }}>EDUCATION</h2>
              </summary>
              <div>
                
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>University of Michigan, Ann Arbor</h3>
            <p>BSc in Computer Science and German Studies (2017)</p>
          </div>
        </div>
              </div>
            </details>
          </div>
        </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  );
}