# Testing Guide

Complete guide to testing the Windmill MCP Server.

## Table of Contents

- [Overview](#overview)
- [Test Strategy](#test-strategy)
- [Quick Start](#quick-start)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses **Vitest** as the test framework with three levels of testing:

1. **Unit Tests**: Fast, isolated tests with mocks (no external dependencies)
2. **Integration Tests**: Component integration tests
3. **E2E Tests**: Full end-to-end tests against real Windmill instance

## Test Strategy

### When to Use Each Test Type

| Test Type | Use When | Speed | External Deps | Run Frequency |
|-----------|----------|-------|---------------|---------------|
| Unit | Testing logic, functions, utilities | ⚡ Fast | ❌ None | Every commit |
| Integration | Testing component interactions | 🏃 Medium | ⚠️ Mocked | Before merge |
| E2E | Testing complete workflows | 🐌 Slow | ✅ Real Windmill | Before release |

### Test Pyramid

```
     /\
    /E2E\      Few E2E tests (critical paths)
   /------\
  /  Int  \    Some integration tests
 /--------\
/   Unit   \   Many unit tests (fast feedback)
------------
```

## Quick Start

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only (fast)
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (requires Windmill)
npm run test:e2e
```

### Watch Mode

```bash
# Run tests on file changes
npm run test:watch

# Interactive UI
npm run test:ui
```

### Coverage Report

```bash
npm run test:coverage
```

## Unit Testing

Unit tests are fast and don't require external services.

### Writing Unit Tests

Use the `MockWindmillClient` from `tests/utils/mocks.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { MockWindmillClient, mockJob } from '../utils/mocks.js';

describe('Job Handler', () => {
  it('should process job data', async () => {
    const client = new MockWindmillClient();
    const jobs = await client.listJobs('workspace');
    
    expect(jobs).toBeInstanceOf(Array);
    expect(jobs[0]).toMatchObject({
      id: expect.any(String),
      status: 'completed',
    });
  });
});
```

### Available Mocks

- `MockWindmillClient` - Complete mock Windmill client
- `mockJob`, `mockScript`, `mockWorkflow` - Pre-defined test data
- `createMockToolRequest`, `createMockToolResponse` - MCP helpers
- `mockFetch` - HTTP fetch mocker

### Running Unit Tests

```bash
# All unit tests
npm run test:unit

# Specific file
npx vitest tests/unit/mocks.test.js

# Watch mode
npx vitest tests/unit --watch
```

## Integration Testing

Integration tests verify component interactions.

### Writing Integration Tests

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MCP Tool Integration', () => {
  let server;
  
  beforeEach(() => {
    // Setup MCP server with mocked client
    server = createTestServer();
  });
  
  it('should handle list_jobs tool call', async () => {
    const request = {
      method: 'tools/call',
      params: {
        name: 'list_jobs',
        arguments: { workspace: 'test' },
      },
    };
    
    const response = await server.handleRequest(request);
    
    expect(response).toHaveProperty('content');
    expect(response.isError).toBe(false);
  });
});
```

## E2E Testing

E2E tests run against a real Windmill instance using Docker.

### Setup

1. **Start Windmill**:
```bash
npm run docker:up
```

2. **Wait for startup** (30-60 seconds):
```bash
npm run docker:wait
```

3. **Get API Token**:
   - Access http://localhost:8000
   - Login/create account
   - User Settings → Tokens → Create token
   - Add to `.env`:
   ```bash
   E2E_WINDMILL_URL=http://localhost:8000
   E2E_WINDMILL_TOKEN=your-token-here
   E2E_WORKSPACE=demo
   ```

4. **Run E2E tests**:
```bash
npm run test:e2e
```

5. **Cleanup**:
```bash
npm run docker:down
```

### Complete E2E Cycle

Run everything automatically:
```bash
npm run test:e2e:full
```

This starts Windmill, waits for it to be ready, runs tests, and cleans up.

### Writing E2E Tests

```javascript
import { describe, it, expect, beforeAll } from 'vitest';

const isE2EEnabled = process.env.E2E_WINDMILL_URL && process.env.E2E_WINDMILL_TOKEN;

describe.skipIf(!isE2EEnabled)('Job Execution E2E', () => {
  const baseUrl = process.env.E2E_WINDMILL_URL;
  const token = process.env.E2E_WINDMILL_TOKEN;
  const workspace = process.env.E2E_WORKSPACE;

  beforeAll(async () => {
    // Verify Windmill is accessible
    const response = await fetch(`${baseUrl}/api/version`);
    expect(response.ok).toBe(true);
  });

  it('should execute a simple script', async () => {
    // Create and run a script
    const response = await fetch(
      `${baseUrl}/api/w/${workspace}/jobs/run/inline`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'python3',
          content: 'print("Hello from E2E test")',
        }),
      }
    );
    
    expect(response.ok).toBe(true);
    const job = await response.json();
    expect(job).toHaveProperty('id');
  });
});
```

### E2E Best Practices

- ✅ Use `skipIf` to skip when Windmill not available
- ✅ Clean up resources after tests
- ✅ Use unique identifiers to avoid conflicts
- ✅ Test critical paths only (E2E tests are slow)
- ❌ Don't test every edge case (use unit tests)
- ❌ Don't hardcode IDs (resources may not exist)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      
      - name: Start Windmill
        run: npm run docker:up
      
      - name: Wait for Windmill
        run: npm run docker:wait
      
      - name: Run E2E Tests
        run: npm run test:e2e
        env:
          E2E_WINDMILL_URL: http://localhost:8000
          E2E_WINDMILL_TOKEN: ${{ secrets.E2E_TOKEN }}
      
      - name: Stop Windmill
        if: always()
        run: npm run docker:down
```

## Troubleshooting

### Tests Won't Run

**Problem**: `Cannot find module 'vitest'`

**Solution**: Install dependencies:
```bash
npm install
```

### E2E Tests Skipped

**Problem**: All E2E tests show as skipped

**Solution**: Set environment variables:
```bash
export E2E_WINDMILL_URL=http://localhost:8000
export E2E_WINDMILL_TOKEN=your-token
npm run test:e2e
```

### Windmill Won't Start

**Problem**: `Error: port 8000 already in use`

**Solution**: Stop the conflicting service:
```bash
lsof -i :8000
# Kill the process or use different port
```

### Tests Timeout

**Problem**: Tests fail with timeout errors

**Solution**: Increase timeout in `vitest.config.js`:
```javascript
testTimeout: 60000, // 60 seconds
```

### Docker Issues

See [tests/docker/README.md](../tests/docker/README.md) for Docker-specific troubleshooting.

## Coverage Reports

### Generate Coverage

```bash
npm run test:coverage
```

### View Coverage

Coverage reports are generated in `coverage/`:
- `coverage/index.html` - HTML report (open in browser)
- `coverage/coverage-final.json` - JSON report
- Console output during test run

### Coverage Goals

- **Unit tests**: > 80% coverage
- **Integration tests**: Critical paths covered
- **E2E tests**: Happy paths and key workflows

## Testing Best Practices

### General

1. **Keep tests independent** - No shared state between tests
2. **Use descriptive names** - Test names should explain what they verify
3. **Test behavior, not implementation** - Focus on what, not how
4. **One assertion per test** - Or at least one logical assertion
5. **Fast feedback** - Keep unit tests fast

### Mocking

1. **Mock external dependencies** - Don't hit real APIs in unit tests
2. **Mock at boundaries** - Mock HTTP, not internal functions
3. **Verify mock interactions** - Check that mocks were called correctly
4. **Reset mocks** - Clean up between tests

### E2E

1. **Test critical paths** - Don't test everything
2. **Clean up resources** - Delete test data after tests
3. **Use test-specific data** - Don't interfere with real data
4. **Be resilient** - Handle flaky network, timing issues

## Additional Resources

- [Vitest Documentation](https://vitest.dev)
- [Windmill API Documentation](https://docs.windmill.dev)
- [MCP Protocol Spec](https://modelcontextprotocol.io)
- [Docker Testing Guide](../tests/docker/README.md)
