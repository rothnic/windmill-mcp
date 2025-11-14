# Tests

This directory contains the test suite for the Windmill MCP server using **Vitest**.

## Test Strategy

### 1. Unit Tests (`tests/unit/`)
- Test individual functions and components in isolation
- **No external dependencies** - use mocks for Windmill API
- Fast execution (milliseconds)
- Run on every commit

### 2. Integration Tests (`tests/integration/`)
- Test integration between components
- May use mocked external services
- Moderate execution time (seconds)
- Run before merges

### 3. E2E Tests (`tests/e2e/`)
- Test against a **real Windmill instance** (Docker)
- Verify complete workflows end-to-end
- Slower execution (minutes)
- Run before releases or on-demand

## Structure

```
tests/
├── unit/              # Unit tests (mocked, no external deps)
├── integration/       # Integration tests
├── e2e/              # End-to-end tests (real Windmill)
├── docker/           # Docker setup for E2E testing
├── fixtures/         # Test data and fixtures
├── utils/            # Test utilities and helpers
├── setup.js          # Global test setup
└── config.json       # Test configuration
```

## Running Tests

```bash
# Run all tests
npm test

# Run with watch mode (re-run on file changes)
npm run test:watch

# Run with UI (interactive browser interface)
npm run test:ui

# Run only unit tests (fast, no external deps)
npm run test:unit

# Run only integration tests
npm run test:integration

# Run E2E tests (requires Windmill running)
npm run test:e2e

# Run tests with coverage report
npm run test:coverage
```

## E2E Testing with Docker

### Quick Start

```bash
# Start Windmill in Docker
npm run docker:up

# Wait for startup (30-60 seconds)
# Check: curl http://localhost:8000/api/version

# Run E2E tests
npm run test:e2e

# Stop Windmill
npm run docker:down
```

### Complete E2E Cycle

Run everything in one command:
```bash
npm run test:e2e:full
```

See [docker/README.md](./docker/README.md) for detailed Docker setup.

## Configuration

### Unit Tests

No configuration needed - uses mocks from `utils/mocks.js`.

### E2E Tests

Set in `.env`:

```bash
# E2E test configuration
E2E_WINDMILL_URL=http://localhost:8000
E2E_WINDMILL_TOKEN=your-api-token-here
E2E_WORKSPACE=demo
```

To get an API token:
1. Start Windmill: `npm run docker:up`
2. Access UI: http://localhost:8000
3. Login/create account
4. Go to User Settings → Tokens
5. Create token and add to `.env`

## Writing Tests

### Unit Tests

Use mocks to avoid external dependencies:

```javascript
// tests/unit/my-feature.test.js
import { describe, it, expect } from 'vitest';
import { MockWindmillClient } from '../utils/mocks.js';

describe('My Feature', () => {
  it('should work with mock client', async () => {
    const client = new MockWindmillClient();
    const jobs = await client.listJobs('test-workspace');
    
    expect(jobs).toBeInstanceOf(Array);
  });
});
```

### E2E Tests

Test against real Windmill:

```javascript
// tests/e2e/my-feature.test.js
import { describe, it, expect } from 'vitest';

const isE2EEnabled = process.env.E2E_WINDMILL_URL && process.env.E2E_WINDMILL_TOKEN;

describe.skipIf(!isE2EEnabled)('My E2E Test', () => {
  it('should work with real Windmill', async () => {
    const response = await fetch(
      `${process.env.E2E_WINDMILL_URL}/api/version`
    );
    expect(response.ok).toBe(true);
  });
});
```

## Test Utilities

The `utils/` directory contains helper functions:

- `windmill-client.js` - Windmill API client for testing
- `fixtures.js` - Load test fixtures
- `setup.js` - Test setup and teardown

## Fixtures

Test data is stored in `fixtures/` directory. Use JSON files for consistent test data:

```
fixtures/
├── workflows/
│   ├── basic-workflow.json
│   └── complex-workflow.json
├── scripts/
│   └── example-script.json
└── resources/
    └── test-resource.json
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up resources after tests
3. **Descriptive**: Use clear test descriptions
4. **Fast**: Keep unit tests fast, integration tests focused
5. **Reliable**: Tests should not be flaky
6. **Documented**: Document complex test scenarios

## CI/CD

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before releases

Integration tests require valid Windmill credentials to be configured in CI environment.
