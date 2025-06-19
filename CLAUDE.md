# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Luke Nittmann built with Next.js 15 App Router, featuring:
- AI-generated hero text using OpenRouter/GPT-4
- Project showcase with detailed technical documentation
- Automated multi-format resume generation system
- Progressive Web App capabilities
- Dark/light theme switching

## Commands

### Development
```bash
pnpm dev          # Start dev server on port 9000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Next.js linting
```

### Resume Generation
```bash
pnpm run resume:all     # Generate all resume formats (styled + LaTeX)
pnpm run resume:styled  # Generate styled PDFs only
pnpm run resume:latex   # Generate LaTeX PDFs only
pnpm run resume:clean   # Clean output directories
pnpm run resume:view    # Open output folder
```

Resume outputs are organized in `docs/resume/output/`:
- `styled/` - Modern CSS-styled PDFs
- `latex/` - Traditional LaTeX PDFs

## Architecture

### Technology Stack
- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript with path aliases (@/* for src/*)
- **UI**: React 19 + Shadcn/UI (New York style) + Radix UI primitives
- **Styling**: TailwindCSS v4 with CSS variables
- **State**: Zustand for state management
- **AI**: OpenRouter and Google Vertex AI integrations

### Directory Structure
```
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes (hero text generation)
│   └── dev/          # Development pages
├── components/       # React components
│   ├── ui/           # Shadcn/UI component library
│   └── [features]/   # Feature-specific components
├── constants/        # Project data and constants
├── hooks/            # Custom React hooks
├── lib/utils/        # Utility functions
└── styles/           # Global CSS
```

### Key Files
- `src/constants/projects.ts` - Project showcase data structure
- `src/app/api/hero/route.ts` - AI hero text generation endpoint
- `components.json` - Shadcn/UI configuration

### Component Patterns
- Server Components by default
- Client Components marked with 'use client'
- Shadcn/UI components in `src/components/ui/`
- Feature components follow existing patterns in respective directories

## Development Notes

### No Testing Framework
Currently no test files or testing framework implemented.

### Environment Variables
Check for AI API keys and configuration when working with:
- Hero text generation (OpenRouter/Vertex AI)
- Any API integrations

### PWA Configuration
Service worker and manifest files in `public/` directory.
Headers configured in `next.config.mjs`.

### Resume System
- Source files: `docs/resume/resume*.md`
- Generation scripts: `scripts/generate-*.sh`
- Dependencies: `md-to-pdf` (styled), `pandoc` + `xelatex` (LaTeX)