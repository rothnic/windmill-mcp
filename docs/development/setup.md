# Development Setup

Guide for contributors and developers who want to work on the Windmill MCP Server project.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local testing)
- Git

## Quick Setup

```bash
# Clone the repository
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp

# Install dependencies
npm install

# Generate the MCP server
npm run generate
```

## Development Workflow

### 1. Local Windmill Instance

For testing, start a local Windmill instance:

```bash
# Start Windmill with development configuration
npm run docker:dev

# Output shows:
# ✅ Windmill ready at http://localhost:8000
#    Superadmin secret: test-super-secret
#    Default workspace: admins
```

Other Docker commands:
```bash
npm run docker:logs    # View logs
npm run docker:down    # Stop (keeps data)
npm run docker:clean   # Clean everything (removes data)
```

### 2. Running the MCP Server

```bash
# Using the runtime loader (recommended)
node src/runtime/index.js

# With specific Windmill version
WINDMILL_VERSION=1.520.1 node src/runtime/index.js

# With local Windmill
WINDMILL_BASE_URL=http://localhost:8000 \
WINDMILL_API_TOKEN=test-super-secret \
node src/runtime/index.js

# Direct execution (bypass version management)
WINDMILL_BASE_URL=http://localhost:8000 \
WINDMILL_API_TOKEN=test-super-secret \
npm run dev
```

### 3. Testing Changes

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests with local Windmill
E2E_WINDMILL_URL=http://localhost:8000 \
E2E_WINDMILL_TOKEN=test-super-secret \
E2E_WORKSPACE=admins \
npm run test:e2e

# Full E2E cycle (starts/stops Windmill automatically)
npm run test:e2e:full

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

See [Testing Guide](testing.md) for comprehensive testing documentation.

### 4. Using MCP Inspector

Test the MCP server interactively:

```bash
# With local Windmill
WINDMILL_BASE_URL=http://localhost:8000 \
WINDMILL_API_TOKEN=test-super-secret \
npx @modelcontextprotocol/inspector node build/dist/index.js
```

This opens a web interface where you can:
- Browse all available tools
- Test tool invocations
- Debug responses

## Project Structure

```
windmill-mcp/
├── src/
│   ├── generator/          # Generation scripts
│   │   ├── generate.js    # Main generation orchestrator
│   │   ├── fetch-spec.js  # OpenAPI spec fetching
│   │   └── config.json    # Generator configuration
│   ├── overrides/          # Custom modifications
│   │   ├── apply-overrides.js
│   │   └── add-tool-namespaces.js
│   └── runtime/            # Runtime loader
│       └── index.js       # Version management and loading
├── build/                  # Generated code (gitignored)
│   ├── src/               # Generated TypeScript
│   └── dist/              # Compiled JavaScript
├── cache/                  # Cached specs (gitignored)
├── tests/                  # Test suite
│   ├── unit/              # Unit tests
│   ├── e2e/               # End-to-end tests
│   ├── docker/            # Docker setup for tests
│   └── utils/             # Test utilities
├── docs/                   # Documentation
│   ├── guides/            # User guides
│   ├── development/       # Developer docs
│   ├── reference/         # Technical references
│   └── planning/          # Project planning
└── scripts/                # Utility scripts
```

### Important Directories

**Committed to Git**:
- `src/` - All source code including generator, overrides, and runtime
- `tests/` - Test suite
- `docs/` - Documentation
- `scripts/` - Utility scripts

**Generated/Temporary (gitignored)**:
- `build/` - Generated MCP server code
- `cache/` - Cached OpenAPI specifications
- `node_modules/` - Dependencies

## Code Generation

### Generation Process

The `npm run generate` command executes a complete workflow:

1. **Pre-generation** (`pregenerate` hook):
   - Fetches latest OpenAPI spec from Windmill
   - Caches spec in `cache/` directory

2. **Generation**:
   - Runs openapi-mcp-generator
   - Creates TypeScript MCP server in `build/src/`

