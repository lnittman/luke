# Deployment Workflow Commands

This document provides commands and workflows for deploying the project to various environments. Use these commands to build, test, and deploy the application.

## Deployment Environments

The project supports the following deployment environments:

1. **Development**: For testing new features
2. **Staging**: For pre-production testing
3. **Production**: For live users

## Build Process

### Production Build

```bash
# Create production build
npm run build

# Analyze bundle size
npm run build:analyze
```

### Environment-Specific Builds

```bash
# Development build
NODE_ENV=development npm run build

# Staging build
NODE_ENV=staging npm run build

# Production build
NODE_ENV=production npm run build
```

## Deployment to Vercel

### Automatic Deployment

The project is configured for automatic deployment with Vercel:

- **Main branch**: Deploys to production
- **Develop branch**: Deploys to staging
- **Feature branches**: Deploy to preview environments

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to development
vercel

# Deploy to production
vercel --prod
```

## Deployment to Other Platforms

### AWS Amplify

```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in the project
amplify init

# Deploy to Amplify
amplify publish
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Docker Deployment

```bash
# Build Docker image
docker build -t [PROJECT_NAME] .

# Run Docker container locally
docker run -p 3000:3000 [PROJECT_NAME]

# Push to Docker registry
docker tag [PROJECT_NAME] [REGISTRY]/[PROJECT_NAME]:[VERSION]
docker push [REGISTRY]/[PROJECT_NAME]:[VERSION]
```

## Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name [MIGRATION_NAME]

# Apply migrations to production
npx prisma migrate deploy
```

## Environment Variables

```bash
# Set environment variables for different environments
vercel env add [KEY] [VALUE] --environment production
vercel env add [KEY] [VALUE] --environment preview
vercel env add [KEY] [VALUE] --environment development
```

## Monitoring and Logging

```bash
# View logs
vercel logs

# View specific deployment logs
vercel logs [DEPLOYMENT_ID]
```

## Rollback Procedures

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback
```

## Continuous Deployment

The project uses GitHub Actions for CD:

```yaml
# Example GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Pre-Deployment Checklist

Before deploying to production:

1. Run all tests: `npm test`
2. Check bundle size: `npm run build:analyze`
3. Verify environment variables
4. Run security audit: `npm audit`
5. Test in staging environment
6. Prepare database migrations

## Post-Deployment Verification

After deployment:

1. Verify application is running
2. Check critical user flows
3. Monitor error rates
4. Verify API endpoints
5. Check database migrations

## Troubleshooting

### Common Issues

1. **Build failures**:
   ```bash
   # Clear cache and node_modules
   rm -rf .next node_modules
   npm install
   ```

2. **Environment variable issues**:
   ```bash
   # Verify environment variables
   vercel env ls
   ```

3. **Database connection issues**:
   ```bash
   # Check database connection
   npx prisma db pull
   ```

4. **Deployment timeouts**:
   ```bash
   # Increase build timeout
   vercel --build-timeout 30m
   ``` 