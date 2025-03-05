# Testing Workflow Commands

This document provides commands and workflows for testing the project. Use these commands to run tests, check coverage, and ensure code quality.

## Test Types

The project includes several types of tests:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test complete user flows
4. **API Tests**: Test API endpoints
5. **Performance Tests**: Test application performance

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- src/components/Button.test.tsx

# Run tests with a specific pattern
npm test -- --testNamePattern="Button component"

# Run tests in watch mode
npm test -- --watch
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run specific integration test
npm run test:integration -- api/user
```

### End-to-End Tests

```bash
# Run end-to-end tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- login.spec.ts

# Run E2E tests in headed mode (visible browser)
npm run test:e2e -- --headed
```

### API Tests

```bash
# Run API tests
npm run test:api

# Run specific API test
npm run test:api -- user
```

## Test Coverage

```bash
# Generate test coverage report
npm test -- --coverage

# Open coverage report in browser
npm run coverage:report
```

## Linting and Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run TypeScript type checking
npm run type-check
```

## Continuous Integration

The project uses GitHub Actions for CI. The workflow runs:

1. Linting and type checking
2. Unit and integration tests
3. Build verification
4. E2E tests

To simulate CI locally:

```bash
# Run CI checks locally
npm run ci
```

## Test-Driven Development Workflow

For TDD, follow this workflow:

1. Write a failing test
2. Run the test to confirm it fails
3. Implement the minimum code to make the test pass
4. Run the test to confirm it passes
5. Refactor the code while keeping tests passing
6. Repeat

```bash
# TDD workflow with watch mode
npm test -- --watch
```

## Debugging Tests

### Debug Unit Tests

```bash
# Debug tests in VS Code
# Add a debugger statement in your test
# Then run:
npm run test:debug
```

### Debug E2E Tests

```bash
# Debug E2E tests
npm run test:e2e:debug
```

## Mocking

The project uses Jest for mocking:

```javascript
// Example of mocking a service
jest.mock('../services/userService', () => ({
  getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' })
}));
```

## Test Data Management

```bash
# Generate test data
npm run generate:testdata

# Reset test database
npm run db:test:reset
```

## Performance Testing

```bash
# Run performance tests
npm run test:perf

# Generate performance report
npm run test:perf:report
```

## Troubleshooting

### Common Issues

1. **Tests timing out**:
   ```bash
   # Increase test timeout
   npm test -- --testTimeout=10000
   ```

2. **Flaky tests**:
   ```bash
   # Run tests multiple times
   npm run test:retry
   ```

3. **Memory issues**:
   ```bash
   # Increase Node memory limit
   NODE_OPTIONS=--max_old_space_size=4096 npm test
   ``` 