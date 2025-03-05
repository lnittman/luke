# Next.js Project Architecture Guide

This document outlines the architecture, design decisions, and implementation patterns for modern Next.js applications.

## Architecture Principles

### 1. Server-First Approach
- Use React Server Components (RSC) as the default
- Minimize client-side JavaScript with selective hydration
- Leverage streaming and suspense for progressive rendering

### 2. Data Fetching Patterns
- Server components: Direct database access with Prisma/Drizzle
- Route handlers: API endpoints with appropriate caching
- Client components: TanStack Query/SWR for client-side data fetching

### 3. AI Integration Architecture
- AI providers abstracted through adapter pattern
- Streaming responses with Vercel AI SDK
- Agent workflows orchestrated through state machines

## Component Architecture

### UI Component Hierarchy
```
BaseComponent (unstyled)
└── ThemedComponent (with design system)
    └── FeatureComponent (with business logic)
        └── PageComponent (composition)
```

### Component Type Organization
- **Atoms**: Basic UI elements (Button, Input, Card)
- **Molecules**: Combinations of atoms (SearchBar, UserCard)
- **Organisms**: Complex UI sections (Navigation, Dashboard)
- **Templates**: Page layouts with placeholder content
- **Pages**: Complete page compositions

## State Management Strategy

### Local vs. Global State
- Local state: React's `useState` for component-specific state
- Global state: Zustand for app-wide state
- Server state: TanStack Query/SWR for remote data

### State Organization
- Feature-based state modules
- Clear action creators and selectors
- Minimal dependencies between state modules

## Database Schema Design

### Entity Relationships
- Normalized schema design with appropriate indexes
- Leveraging Prisma's relation system
- Optimized query patterns for common operations

### Migration Strategy
- Schema changes tracked in version control
- Incremental migrations for production safety
- Seed data for development environments

## AI and Agent System Design

### Agent Workflow Architecture
```
User Request → Intent Classification → Tool Selection → Tool Execution → Response Generation
```

### Tool Registry Pattern
- Tools registered with capabilities metadata
- Dynamic tool selection based on context
- Rate limiting and monitoring built-in

## Authentication Flow

### Auth.js Integration
- JWT token strategy with refresh tokens
- Role-based access control (RBAC)
- OAuth providers for social login

## Styling Architecture

### Tailwind Design System
- Custom theme with consistent color palette
- Extended components with compound variants
- Responsive and accessible by default

## API Design

### RESTful Endpoints
- Resource-based routing
- Consistent error handling
- Proper HTTP verbs and status codes

### GraphQL (Optional)
- Schema-first development
- Type-safe operations
- Optimized data fetching

## Performance Optimization

### Core Web Vitals Focus
- Optimized LCP with image optimization
- Minimized CLS with skeleton loading
- Improved FID/INP with proper code splitting

### Edge Deployment
- Edge functions for geographically distributed computation
- Edge caching for static and dynamic content
- Optimized for global performance

## Developer Experience

### Type Safety
- Shared types between frontend and backend
- End-to-end type safety with tRPC or GraphQL
- Zod validation for runtime type checking

### Testing Strategy
- Unit tests for pure functions and utilities
- Component tests with React Testing Library
- End-to-end tests with Playwright
- Integration tests for API endpoints
