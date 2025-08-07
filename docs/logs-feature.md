# GitHub Activity Logs Feature

## Overview
The logs feature provides daily AI-powered summaries of your GitHub activity. It automatically fetches your GitHub activity each day, analyzes it using AI, and creates a comprehensive log with insights about your development work.

## Features
- **Daily Automated Logs**: Cron job runs at 11:59 PM daily to generate logs
- **AI-Powered Analysis**: Uses Mastra workflows and OpenAI to analyze commits, PRs, issues
- **Brutalist UI**: Clean, terminal-inspired interface consistent with the site design
- **Generative UI Components**: Different card types for commits, PRs, issues, and reviews
- **Streaming Updates**: Real-time feedback when generating logs manually

## Setup

### 1. Database Setup
Create a Neon database and add the connection string to your `.env`:
```env
DATABASE_URL=postgresql://user:password@host/database
```

Run migrations:
```bash
pnpm db:push
```

### 2. GitHub Integration
1. Create a GitHub Personal Access Token with `repo` and `user` scopes
2. Add to `.env`:
```env
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_USERNAME=your-username
NEXT_PUBLIC_GITHUB_USERNAME=your-username
```

### 3. OpenAI API
Add your OpenAI API key:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

### 4. Cron Job (Production)
For Vercel deployment:
1. Add a cron secret to `.env`:
```env
CRON_SECRET=your-secret-string
```
2. The `vercel.json` is already configured to run daily at 11:59 PM

### 5. Deploy
```bash
vercel --prod
```

## Architecture

### Technology Stack
- **Database**: Drizzle ORM + Neon Postgres
- **AI Framework**: Mastra (agents, workflows, tools)
- **AI SDK**: Vercel AI SDK v5 with streaming
- **GitHub API**: Octokit
- **UI**: React Server Components + Framer Motion

### Data Flow
1. Cron job triggers at 11:59 PM
2. Mastra workflow executes:
   - Fetches GitHub activity via Octokit
   - Analyzes with AI agents
   - Generates summary and insights
   - Stores in database
3. UI displays logs with generative components

### Database Schema
- `activity_logs`: Main log entries with summaries
- `activity_details`: Individual activities (commits, PRs, etc.)

## Usage

### Manual Log Generation
Visit `/logs` and click "Generate Now" to create a log for today.

### Viewing Logs
- **List View**: `/logs` - Shows all daily summaries
- **Detail View**: `/logs/[id]` - Full activity breakdown

### Keyboard Navigation
Press `l` from anywhere to navigate to logs.

## Components

### Mastra Agents
- **commitAnalyzerAgent**: Analyzes commit messages and code changes
- **activitySummarizerAgent**: Creates daily summaries
- **repoAnalyzerAgent**: Provides repository context

### UI Components
- **LogGenerator**: Streaming UI for manual generation
- **ActivityCard**: Generative cards for different activity types
- **Brutalist Cards**: Consistent design system integration

## API Routes
- `/api/logs` - Fetch logs (GET) and log details (POST)
- `/api/logs/analyze` - Manual log generation
- `/api/cron/daily-log` - Automated daily generation

## Development

### Local Testing
```bash
# Start dev server
pnpm dev

# Test cron job manually
curl http://localhost:9000/api/cron/daily-log

# Test analysis
curl http://localhost:9000/api/logs/analyze?username=your-username
```

### Database Management
```bash
pnpm db:studio  # Open Drizzle Studio
pnpm db:push    # Push schema changes
```

## Troubleshooting

### No logs appearing
- Check GitHub token has correct permissions
- Verify username in environment variables
- Check database connection

### AI analysis failing
- Verify OpenAI API key is valid
- Check rate limits
- Review Mastra agent logs

### Cron job not running
- Verify CRON_SECRET matches in Vercel
- Check Vercel function logs
- Ensure function timeout is sufficient (60s)