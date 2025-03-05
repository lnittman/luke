# Project Setup Commands

This document provides commands and workflows for setting up the project environment. Use these commands to initialize the project, install dependencies, and configure the development environment.

## Environment Setup

### Prerequisites Check

```bash
# Check Node.js version
node -v  # Should be v20.x or later

# Check npm version
npm -v   # Should be v10.x or later

# Check Git version
git --version
```

### Repository Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Initialize Git if starting from scratch
git init
git branch -M main
```

### Dependencies Installation

```bash
# Install dependencies with npm
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

## Configuration

### Environment Variables

```bash
# Copy example environment file
cp .env.example .env.local

# Edit environment variables
# Replace placeholders with actual values:
# - API_KEY=your-api-key
# - DATABASE_URL=your-database-url
# - etc.
```

### Database Setup

```bash
# Initialize database (if using Prisma)
npx prisma generate
npx prisma db push

# Run migrations
npx prisma migrate dev
```

## Development Server

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

## Verification Steps

After setup, verify the installation by:

1. Checking that the development server starts without errors
2. Confirming database connections are working
3. Verifying API endpoints are accessible
4. Running the test suite to ensure everything is working

```bash
# Run tests
npm test
```

## Troubleshooting

### Common Issues

1. **Missing dependencies**:
   ```bash
   npm install --force
   ```

2. **Port conflicts**:
   ```bash
   # Change port in package.json or .env file
   # Or kill process using the port
   npx kill-port 3000
   ```

3. **Database connection issues**:
   ```bash
   # Check database connection
   npx prisma db pull
   ```

4. **Node version mismatch**:
   ```bash
   # Install nvm and use correct Node version
   nvm install 20
   nvm use 20
   ```

## Next Steps

After completing setup:

1. Review the project structure in `docs/overview.md`
2. Explore the architecture in `architecture/components.md`
3. Set up your IDE with recommended extensions
4. Run through the development workflow in `prompts/commands/development.md` 