'use client';

import { useState } from 'react';
import { DefaultLayout } from '@/components/shared/default-layout';
import { FooterNavigation } from '@/components/shared/footer-navigation';
import { BlockLoader } from '@/components/shared/block-loader';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { WorkExperience } from '@/components/app/work/work-experience';
import { WORK_EXPERIENCES } from '@/constants/work';
import styles from '@/components/shared/root.module.scss';

export default function Work() {
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

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
            <details open={experienceOpen} onToggle={(e) => setExperienceOpen((e.target as HTMLDetailsElement).open)}>
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ marginBottom: '0' }}>EXPERIENCE</h2>
                <span aria-hidden="true" style={{ 
                  transform: experienceOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block'
                }}>▸</span>
              </summary>
              <div style={{ marginTop: '1rem' }}>
                <div className="space-y-0">
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
            <details open={skillsOpen} onToggle={(e) => setSkillsOpen((e.target as HTMLDetailsElement).open)}>
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ marginBottom: '0' }}>SKILLS</h2>
                <span aria-hidden="true" style={{ 
                  transform: skillsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block'
                }}>▸</span>
              </summary>
              <div style={{ marginTop: '1rem' }}>
                
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.column} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
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
            
            <h3>Infrastructure & DevOps</h3>
            <p>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a>, <a href="https://railway.app" target="_blank" rel="noopener noreferrer">Railway</a>, <a href="https://www.docker.com" target="_blank" rel="noopener noreferrer">Docker</a>, <a href="https://github.com/features/actions" target="_blank" rel="noopener noreferrer">GitHub Actions</a>, <a href="https://turborepo.org" target="_blank" rel="noopener noreferrer">Turborepo</a>, <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud Platform</a>, <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer">Cloudflare</a>
            </p>
            
            <h3>Tools & Services</h3>
            <p>
              <a href="https://clerk.com" target="_blank" rel="noopener noreferrer">Clerk</a>, <a href="https://posthog.com" target="_blank" rel="noopener noreferrer">PostHog</a>, <a href="https://sentry.io" target="_blank" rel="noopener noreferrer">Sentry</a>, <a href="https://liveblocks.io" target="_blank" rel="noopener noreferrer">Liveblocks</a>, <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>, <a href="https://www.tldraw.com" target="_blank" rel="noopener noreferrer">tldraw</a>, <a href="https://biomejs.dev" target="_blank" rel="noopener noreferrer">Biome</a>
            </p>
          </div>
        </div>
        
              </div>
            </details>
          </div>
        </div>

        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
            <details>
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ marginBottom: '0' }}>RESUME</h2>
                <span aria-hidden="true">▸</span>
              </summary>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Traditional PDF resume available for download or viewing.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a 
                    href="/luke-nittmann-resume.pdf" 
                    download
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      color: 'rgb(var(--accent-1))',
                      textDecoration: 'none',
                      padding: '0.5rem 1.25rem',
                      border: '1px solid rgb(var(--accent-1))',
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgb(var(--accent-1))';
                      e.currentTarget.style.color = 'rgb(var(--background-start))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgb(var(--accent-1))';
                    }}
                  >
                    DOWNLOAD PDF
                  </a>
                  <a 
                    href="/luke-nittmann-resume.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      color: 'rgb(var(--text-secondary))',
                      textDecoration: 'none',
                      padding: '0.5rem 1.25rem',
                      border: '1px solid rgb(var(--border))',
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                      e.currentTarget.style.color = 'rgb(var(--accent-1))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(var(--border))';
                      e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                    }}
                  >
                    VIEW IN BROWSER
                  </a>
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