# Tests

This directory contains the test suite for the Windmill MCP server.

## Structure

```
tests/
├── unit/           # Unit tests for individual components
├── integration/    # Integration tests with live Windmill instance
├── fixtures/       # Test data and fixtures
├── utils/          # Test utilities and helpers
└── config.json     # Test configuration
```

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests against live Windmill instance
npm run test:live
```

## Configuration

Configure test settings in `config.json` or use environment variables:

```bash
# Required for integration tests
export TEST_WINDMILL_URL=https://your-instance.windmill.dev
export TEST_WINDMILL_TOKEN=your-token
export TEST_WORKSPACE=your-workspace
```

## Writing Tests

### Unit Tests

Place in `unit/` directory. Test individual functions and components in isolation.

Example:
```javascript
// tests/unit/parser.test.js
import { parseEndpoint } from '../../src/parser.js';

describe('parseEndpoint', () => {
  it('should parse basic endpoint', () => {
    const result = parseEndpoint('/api/v1/workflows');
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

Place in `integration/` directory. Test actual API calls to Windmill instance.

Example:
```javascript
// tests/integration/workflows.test.js
import { getWindmillClient } from '../utils/windmill-client.js';

describe('Workflows API', () => {
  let client;

  beforeAll(() => {
    client = getWindmillClient();
  });

  it('should list workflows', async () => {
    const workflows = await client.listWorkflows();
    expect(Array.isArray(workflows)).toBe(true);
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
