# Next Project

This is a template for Next projects generated with Luke.

## Getting Started

Follow the instructions in init.md to get started.

# Next.js Project Structure

This template provides the recommended directory structure for modern Next.js applications with AI integration. The structure follows best practices for organization, scalability, and maintainability.

## Directory Structure

```
/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication routes (grouped)
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── (dashboard)/          # Protected dashboard routes (grouped)
│   │   ├── layout.tsx        # Dashboard layout
│   │   └── page.tsx          # Dashboard page
│   ├── api/                  # API routes
│   │   ├── ai/               # AI model endpoints
│   │   │   └── [[...path]]/  # Catch-all AI route
│   │   ├── agent/            # Background agent functions
│   │   └── tools/            # Different capabilities and integrations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── specialized/          # Specific interface components
│   ├── forms/                # Form components and validation
│   └── layouts/              # Layout components
├── lib/                      # Shared utilities
│   ├── agents/               # Agent framework and workflows
│   ├── utils/                # Helper functions
│   ├── db/                   # Database client and models
│   └── ai/                   # AI model wrappers
├── providers/                # Context providers
│   └── index.tsx             # Root provider
├── public/                   # Static assets
├── styles/                   # Global styles
│   └── globals.css           # Tailwind directives
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma         # Database schema
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Key Files and Their Purpose

- **app/layout.tsx**: Root layout with providers and global elements
- **lib/db/index.ts**: Database client setup
- **lib/ai/config.ts**: AI model configuration
- **components/ui/index.ts**: Re-exports of UI components
- **providers/index.tsx**: Composition of all providers

## Development Workflow

1. **Setup**: Run `npm install` to install dependencies
2. **Development**: Use `npm run dev` to start the development server
3. **Database**: Run `npx prisma migrate dev` to apply schema changes
4. **Testing**: Execute `npm test` to run tests
5. **Build**: Create production build with `npm run build`
6. **Deploy**: Deploy to Vercel with `vercel deploy`

Refer to tech.md for the complete technology stack details and design.md for architectural decisions.
