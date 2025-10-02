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

            <Accordion defaultOpen={false} title="PROMPTS">
              <p>
                copy these prompts into your AI coding agent. they're designed to
                run from your ~ directory and demonstrate the workflow patterns
                described above.
              </p>

              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: '1rem',
                    color: 'rgb(var(--text-primary))',
                    fontWeight: 'bold',
                  }}
                >
                  1. ENVIRONMENT SETUP
                </p>
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {`<environment_setup>
<context>
i want to set up an ai-native development environment following Luke Nittmann's workflow from lukenittmann.com/process. i need you to scaffold my ~/Developer directory and configure essential tools.
</context>

<requirements>
  <directory_structure>
    create ~/Developer/ as the root workspace
    organize all projects under this directory
    maintain clean separation between projects
  </directory_structure>

  <essential_repos>
    clone lnittman/config (dotfiles: nvim, tmux, zsh)
    clone lnittman/halo (prompt framework)
    set up proper symlinks to ~/.config and ~/.halo
  </essential_repos>

  <verification>
    verify all symlinks are correct
    check that commands are in PATH
    test basic functionality
  </verification>
</requirements>

<execution_steps>
1. create ~/Developer directory structure
2. clone repositories:
   - git clone https://github.com/lnittman/config.git ~/Developer/config
   - git clone https://github.com/lnittman/halo.git ~/Developer/halo

3. run config setup script:
   - cd ~/Developer/config
   - ./setup.sh

4. link halo to ~/.halo:
   - ln -s ~/Developer/halo ~/.halo
   - add to PATH: echo 'export PATH="$HOME/.halo:$PATH"' >> ~/.zshrc
   - source ~/.zshrc

5. verify setup:
   - check nvim config: ls -la ~/.config/nvim
   - check tmux config: ls -la ~/.tmux.conf
   - check halo commands: ls -la ~/.halo/commands
   - test halo: /prime (should be available as command)
</execution_steps>

<success_criteria>
all symlinks created successfully
halo commands accessible from any directory
terminal environment ready for tmux + nvim workflow
able to run /prime command from halo framework
</success_criteria>
</environment_setup>`}
                </pre>
              </div>

              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: '1rem',
                    color: 'rgb(var(--text-primary))',
                    fontWeight: 'bold',
                  }}
                >
                  2. PATTERN-BASED DEVELOPMENT
                </p>
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {`<pattern_development>
<context>
i'm building a feature that i've implemented before in another project. instead of rebuilding from scratch, i want to find the existing pattern in ~/Developer/, understand how it works, and adapt it to my current project.
</context>

<cross_repo_workflow>
  <discovery_phase>
    scan ~/Developer/ for projects with similar features
    identify which project has the best reference implementation
    understand the pattern: components, hooks, API structure, state management
  </discovery_phase>

  <analysis_phase>
    examine the reference implementation:
    - what files are involved?
    - what dependencies does it use?
    - how is state managed?
    - what's the data flow?
    - are there any gotchas or edge cases handled?
  </analysis_phase>

  <adaptation_phase>
    adapt the pattern to current project context:
    - adjust to current tech stack (if different)
    - match existing code style and conventions
    - integrate with current state management
    - update imports and dependencies
    - preserve the core pattern while fitting local architecture
  </adaptation_phase>
</cross_repo_workflow>

<thinking_process>
let me think about this feature:

what pattern am i looking for?
- [describe the feature/pattern you need]

which projects might have this?
- scan ~/Developer/ for likely candidates
- check recent projects first (more likely to match current stack)

what's the reference implementation?
- examine [project-name] at [path]
- key files: [list relevant files]
- pattern structure: [describe architecture]

how do i adapt it?
- current project uses [tech stack]
- reference uses [tech stack]
- adjustments needed: [list differences]
- integration points: [describe how it fits]
</thinking_process>

<output_format>
## Pattern Analysis

**reference project**: ~/Developer/[project-name]
**pattern**: [pattern name/description]
**files involved**: [list files]

## Key Implementation Details

[code snippets or architectural notes from reference]

## Adaptation Plan

1. [step 1: what to copy]
2. [step 2: what to modify]
3. [step 3: how to integrate]

## Code Implementation

[adapted code for current project]

## Verification Steps

- [ ] pattern adapted to current stack
- [ ] integrates with existing architecture
- [ ] maintains reference pattern benefits
- [ ] follows current project conventions
</output_format>
</pattern_development>`}
                </pre>
              </div>

              <div
                style={{
                  width: '100%',
                  border: '1px solid rgb(var(--border))',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: '1rem',
                    color: 'rgb(var(--text-primary))',
                    fontWeight: 'bold',
                  }}
                >
                  3. AGENT ORCHESTRATION
                </p>
                <pre
                  style={{
                    margin: 0,
                    color: 'rgb(var(--text-secondary))',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {`<agent_orchestration>
<context>
i'm working with multiple AI agents simultaneously (like Codex + Claude Code). i need clear handoff prompts that let me coordinate between agents, where one reviews another's work or generates tasks for the other to execute.
</context>

<multi_agent_strategy>
  <agent_roles>
    **builder agent** (Codex, GPT-5):
    - rapid feature implementation
    - follows specs precisely
    - executes defined tasks

    **orchestrator agent** (Claude Code with MCP):
    - uses MCP tools for deployment/testing
    - reviews implementation quality
    - generates detailed handoff prompts
    - debugs with context from multiple sources
  </agent_roles>

  <coordination_patterns>
    ## builder → orchestrator
    "i just implemented [feature]. review the code and suggest improvements."

    ## orchestrator → builder
    "here's a detailed prompt to refine the implementation: [structured prompt]"

    ## orchestrator discovers issue → builder fixes
    "used Playwright MCP to test, found these issues: [list]. here are exact fix tasks: [tasks]"
  </coordination_patterns>
</multi_agent_strategy>

<handoff_template>
when generating prompts for another agent:

## Implementation Context

**what was built**: [feature description]
**current state**: [what works, what doesn't]
**files changed**: [list of files]

## Code Review Findings

[specific issues or improvements needed]

## Refined Requirements

<requirements>
  [structured requirements for next agent]
</requirements>

## Suggested Approach

1. [specific implementation step]
2. [specific implementation step]
3. [verification step]

## Success Criteria

- [ ] [measurable outcome 1]
- [ ] [measurable outcome 2]
- [ ] [measurable outcome 3]
</handoff_template>

<workflow_example>
# typical multi-agent session

## round 1: initial build
me → builder: "implement user presence feature"
builder → implements basic version

## round 2: review + refinement prompt
me → orchestrator: "review this presence implementation"
orchestrator → analyzes code, generates detailed refinement prompt

## round 3: refined build
me → builder: [paste orchestrator's prompt]
builder → implements refined version

## round 4: deployment verification
me → orchestrator: "check deployment with vercel MCP"
orchestrator → uses MCP to verify, finds edge case
orchestrator → generates fix tasks

## round 5: fixes
me → builder: [paste fix tasks]
builder → applies fixes

## result
feature implemented with multiple perspectives
higher quality through review cycles
MCP tools used for real-world verification
clear handoff prompts maintain context
</workflow_example>

<output_format>
when acting as the orchestrator reviewing another agent's work:

## Code Review

**reviewed**: [feature/files]
**quality**: [assessment]
**issues found**: [count]

## Detailed Findings

### Issue 1: [title]
**location**: [file:line]
**problem**: [description]
**fix**: [specific fix]

[repeat for each issue]

## Handoff Prompt for Builder Agent

[generate complete, structured prompt that builder can execute]
</output_format>
</agent_orchestration>`}
                </pre>
              </div>

              <p style={{ marginTop: '1.5rem' }}>
                these prompts use XML structure following{' '}
                <a
                  href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Anthropic's prompt engineering guidelines
                </a>
                . modify them to fit your workflow and project structure.
              </p>
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
