# Next.js Project Setup Guide

This guide provides detailed setup instructions for getting started with your Next.js AI-enabled project.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later (or yarn/pnpm)
- Git
- VS Code with recommended extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Error Translator
  - Prisma

## Initial Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize Prisma (if using)
npx prisma generate
```

## Environment Variables

Configure your `.env.local` file with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Redis/Upstash (if used)
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

## Development Workflow

### Starting the development server

```bash
npm run dev
```

### Database management

```bash
# Create a new migration
npx prisma migrate dev --name [migration-name]

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Running tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- [test-file-path]

# Run E2E tests
npm run test:e2e
```

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run db:push` | Push schema to database |
| `npm run vercel:deploy` | Deploy to Vercel |

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Docker Deployment

```bash
# Build Docker image
docker build -t [PROJECT_NAME] .

# Run Docker container
docker run -p 3000:3000 [PROJECT_NAME]
```

## Recommended VSCode Extensions

Install the following extensions for an optimal development experience:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitHub Copilot
- Error Lens
- Import Cost

## Troubleshooting

### Common Issues

1. **Next.js build fails**: Check for TypeScript errors with `npm run type-check`
2. **Database connection issues**: Verify DATABASE_URL and network connectivity
3. **Auth.js configuration**: Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly
4. **API rate limiting**: Implement proper caching and request throttling
