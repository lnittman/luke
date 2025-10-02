import { Accordion } from '@/components/app/home/accordion'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import { OpenInAI } from '@/components/shared/open-in-ai'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <OpenInAI />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className="space-y-0" style={{ marginTop: '0' }}>
            <Accordion defaultOpen={false} title="SOFTWARE">
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
                session (my plugin manager), navigable with vim keybindings. my
                full config is at{' '}
                <a
                  href="https://github.com/lnittman/config"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lnittman/config
                </a>
                .
              </p>
              <p>
                i can jump between files, terminals, and agent chats without
                leaving vim. yank code from one chat/file, paste into another.
                jump tmux windows to a different project, yank a pattern, bring
                it back. agent CLIs can refer to external directories on disk.
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
                to ssh from my phone or tablet. same session, from wherever. i
                use a{' '}
                <a
                  href="https://daylightcomputer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Daylight DC-1
                </a>{' '}
                tablet for coding outdoors and at night.
              </p>

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
            </Accordion>

            <Accordion defaultOpen={false} title="AGENTS">
              <p>
                i run{' '}
                <a
                  href="https://www.google.com/search?q=codex+cli"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Codex CLI
                </a>{' '}
                and{' '}
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
              <p>
                i use{' '}
                <a
                  href="https://github.com/lnittman/halo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  halo
                </a>
                , a universal prompt framework with templates and commands.
                instead of writing prompts from scratch, i use commands like
                /prime, /build, /test, /docs. external commands like
                /external:codex or /external:claude generate structured prompts
                for specific tools. components library has reusable patterns—XML
                structures, reasoning patterns, output formats. makes prompts
                consistent and saves me from reinventing the wheel.
              </p>

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
me → codex: "build presence feature"
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
            </Accordion>

            <Accordion defaultOpen={false} title="FLYWHEELS">
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
                — searches docs across web and private sources. i use this
                throughout development whenever i need official context. their
                private knowledge base features work well—you can add private
                repos and the agent can reference them.
              </p>
              <p>faster loop, faster shipping.</p>

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

   ┌─────────────┐     ref MCP
   │    WRITE    │ ◄── official context
   │   feature   │     when needed
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
   ┌─────────────┐     playwright MCP
   │   VERIFY    │ ◄── UI checks
   │   working   │     vercel MCP
   └──────┬──────┘     deployment status
          │
          └──────► iterate faster`}
                </pre>
              </div>
            </Accordion>

            <Accordion defaultOpen={false} title="PATTERNS">
              <p>
                having cross-repo context matters. i can always see multiple
                projects in tmux windows and yank/paste between them. the
                filesystem becomes a library of working patterns. be as
                organized as you need. form a working mental model around your
                ~/Developer directory.
              </p>
              <p>
                when you need presence: find a reference project that has it,
                yank relevant context, paste into the new project, adapt. same
                with API clients, hooks, components, styles, config. everything
                is already working somewhere.
              </p>
              <p>
                "implement presence like project-a" - the agent reads project-a,
                understands the pattern, replicates it for the current context.
                this works well when using the same tools across projects—same
                state management, same API patterns, same composition
                strategies. products must have differentiators but many
                'features' are boilerplate / common.
              </p>
              <p>
                patterns can be reused. avoid the trap of 'learning' how to
                implement XYZ repeatedly—build a workflow around writing good
                prompts. energy goes into prompts, not memorizing
                implementation. implementation always informs the prompt.
              </p>
              <p>
                if you capture the pattern behind something silly that inspires
                you, that toolset can make for something meaningful later on.
                patterns from experiments become building blocks. random ideas
                are very important, *not* a waste of time.
              </p>
              <p>
                curiosity matters more now. if you understand software you can
                find great examples and reference points. github explore is
                invaluable—find libraries and repos you like, ask claude how
                they're made, how you'd implement their features in your
                codebase adapted to your preferred tech.
              </p>
              <p>
                LLMs aren't the first tool for building software in semantic
                terms but for me it's by far the most instinctive. i can speak
                exactly what i mean and the agent attempts to do it. you can
                tend your own garden and create a personalized framework with
                hooks for contextual relevancy at the most personalized points
                of integration with actual development workflows.
              </p>
              <p>
                it involves 'giving up' on coding as it was done before and
                'leaning in' to the promise that your taste and technical skill
                and personality will ultimately shine through in-app.
              </p>

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
├─ presence/ (user status)
├─ hooks/ (data fetching)
└─ api/ (client setup)
         │
         │ yank pattern
         ▼
project 2
├─ presence/ ✓ (adapted)
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
            </Accordion>

            <Accordion defaultOpen={false} title="LINKS">
              <p>hardware:</p>
              <ul>
                <li>
                  <a
                    href="https://daylightcomputer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Daylight DC-1
                  </a>{' '}
                  — tablet for outdoor/night coding
                </li>
              </ul>

              <p>terminal + environment:</p>
              <ul>
                <li>
                  <a
                    href="https://ghostty.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ghostty
                  </a>{' '}
                  — GPU-accelerated terminal
                </li>
                <li>
                  <a
                    href="https://github.com/tmux/tmux"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tmux
                  </a>{' '}
                  — terminal multiplexer
                </li>
                <li>
                  <a
                    href="https://neovim.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Neovim
                  </a>{' '}
                  — vim-based text editor
                </li>
                <li>
                  <a
                    href="https://www.lazyvim.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LazyVim
                  </a>{' '}
                  — vim plugin manager
                </li>
                <li>
                  <a
                    href="https://github.com/lnittman/config"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    lnittman/config
                  </a>{' '}
                  — my dotfiles
                </li>
              </ul>

              <p>remote access:</p>
              <ul>
                <li>
                  <a
                    href="https://termius.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termius
                  </a>{' '}
                  — SSH client for iOS/Android
                </li>
                <li>
                  <a
                    href="https://tailscale.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tailscale
                  </a>{' '}
                  — VPN for device access
                </li>
              </ul>

              <p>AI agents:</p>
              <ul>
                <li>
                  <a
                    href="https://www.google.com/search?q=codex+cli"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Codex CLI
                  </a>{' '}
                  — GPT-5 coding agent
                </li>
                <li>
                  <a
                    href="https://claude.com/claude-code"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Claude Code
                  </a>{' '}
                  — CLI agent with MCP
                </li>
                <li>
                  <a
                    href="https://github.com/lnittman/halo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    halo
                  </a>{' '}
                  — prompt framework
                </li>
              </ul>

              <p>MCP servers:</p>
              <ul>
                <li>
                  <a
                    href="https://docs.convex.dev/client/mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Convex MCP
                  </a>{' '}
                  — backend integration
                </li>
                <li>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vercel MCP
                  </a>{' '}
                  — deployment management
                </li>
                <li>
                  <a
                    href="https://playwright.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Playwright MCP
                  </a>{' '}
                  — browser automation
                </li>
                <li>
                  <a
                    href="https://github.com/cameroncooke/XcodeBuildMCP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xcode MCP
                  </a>{' '}
                  — iOS/macOS builds
                </li>
                <li>
                  <a
                    href="https://github.com/modelcontextprotocol/servers/tree/main/src/ref"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ref MCP
                  </a>{' '}
                  — docs search + private repos
                </li>
              </ul>
            </Accordion>
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
