'use client'

import { useState } from 'react'
import { WorkExperience } from '@/components/app/work/work-experience'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { WORK_EXPERIENCES } from '@/constants/work'

export default function Work() {
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [educationOpen, setEducationOpen] = useState(false)

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
          <div
            className={styles.row}
            style={{
              paddingBottom: '0',
              borderBottom: '1px solid rgb(var(--border))',
            }}
          >
            <div className={styles.column}>
              <details
                onToggle={(e) =>
                  setExperienceOpen((e.target as HTMLDetailsElement).open)
                }
                open={experienceOpen}
              >
              <summary
                  style={{
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                  }}
                >
                  <h2 style={{ marginBottom: '0' }}>EXPERIENCE</h2>
                  <span
                    aria-hidden="true"
                    style={{
                      transform: experienceOpen
                        ? 'rotate(90deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    ▸
                  </span>
                </summary>
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="space-y-0">
                    {WORK_EXPERIENCES.map((experience) => (
                      <WorkExperience
                        experience={experience}
                        key={experience.id}
                      />
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div
            className={styles.row}
            style={{
              paddingBottom: '0',
              borderBottom: '1px solid rgb(var(--border))',
            }}
          >
            <div className={styles.column}>
              <details
                onToggle={(e) =>
                  setSkillsOpen((e.target as HTMLDetailsElement).open)
                }
                open={skillsOpen}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                  }}
                >
                  <h2 style={{ marginBottom: '0' }}>SKILLS</h2>
                  <span
                    aria-hidden="true"
                    style={{
                      transform: skillsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block',
                    }}
                  >
                    ▸
                  </span>
                </summary>
                <div style={{ marginTop: '0.5rem' }}>
                      <h3>Languages</h3>
                      <p>
                        <a
                          href="https://www.typescriptlang.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          TypeScript
                        </a>
                        ,{' '}
                        <a
                          href="https://www.python.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Python
                        </a>
                        ,{' '}
                        <a
                          href="https://www.swift.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Swift
                        </a>
                        ,{' '}
                        <a
                          href="https://www.rust-lang.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Rust
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          JavaScript
                        </a>
                        ,{' '}
                        <a
                          href="https://www.postgresql.org/docs/current/sql.html"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          SQL
                        </a>
                      </p>

                      <h3>Web Frontend</h3>
                      <p>
                        <a
                          href="https://react.dev"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          React
                        </a>
                        ,{' '}
                        <a
                          href="https://nextjs.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Next.js
                        </a>
                        ,{' '}
                        <a
                          href="https://tailwindcss.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Tailwind CSS
                        </a>
                        ,{' '}
                        <a
                          href="https://www.framer.com/motion"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Framer Motion
                        </a>
                        ,{' '}
                        <a
                          href="https://ui.shadcn.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          shadcn/ui
                        </a>
                        ,{' '}
                        <a
                          href="https://www.radix-ui.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Radix UI
                        </a>
                        ,{' '}
                        <a
                          href="https://preactjs.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Preact
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          WebGL
                        </a>
                      </p>

                      <h3>iOS & macOS</h3>
                      <p>
                        <a
                          href="https://developer.apple.com/xcode/swiftui"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          SwiftUI
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/documentation/swiftdata"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          SwiftData
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/documentation/combine"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Combine
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/metal"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Metal
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/av-foundation"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          AVFoundation
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/documentation/appkit"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          AppKit
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.apple.com/documentation/coredata"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Core Data
                        </a>
                      </p>

                      <h3>Backend & APIs</h3>
                      <p>
                        <a
                          href="https://fastapi.tiangolo.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          FastAPI
                        </a>
                        ,{' '}
                        <a
                          href="https://nodejs.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Node.js
                        </a>
                        ,{' '}
                        <a
                          href="https://www.prisma.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Prisma
                        </a>
                        ,{' '}
                        <a
                          href="https://trpc.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          tRPC
                        </a>
                        ,{' '}
                        <a
                          href="https://graphql.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          GraphQL
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          WebSockets
                        </a>
                        ,{' '}
                        <a
                          href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Server-Sent Events
                        </a>
                      </p>

                      <h3>Database & Storage</h3>
                      <p>
                        <a
                          href="https://www.postgresql.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          PostgreSQL
                        </a>
                        ,{' '}
                        <a
                          href="https://github.com/pgvector/pgvector"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          pgvector
                        </a>
                        ,{' '}
                        <a
                          href="https://redis.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Redis
                        </a>
                        ,{' '}
                        <a
                          href="https://www.sqlite.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          SQLite
                        </a>
                        ,{' '}
                        <a
                          href="https://neon.tech"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Neon
                        </a>
                        ,{' '}
                        <a
                          href="https://cloud.google.com/storage"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Google Cloud Storage
                        </a>
                        ,{' '}
                        <a
                          href="https://vercel.com/storage"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Vercel Storage
                        </a>
                      </p>

                      <h3>AI/ML</h3>
                      <p>
                        <a
                          href="https://openai.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          OpenAI
                        </a>
                        ,{' '}
                        <a
                          href="https://cloud.google.com/vertex-ai"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Vertex AI
                        </a>
                        ,{' '}
                        <a
                          href="https://ai.google.dev"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Gemini
                        </a>
                        ,{' '}
                        <a
                          href="https://www.anthropic.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Claude
                        </a>
                        ,{' '}
                        <a
                          href="https://openrouter.ai"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          OpenRouter
                        </a>
                        ,{' '}
                        <a
                          href="https://mastra.ai"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Mastra
                        </a>
                        ,{' '}
                        <a
                          href="https://sdk.vercel.ai"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Vercel AI SDK
                        </a>
                        ,{' '}
                        <a
                          href="https://jina.ai"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Jina
                        </a>
                        ,{' '}
                        <a
                          href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-embeddings-api"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Multimodal Embeddings
                        </a>
                        ,{' '}
                        <a
                          href="https://modelcontextprotocol.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          MCP
                        </a>
                      </p>

                      <h3>Infrastructure & DevOps</h3>
                      <p>
                        <a
                          href="https://vercel.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Vercel
                        </a>
                        ,{' '}
                        <a
                          href="https://railway.app"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Railway
                        </a>
                        ,{' '}
                        <a
                          href="https://www.docker.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Docker
                        </a>
                        ,{' '}
                        <a
                          href="https://github.com/features/actions"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          GitHub Actions
                        </a>
                        ,{' '}
                        <a
                          href="https://turborepo.org"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Turborepo
                        </a>
                        ,{' '}
                        <a
                          href="https://cloud.google.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Google Cloud Platform
                        </a>
                        ,{' '}
                        <a
                          href="https://www.cloudflare.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Cloudflare
                        </a>
                      </p>

                      <h3>Tools & Services</h3>
                      <p>
                        <a
                          href="https://clerk.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Clerk
                        </a>
                        ,{' '}
                        <a
                          href="https://posthog.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          PostHog
                        </a>
                        ,{' '}
                        <a
                          href="https://sentry.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Sentry
                        </a>
                        ,{' '}
                        <a
                          href="https://liveblocks.io"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Liveblocks
                        </a>
                        ,{' '}
                        <a
                          href="https://stripe.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Stripe
                        </a>
                        ,{' '}
                        <a
                          href="https://www.tldraw.com"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          tldraw
                        </a>
                        ,{' '}
                        <a
                          href="https://biomejs.dev"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Biome
                        </a>
                      </p>
                </div>
              </details>
            </div>
          </div>

        <div
          className={styles.row}
          style={{
            paddingBottom: '0',
            borderBottom: '1px solid rgb(var(--border))',
          }}
        >
          <div className={styles.column}>
            <details
              onToggle={(e) =>
                setEducationOpen((e.target as HTMLDetailsElement).open)
              }
              open={educationOpen}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  listStyle: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgb(var(--border))',
                  padding: '0.5rem 0',
                }}
              >
                <h2 style={{ marginBottom: '0' }}>EDUCATION</h2>
                <span
                  aria-hidden="true"
                  style={{
                    transform: educationOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block',
                  }}
                >
                  ▸
                </span>
              </summary>
              <div style={{ marginTop: '0.5rem' }}>
                <h3>University of Michigan, Ann Arbor</h3>
                <p>BSc in Computer Science and German Studies (2017)</p>
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
  )
}
