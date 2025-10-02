import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

// Force static generation at build time
export const dynamic = 'force-static'
export const revalidate = false

// Metadata for better SEO
export const metadata = {
  title: 'Process - Luke Nittmann',
  description: 'how i use AI to build software fast',
}

export default function Process() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={4} />
            <h1>PROCESS</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* SOFTWARE Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>SOFTWARE</h2>
              <p>
                i use{' '}
                <a
                  href="https://ghostty.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ghostty
                </a>{' '}
                with{' '}
                <a
                  href="https://github.com/tmux/tmux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tmux
                </a>
                . one window per project. inside each window: files open in{' '}
                <a
                  href="https://neovim.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nvim
                </a>
                , dev servers running, multiple agent CLI sessions. everything
                in one{' '}
                <a
                  href="https://www.lazyvim.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LazyVim
                </a>{' '}
                session, navigable with vim keybindings.
              </p>
              <p>
                i can jump between files, terminals, and agent chats
                without leaving vim. yank code from one chat/file, paste into another.
                jump tmux windows to a different project, yank a pattern, bring it back.
                agent CLIs can refer to external directories on disk.
              </p>
              <p>
                i also use{' '}
                <a
                  href="https://termius.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termius
                </a>{' '}
                +{' '}
                <a
                  href="https://tailscale.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tailscale
                </a>{' '}
                to ssh from my phone or iPad. same session, from wherever.
              </p>

              {/* Visual panel: terminal layout */}
              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                  }}
                >
                  {`tmux window: project-a
├─ nvim buffer: src/app/page.tsx
├─ nvim buffer: components/hero.tsx
├─ terminal buffer: pnpm dev
├─ terminal buffer: codex (writing code)
├─ terminal buffer: claude (planning)
└─ terminal buffer: backend dev

all navigable with vim keys
yank/paste between any buffer`}
                </pre>
              </div>
            </div>
          </div>

          {/* AGENTS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>AGENTS</h2>
              <p>
                i run Codex CLI and{' '}
                <a
                  href="https://claude.com/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code
                </a>{' '}
                at the same time in different buffers. stream of
                consciousness—codex builds something, i ask claude to review it
                and write a handoff prompt, paste that back to codex. or claude
                debugs with MCP tools and generates tasks for codex to execute.
              </p>
              <p>
                agents can see everything in the terminal. i yank code from one
                file, paste into an agent. reference code from a different repo
                in another tmux window. all without leaving vim. they can run
                commands, read files, execute tests, commit changes. everything
                they need is already in context.
              </p>

              {/* Visual panel: agent terminal layout */}
              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                  }}
                >
                  {`typical flow:
me → codex: "build auth flow"
codex → implements basic version
me → claude: "review this, make it better"
claude → writes detailed handoff prompt
me → codex: [paste claude's prompt]
codex → refines implementation
me → claude: "check deployment"
claude → uses vercel MCP, finds issues
claude → generates fix tasks for codex`}
                </pre>
              </div>
            </div>
          </div>

          {/* FLYWHEELS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>FLYWHEELS</h2>
              <p>
                MCP servers let agents interact with deployment platforms and
                development tools. write, test, deploy, verify, repeat.
              </p>
              <p>
                <a
                  href="https://docs.convex.dev/client/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Convex MCP
                </a>{' '}
                — query database, run functions, inspect schemas. write a
                backend mutation, test against real data, verify results.
              </p>
              <p>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel MCP
                </a>{' '}
                — trigger deploys, check status, grab preview URLs.
              </p>
              <p>
                <a
                  href="https://playwright.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Playwright MCP
                </a>{' '}
                — browser automation. click through flows, take screenshots,
                verify UI.
              </p>
              <p>
                Xcode MCP — build control for iOS/macOS. compile, test, launch
                simulator.
              </p>
              <p>
                <a
                  href="https://github.com/modelcontextprotocol/servers/tree/main/src/ref"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ref MCP
                </a>{' '}
                — searches docs across web and private sources. handy for
                pulling API docs without breaking flow.
              </p>
              <p>faster loop, faster shipping.</p>

              {/* Visual panel: flywheel diagram */}
              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                  }}
                >
                  {`development flywheel

   ┌─────────────┐
   │    WRITE    │
   │   feature   │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐     playwright MCP
   │    TEST     │ ◄── browser automation
   │  behavior   │     xcode MCP
   └──────┬──────┘     build + simulator
          │
          ▼
   ┌─────────────┐     convex MCP
   │   DEPLOY    │ ◄── backend functions
   │  to prod    │     vercel MCP
   └──────┬──────┘     frontend deploy
          │
          ▼
   ┌─────────────┐     ref MCP
   │   VERIFY    │ ◄── docs lookup
   │   working   │
   └──────┬──────┘
          │
          └──────► iterate faster`}
                </pre>
              </div>
            </div>
          </div>

          {/* PATTERNS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>PATTERNS</h2>
              <p>
                having cross-repo context matters. i can see multiple projects
                in tmux windows and yank/paste between them. the filesystem
                becomes a library of working patterns.
              </p>
              <p>
                need auth? switch to a project that has it, yank the code, paste
                into the new project, adapt. same with API clients, hooks,
                component patterns, configs. everything is already working
                somewhere.
              </p>
              <p>
                agents with MCP make this better. "implement auth like
                project-a" and the agent reads that code, understands the
                pattern, replicates it. this works because i use the same tools
                across projects—same state management, same API patterns, same
                composition strategies.
              </p>
              <p>
                each pattern gets reused. you're not learning "how to implement
                X" repeatedly—you're building a workflow around writing good
                prompts. energy goes into prompts, not memorizing
                implementation.
              </p>
              <p>
                something i've noticed: if you capture the pattern behind
                something silly that inspires you, that toolset can make
                something meaningful later. patterns from experiments become
                building blocks.
              </p>

              {/* Visual panel: pattern flow */}
              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                  }}
                >
                  {`pattern library growth

project 1
├─ auth/ (session mgmt)
├─ hooks/ (data fetching)
└─ api/ (client setup)
         │
         │ yank pattern
         ▼
project 2
├─ auth/ ✓ (adapted)
├─ hooks/ ✓ (same pattern)
├─ api/ ✓ (same pattern)
└─ animations/ (new pattern!)
         │
         │ yank pattern
         ▼
project 3
└─ animations/ ✓ (from project 2)

compound gains:
• patterns → reused across projects
• each reuse = faster build
• focus shifts to prompts/workflow
• library grows over time`}
                </pre>
              </div>
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
