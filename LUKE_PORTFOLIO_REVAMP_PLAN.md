# Luke Portfolio Website Revamp Plan

## Executive Summary

This comprehensive plan outlines the transformation of Luke's minimal portfolio into a sophisticated, professionally compelling website that combines the interactive features of the Adam app with the distinctive brutalist design philosophy of www-internet-v2, while leveraging Luke's existing project portfolio from `constants/projects.ts`.

## Design Philosophy & Visual Direction

### Core Aesthetic: **Technical Brutalism**
- **Brutalist Minimalism**: Clean, functional design celebrating raw technical capabilities
- **Terminal-Inspired**: Monospace typography with developer-focused visual language
- **Grid-Based Layout**: Structured boundaries with consistent spacing
- **Theme System**: Multiple color schemes (keeping Luke's current theme colors as default)

### Visual Hierarchy
- **Typography**: Monospace font family with 9 font options for user customization
- **Color System**: Current Luke theme as primary, with additional dark/light variants
- **Layout**: Max-width centered content with consistent padding and borders
- **Spacing**: Strict grid system with pixel-perfect alignment

## Technical Architecture

### Framework & Stack (Maintained)
- **Next.js 15.3.1** with App Router ✓
- **TypeScript** with path aliases ✓ 
- **React 19** ✓
- **TailwindCSS v4** (migrate from current CSS to match brutalist approach)
- **Shadcn/UI** (enhance with custom brutalist components)

### New Dependencies to Add
```json
{
  "three": "^0.150.0",
  "@types/three": "^0.150.0",
  "framer-motion": "^10.0.0", // Already available
  "canvas-confetti": "^1.6.0"
}
```

### Enhanced Architecture
- **SCSS Modules**: Transition from pure Tailwind to SCSS modules for component-level styling
- **Context-Based State**: Modal management system from Adam app
- **Interactive Elements**: Three.js integration for 3D graphics
- **PWA Enhancement**: Offline capabilities and app-like experience

## Page Structure & Content

### 1. Home Page (`/`)
**Current**: Basic name, contact, time, theme switcher
**New**: Enhanced hero section with interactive elements

```
┌─ HERO SECTION ─────────────────────────────────┐
│ [Interactive 3D Element or WebGL Fluid]        │
│                                                 │
│ LUKE NITTMANN                                   │
│ software engineer                               │
│                                                 │
│ [Contact Info] [Theme Switcher] [Local Time]   │
└─────────────────────────────────────────────────┘

┌─ QUICK NAVIGATION ─────────────────────────────┐
│ > projects                                      │
│ > bio                                           │
│ > resume                                        │
│ > contact                                       │
└─────────────────────────────────────────────────┘
```

### 2. Projects Page (`/projects`)
**Structure**: Accordion-based project showcase using Luke's existing project data

```
┌─ PROJECTS ─────────────────────────────────────┐
│                                                 │
│ [🌳 arbor] ─────────────────────── [EXPAND ▼] │
│   a framework for digital horticulture         │
│                                                 │
│ [🐙 squish] ────────────────────── [EXPAND ▼] │
│   semantic social network for content...       │
│                                                 │
│ [⚽️ voet] ─────────────────────── [EXPAND ▼] │
│   football intelligence platform               │
│                                                 │
│ [...continue for all 8 projects...]            │
└─────────────────────────────────────────────────┘
```

**Expanded Project View**:
```
┌─ ARBOR ────────────────────────────────────────┐
│ > overview     > core     > architecture       │
│ > stack                                         │
│                                                 │
│ [Demo] [Source] [App Link]                     │
│                                                 │
│ ┌─ OVERVIEW ─────────────────────────────────┐ │
│ │ • agentic project research + docs gen      │ │
│ │ • LLM-driven development companion         │ │
│ │ • interactive coding assistance            │ │
│ │ • tech documentation search                │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [Videos/Demos if available]                     │
└─────────────────────────────────────────────────┘
```

### 3. Bio Page (`/bio`)
**New Page**: Professional background and personality

```
┌─ BIO ──────────────────────────────────────────┐
│                                                 │
│ ┌─ PROFESSIONAL ─────────────────────────────┐ │
│ │ Software engineer focused on AI/ML systems │ │
│ │ and developer tools. Experience building   │ │
│ │ full-stack applications with modern web    │ │
│ │ technologies and machine learning.         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─ CURRENT ──────────────────────────────────┐ │
│ │ Building tools that make developers more   │ │
│ │ productive. Interested in AI-augmented     │ │
│ │ development workflows.                     │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─ INTERESTS ────────────────────────────────┐ │
│ │ • Machine Learning & AI                    │ │
│ │ • Developer Experience                     │ │
│ │ • Full-Stack Development                   │ │
│ │ • Audio/Music Technology                   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 4. Resume Page (`/resume`)
**Integration**: Link to external resume system, but provide preview

```
┌─ RESUME ───────────────────────────────────────┐
│                                                 │
│ ┌─ QUICK ACCESS ─────────────────────────────┐ │
│ │ [Download PDF] [View LaTeX] [View Styled]  │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─ PREVIEW ──────────────────────────────────┐ │
│ │ LUKE NITTMANN                               │ │
│ │ Software Engineer                           │ │
│ │                                             │ │
│ │ EXPERIENCE                                  │ │
│ │ • Recent positions...                       │ │
│ │                                             │ │
│ │ SKILLS                                      │ │
│ │ • Technical expertise...                    │ │
│ │                                             │ │
│ │ [Full details in PDF versions]              │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Interactive Features & Enhancements

### 1. 3D/Interactive Elements (from Adam)
- **Hero Animation**: Either Three.js morphing shapes or WebGL fluid simulation
- **Subtle Interactions**: Hover effects on project cards and navigation
- **Loading States**: Smooth transitions between pages

### 2. Enhanced Navigation
- **Modal System**: Context-based modal management for project details
- **Keyboard Navigation**: Full accessibility support
- **Smooth Animations**: Framer Motion for page transitions

### 3. Theme System Enhancement
- **Multiple Options**: Light, dark, and specialty themes
- **Current Luke Theme**: Maintain as default primary theme
- **User Preference**: Persistent theme selection

## Component Library Development

### Core Components to Build

#### 1. Layout Components
```scss
// layout/Container.module.scss
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid var(--border-color);
}
```

#### 2. Navigation Components
```typescript
// components/ActionList.tsx
interface ActionListProps {
  items: Array<{
    label: string;
    href: string;
    icon?: string;
  }>;
}
```

#### 3. Project Components
```typescript
// components/ProjectAccordion.tsx
interface ProjectAccordionProps {
  projects: Project[];
  expandedId?: string;
  onToggle: (id: string) => void;
}
```

#### 4. Interactive Components
```typescript
// components/InteractiveHero.tsx - Three.js integration
// components/FluidCanvas.tsx - WebGL fluid simulation
// components/ThemeSelector.tsx - Enhanced theme switching
```

## Implementation Strategy

### Phase 1: Foundation (Week 1)
1. **Setup New Architecture**
   - Install new dependencies (Three.js, enhanced motion)
   - Create SCSS module structure
   - Set up component library foundation

2. **Layout System**
   - Implement brutalist grid system
   - Create core layout components (Container, Grid, etc.)
   - Set up typography system with monospace fonts

3. **Enhanced Theme System**
   - Extend current theme system
   - Add multiple theme variants
   - Implement theme persistence

### Phase 2: Pages & Content (Week 2)
1. **Home Page Enhancement**
   - Add interactive hero element (choose between 3D shapes or fluid)
   - Implement enhanced navigation
   - Improve contact information display

2. **Projects Page**
   - Build accordion system using existing project data
   - Create project detail components
   - Add video/demo integration
   - Implement modal system for expanded views

3. **Bio Page Creation**
   - Design and implement new bio page
   - Add professional background content
   - Include personality and interests sections

### Phase 3: Advanced Features (Week 3)
1. **Interactive Elements**
   - Complete Three.js or WebGL integration
   - Add subtle animations throughout
   - Implement advanced modal system

2. **Resume Integration**
   - Create preview components
   - Link to external resume system
   - Add download functionality

3. **PWA Enhancement**
   - Improve offline capabilities
   - Add app-like features
   - Optimize performance

### Phase 4: Polish & Launch (Week 4)
1. **Performance Optimization**
   - Code splitting optimization
   - Image optimization
   - Loading state improvements

2. **Accessibility & Testing**
   - Full keyboard navigation
   - Screen reader compatibility
   - Cross-browser testing

3. **Documentation & Deployment**
   - Update CLAUDE.md with new architecture
   - Deploy and test production build
   - Performance monitoring setup

## Content Strategy

### Project Showcase Enhancement
Luke's existing 8 projects provide excellent content:
- **arbor**: AI-powered development tools
- **squish**: Social content discovery
- **voet**: Football intelligence platform
- **sine**: iOS music creation app
- **helios**: macOS display control
- **ther**: Mental wellness companion
- **loops**: Audio stem player
- **jobs**: LinkedIn + AI integration

### Content Improvements
1. **Project Descriptions**: Enhance with more compelling copy
2. **Technical Deep Dives**: Add architecture diagrams where appropriate
3. **Demo Integration**: Better integration of videos and live demos
4. **Case Studies**: Expanded project stories with challenges/solutions

## Technical Implementation Details

### File Structure Changes
```
src/
├── app/
│   ├── bio/page.tsx           # New bio page
│   ├── projects/page.tsx      # Enhanced projects
│   ├── resume/page.tsx        # New resume page
│   └── globals.css            # Enhanced with brutalist base
├── components/
│   ├── interactive/           # Three.js and WebGL components
│   ├── layout/               # Grid and container components
│   ├── projects/             # Project-specific components
│   └── ui/                   # Enhanced Shadcn components
├── styles/
│   ├── globals.scss          # Base brutalist styles
│   └── themes/               # Multiple theme variants
└── lib/
    ├── three-utils.ts        # Three.js utilities
    └── modal-context.tsx     # Modal management
```

### Performance Considerations
- **Code Splitting**: Lazy load Three.js components
- **Image Optimization**: Next.js Image component for all media
- **Bundle Analysis**: Monitor bundle size with new dependencies
- **Caching Strategy**: Optimize for repeat visits

## Success Metrics

### User Experience Goals
- **First Impression**: Memorable, professional landing experience
- **Project Discovery**: Easy exploration of technical work
- **Professional Credibility**: Clear demonstration of skills
- **Accessibility**: Full keyboard and screen reader support

### Technical Goals
- **Performance**: Lighthouse score >90 across all metrics
- **SEO**: Proper meta tags and structured data
- **PWA**: App-like experience with offline capabilities
- **Maintainability**: Clean, documented codebase

## Risk Mitigation

### Potential Challenges
1. **Complexity Creep**: Keep brutalist minimalism in focus
2. **Performance Impact**: Monitor bundle size with 3D elements
3. **Browser Compatibility**: Test WebGL across devices
4. **Content Balance**: Avoid overwhelming with technical details

### Mitigation Strategies
1. **Progressive Enhancement**: Core functionality without JavaScript
2. **Fallback Options**: Simple alternatives for complex features
3. **Performance Budget**: Set and monitor metrics
4. **User Testing**: Gather feedback from technical and non-technical users

## Conclusion

This revamp plan transforms Luke's minimal portfolio into a compelling showcase that balances technical sophistication with professional presentation. By combining Adam's interactive elements with www-internet-v2's distinctive brutalist aesthetic, while leveraging Luke's strong project portfolio, the result will be a unique and memorable developer portfolio that effectively communicates technical expertise and creativity.

The phased implementation approach ensures manageable development while maintaining the site's availability throughout the process. The focus on performance, accessibility, and maintainability ensures the revamped site will serve Luke's professional goals effectively for years to come.