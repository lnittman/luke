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
                my terminal environment is optimized for context accessibility
                and remote mobility. i use{' '}
                <a
                  href="https://ghostty.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ghostty
                </a>{' '}
                as my GPU-accelerated terminal, running{' '}
                <a
                  href="https://github.com/tmux/tmux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tmux
                </a>{' '}
                with a window-per-app architecture. each application gets its
                own isolated tmux window—one for the web app, one for the
                backend, one for mobile, etc.
              </p>
              <p>
                inside tmux, i maintain a single{' '}
                <a
                  href="https://neovim.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Neovim
                </a>{' '}
                session configured with{' '}
                <a
                  href="https://www.lazyvim.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LazyVim
                </a>
                . within this session, i create tabs for different files and
                terminal buffers. this means i can have my code editor, dev
                servers, and AI coding agents all running in the same vim
                session, navigable with vim keybindings.
              </p>
              <p>
                for remote work, i use{' '}
                <a
                  href="https://termius.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termius
                </a>{' '}
                on iOS and Android devices with{' '}
                <a
                  href="https://tailscale.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tailscale
                </a>{' '}
                VPN. this setup lets me ssh into my development machine from my
                phone or iPad and continue coding with full context from
                anywhere.
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
                  {`tmux session
├─ window 1: radar-web
│  ├─ tab: nvim (files)
│  ├─ tab: terminal (pnpm dev)
│  └─ tab: terminal (claude code)
├─ window 2: radar-api
│  ├─ tab: nvim (files)
│  └─ tab: terminal (server)
└─ window 3: radar-ios
   ├─ tab: nvim (swift files)
   └─ tab: terminal (xcodebuild)`}
                </pre>
              </div>
            </div>
          </div>

          {/* AGENTS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>AGENTS</h2>
              <p>
                i primarily use{' '}
                <a
                  href="https://claude.com/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claude Code
                </a>{' '}
                as my CLI coding agent, with occasional use of Codex CLI as a
                secondary interface. these agents run in dedicated tmux terminal
                buffers right alongside my dev servers and build processes.
              </p>
              <p>
                the key advantage of this setup is context accessibility. when
                an agent is running in a tmux terminal buffer within my nvim
                session, i can instantly yank code from any open file, paste it
                into the agent conversation, or reference other repositories
                open in different tmux windows—all without leaving the keyboard
                or breaking my flow.
              </p>
              <p>
                agents have full awareness of the codebase through the terminal
                environment. they can read files, run tests, execute builds, and
                commit changes. because everything runs in tmux, the entire
                development context is always visible and accessible through vim
                keybindings.
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
                  {`nvim session
├─ buffer: src/app/page.tsx
├─ buffer: src/components/hero.tsx
├─ terminal buffer: pnpm dev (localhost:3000)
└─ terminal buffer: claude code
   └─ agent has access to:
      • all open buffers
      • git status
      • file system
      • MCP servers`}
                </pre>
              </div>
            </div>
          </div>

          {/* FLYWHEELS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>FLYWHEELS</h2>
              <p>
                Model Context Protocol servers create continuous feedback loops
                that accelerate development. i use MCP integrations for my
                primary deployment targets and development workflows.
              </p>
              <p>
                <a
                  href="https://docs.convex.dev/client/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Convex MCP
                </a>{' '}
                gives agents direct access to my backend. they can query the
                database, inspect schemas, execute functions, and verify data
                mutations without leaving the terminal. this means when building
                a feature, the agent can write the backend function, test it
                against real data, and verify the results—all in one flow.
              </p>
              <p>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel MCP
                </a>{' '}
                handles frontend deployments. agents can trigger builds, check
                deployment status, grab preview URLs, and verify that changes
                shipped correctly. this closes the loop from code to production.
              </p>
              <p>
                <a
                  href="https://playwright.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Playwright MCP
                </a>{' '}
                enables browser automation for web projects. agents can interact
                with the live application, run end-to-end tests, take
                screenshots, and verify UI behavior. this is critical for
                testing user flows without manual clicking.
              </p>
              <p>
                Xcode MCP provides build and simulator control for iOS and macOS
                projects. agents can compile Swift code, run builds, launch the
                simulator, and execute tests. this brings native development
                into the same feedback loop as web projects.
              </p>
              <p>
                these tools create flywheels: write code → test with MCP →
                deploy with MCP → verify with MCP → iterate. the faster this
                loop spins, the faster i ship.
              </p>

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
   ┌─────────────┐
   │   VERIFY    │
   │   working   │
   └──────┬──────┘
          │
          └──────► iterate`}
                </pre>
              </div>
            </div>
          </div>

          {/* PATTERNS Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>PATTERNS</h2>
              <p>
                the most important insight from this setup is cross-repo
                context. because i can have multiple repositories open
                simultaneously in tmux windows, and navigate between them with
                vim keybindings, i can easily yank code from one project and
                paste it into another.
              </p>
              <p>
                this enables pattern-based development. instead of writing every
                feature from scratch, i build with reusable architectural
                blocks. my projects share common patterns: authentication flows,
                data fetching hooks, API client setup, component structures.
                when i need a feature, i jump to a repo that has it, yank the
                implementation, paste it into the new project, and adapt it.
              </p>
              <p>
                agents amplify this workflow. with MCP access to multiple repos,
                they can reference patterns across boundaries. "implement auth
                like radar" means the agent can look at radar's auth
                implementation through Convex MCP, understand the pattern, and
                replicate it in the current project.
              </p>
              <p>
                this isn't blind copy-paste. blocks are reused because projects
                follow consistent architectural patterns. same state management
                library, same API patterns, same component composition
                strategies. consistency across projects makes pattern transfer
                reliable.
              </p>
              <p>
                this approach aligns with principles from{' '}
                <a
                  href="https://www.catb.org/~esr/writings/taoup/html/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Art of Unix Programming
                </a>{' '}
                by Eric Raymond—modularity, composition, and the Rule of
                Modularity: "Write simple parts connected by clean interfaces."
                it also reflects ideas from{' '}
                <a
                  href="https://web.stanford.edu/~ouster/cgi-bin/book.php"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A Philosophy of Software Design
                </a>{' '}
                by John Ousterhout about reducing complexity through consistent
                abstractions.
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
                  {`pattern transfer workflow

repo: radar                repo: new-project
├─ auth/                   ├─ auth/
│  ├─ clerk.ts            │  └─ [empty]
│  └─ session.ts          │
├─ hooks/                  ├─ hooks/
│  └─ useAuth.ts ──────┐   │  └─ [empty]
└─ middleware/          │   └─ middleware/
   └─ auth.ts           │      └─ [empty]
                        │
                        │ vim yank (yyy)
                        │ tmux switch (Alt-2)
                        │ vim paste (p)
                        │
                        └────► adapt pattern
                               to new context

agents via MCP can:
• read patterns from radar
• understand the architecture
• replicate in new-project
• maintain consistency`}
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