3. **Post-generation** (`postgenerate` hook):
   - Adds tool namespaces for better organization
   - Applies custom overrides from `src/overrides/`
   - Installs dependencies in `build/`
   - Compiles TypeScript to JavaScript in `build/dist/`
   - Generates tool documentation in `docs/reference/generated-tools.md`

### Manual Steps

If you need to run steps individually:

```bash
# Fetch OpenAPI spec only
npm run fetch-spec

# Apply overrides only
npm run apply-overrides

# Build generated code only
npm run build:generated

# Generate tool documentation
npm run generate-tool-list
```

### Working with Overrides

Custom modifications are stored in `src/overrides/` and persist across regenerations:

1. Create a file in `src/overrides/` matching the structure of generated code
2. Add your customizations
3. Run `npm run generate` to regenerate with overrides applied

Example:
```bash
# Override structure matches build structure
src/overrides/
└── src/
    └── index.ts  # Overrides build/src/index.ts
```

See [Generator Guide](generator.md) for detailed information.

## Making Changes

### Development Best Practices

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**:
   - Prefer overrides for generated code modifications
   - Add tests for new functionality
   - Update documentation

3. **Run tests locally**:
   ```bash
   npm test
   npm run validate
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Quality

Before committing:

```bash
# Lint code
npm run lint

# Check file structure
npm run lint:structure

# Format code
npm run format

# Validate everything
npm run validate
```

### CI/CD Checks

Pull requests automatically run:
- ✅ Unit Tests (required)
- ✅ Build Verification (required)
- ℹ️ E2E Tests (informational)

PRs cannot be merged until required checks pass.

## Common Development Tasks

### Testing Against Different Windmill Versions

```bash
# Set specific version
export WINDMILL_VERSION=1.520.1
node src/runtime/index.js

# Or generate for specific version
WINDMILL_VERSION=1.520.1 npm run generate
```

### Debugging Generated Code

```bash
# View generated TypeScript
cat build/src/index.ts | less

# Check compiled JavaScript
cat build/dist/index.js | less

# Test tool directly
node -e "require('./build/dist/index.js')"
```

### Adding New Test Cases

1. Create test file in `tests/unit/` or `tests/e2e/`
2. Follow existing test patterns
3. Use mock utilities from `tests/utils/mocks.js`
4. Run tests: `npm test`

See [Testing Guide](testing.md) for details.

### Updating Documentation

When making changes:
1. Update relevant documentation in `docs/`
2. Keep README.md high-level (details go in guides)
3. Update CHANGELOG.md for notable changes
4. Run documentation validation: `npm run docs:validate`

## Environment Variables

Create a `.env` file for local development (not committed):

```bash
# Windmill Instance
WINDMILL_BASE_URL=http://localhost:8000
WINDMILL_API_TOKEN=test-super-secret

# Optional: Specific version
WINDMILL_VERSION=1.520.1

# Testing
E2E_WINDMILL_URL=http://localhost:8000
E2E_WINDMILL_TOKEN=test-super-secret
E2E_WORKSPACE=admins
```

## Troubleshooting Development Issues

See [Troubleshooting Guide](../guides/troubleshooting.md) for common issues.

### Development-Specific Issues

**Build fails after pulling changes**:
```bash
rm -rf build/ cache/ node_modules/
npm install
npm run generate
```

**Tests fail unexpectedly**:
```bash
# Clean Docker state
npm run docker:clean
npm run docker:dev
npm test
```

**Override conflicts**:
```bash
npm run validate-overrides
```

## Getting Help

- Review [Contributing Guidelines](../../CONTRIBUTING.md)
- Check [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues)
- Join [Windmill Discord](https://discord.gg/V7PM2YHsPB)

## Next Steps

- [Generator Guide](generator.md) - Understanding the generation system
- [Testing Guide](testing.md) - Comprehensive testing documentation
- [Architecture](architecture.md) - System architecture overview
- [Contributing Guidelines](../../CONTRIBUTING.md) - Contribution workflow
