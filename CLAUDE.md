# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Luke Nittmann built with Next.js 15 App Router, featuring:
- AI-generated hero text using OpenRouter/GPT-4
- Brutalist design inspired by www-internet-v2
- Interactive WebGL fluid simulation
- Comprehensive project showcase with accordion navigation
- Multiple theme system (light/dark/stone)
- Progressive Web App capabilities

## Commands

### Development
```bash
pnpm dev          # Start dev server on port 9000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Next.js linting
```

Note: Resume generation commands removed - resume functionality extracted to separate `../resume` repository.

## Architecture

### Technology Stack
- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript with path aliases (@/* for src/*)
- **UI**: React 19 + Shadcn/UI (New York style) + Radix UI primitives
- **Styling**: TailwindCSS v4 with CSS variables (no SCSS)
- **Animation**: Framer Motion for interactions and page transitions
- **Interactive**: Canvas API for WebGL fluid simulation (NO Three.js)
- **State**: Modal context for UI state management
- **AI**: OpenRouter and Google Vertex AI integrations

### Design Philosophy
- **Brutalist Minimalism**: Clean, functional design celebrating raw technical capabilities
- **Terminal-Inspired**: Monospace typography with developer-focused visual language
- **Grid-Based Layout**: Structured boundaries with consistent spacing
- **Theme System**: Multiple color schemes with Luke's current theme as default

### Directory Structure
```
src/
├── app/
│   ├── about/           # About page
│   ├── work/            # Work experience and skills
│   ├── projects/        # Project showcase
│   ├── api/             # API routes (hero text generation)
│   └── dev/             # Development pages
├── components/
│   ├── layout/          # Brutalist layout components (Container, Section, ActionList)
│   ├── interactive/     # WebGL fluid canvas
│   ├── projects/        # Project accordion components
│   ├── about/           # About page components
│   ├── work/            # Work page components
│   ├── ui/              # Shadcn/UI + modal system
│   ├── header/          # Enhanced header with navigation
│   ├── hero/            # Redesigned hero with brutalist layout
│   └── theme/           # Extended theme switcher (3 themes)
├── lib/
│   ├── modal-context.tsx # Context-based modal management
│   └── utils/           # Utility functions
└── styles/
    └── globals.css      # Enhanced with brutalist component styles
```

### Key Files
- `src/constants/projects.ts` - Project showcase data structure (8 projects)
- `src/app/api/hero/route.ts` - AI hero text generation endpoint
- `src/lib/modal-context.tsx` - Modal state management system
- `src/components/interactive/FluidCanvas.tsx` - WebGL fluid simulation
- `components.json` - Shadcn/UI configuration

### Page Structure
- **Home (/)**: Enhanced hero with WebGL background, navigation grid, contact info
- **About (/about)**: Personal background, interests, contact information
- **Work (/work)**: Professional experience, skills breakdown, resume links
- **Projects (/projects)**: Accordion-based showcase of 8 projects with detailed breakdowns

### Component Patterns
- **Brutalist Components**: All use `brutalist-*` CSS classes from globals.css
- **Layout System**: Container, Section, ActionList for consistent spacing
- **Modal System**: Context-based with stack support for overlays
- **Theme Integration**: All components use CSS variable color system
- **Animation**: Framer Motion for staggered reveals and hover effects

### Interactive Features
- **WebGL Fluid Canvas**: Particle-based fluid simulation (NO Three.js Bouba Kiki)
- **Project Accordions**: Expandable project details with animations
- **Theme Switching**: Light/Dark/Stone themes with persistent selection
- **Modal System**: Stack-based modal management for future features
- **Responsive Navigation**: Desktop header nav + mobile-friendly layouts

## Styling Architecture

### CSS Variables Theme System
```css
:root {
  --background-start / --background-end  # Gradient backgrounds
  --accent-1 / --accent-2                # Interactive elements
  --text-primary / --text-secondary      # Text hierarchy
  --surface-1 / --surface-2              # Component backgrounds
  --border                               # Consistent borders
  --glow                                 # Hover effects
}
```

### Brutalist Component Classes
- `.brutalist-container` - Main layout container with borders
- `.brutalist-section` - Content sections with surface backgrounds
- `.brutalist-button` - Interactive elements
- `.brutalist-card` - Project and content cards
- `.brutalist-divider` - Section separators

### Theme Variants
- **Light**: Zen Garden (soft sage and stone)
- **Dark**: Night Rain (deep indigo with mist)  
- **Stone**: Deep warm stone color palette

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
Resume functionality extracted to separate `../resume` repository.
Work page includes links to external resume system.

### Performance Considerations
- WebGL canvas optimized with proper cleanup
- Component lazy loading for smooth interactions
- Framer Motion animations with reduced motion support
- CSS variables for instant theme switching

## Design Constraints

### What NOT to Include
- No Three.js Bouba Kiki morphing shapes
- No SCSS - pure Tailwind v4 with globals.css only
- No bio/resume pages - use about/work structure instead
- No overcomplicated animations - maintain brutalist minimalism

### Key Principles
- Function over form with thoughtful details
- Terminal aesthetics for developer audience
- Consistent grid-based spacing
- Accessible keyboard navigation
- Mobile-responsive design