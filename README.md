# Windmill MCP Server

[![CI Tests](https://github.com/rothnic/windmill-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/rothnic/windmill-mcp/actions/workflows/ci.yml)
[![Update MCP Server](https://github.com/rothnic/windmill-mcp/actions/workflows/update-mcp-server.yml/badge.svg)](https://github.com/rothnic/windmill-mcp/actions/workflows/update-mcp-server.yml)

Provides complete [Windmill](https://windmill.dev) API access through MCP (Model Context Protocol) tools by leveraging Windmill's OpenAPI specification.

> 📘 **New to this project?** Check out the [Quick Start Guide](QUICKSTART.md) for a step-by-step introduction.

## Overview

This project uses [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator) to generate an MCP server from Windmill's OpenAPI specification, with support for:
- Automated regeneration from latest OpenAPI specs
- Custom overrides and modifications that persist across regenerations
- Testing infrastructure for live Windmill instances

## Project Structure

```
windmill-mcp/
├── generator/          # Generator configuration and scripts
├── overrides/          # Custom modifications that override generated code
├── src/               # Generated MCP server code
├── tests/             # Test suite for MCP endpoints
├── .github/agents/    # Agent configuration and project planning
└── scripts/           # Utility scripts for generation and testing
```

## Setup

### Quick Start (No Installation Required)

Run the MCP server directly with npx:

```bash
# Latest Windmill version
npx windmill-mcp

# Specific Windmill version
WINDMILL_VERSION=1.520.1 npx windmill-mcp

# The first run downloads and caches the generated code
# Subsequent runs are instant!
```

Or add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "windmill": {
      "command": "npx",
      "args": ["windmill-mcp"],
      "env": {
        "WINDMILL_VERSION": "1.520.1",
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### How It Works

The MCP server uses a **runtime artifact download** approach:

1. **On first run**: Downloads pre-tested generated code from GitHub Releases
2. **Caches locally**: Stores in `~/.cache/windmill-mcp/{version}/`
3. **Instant startup**: Subsequent runs load from cache (<1s)
4. **Fallback generation**: Can generate locally if artifact not available

**Key Benefits:**
- ✅ **Pre-tested artifacts**: Only tested versions are released
- ✅ **Fast startup**: Download once, run instantly thereafter
- ✅ **Version flexibility**: Switch between Windmill versions with an env var
- ✅ **Single package**: No need to manage multiple npm versions

### Version Targeting

```bash
# Use latest Windmill version
npx windmill-mcp

# Use specific Windmill version
WINDMILL_VERSION=1.520.1 npx windmill-mcp

# List available versions
npx windmill-mcp --list-available

# List cached versions
npx windmill-mcp --list-cached

# Clear cache for a version
npx windmill-mcp --clear-cache 1.520.1

# Clear all cache
npx windmill-mcp --clear-cache
```

### Development Setup

For contributors or those who want to customize the server:

#### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local testing)
- Git

#### Quick Start for Development

```bash
# Clone the repository
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp

# Install dependencies
npm install

# Start local Windmill instance and set up everything
npm run dev:setup

# This will:
# 1. Start Windmill in Docker
# 2. Wait for it to be ready
# 3. Fetch OpenAPI spec from running instance
# 4. Generate MCP server code
# 5. Build the generated code

# In another terminal, run the MCP server
npm run dev:mcp
```

#### Development Workflow

**Working with Local Windmill:**

```bash
# Start Windmill for development (includes superadmin token info)
npm run docker:dev

# Output shows:
# ✅ Windmill ready at http://localhost:8000
#    Superadmin secret: test-super-secret
#    Default workspace: admins

# View Windmill logs
npm run docker:logs

# Stop Windmill (keeps data)
npm run docker:down

# Clean everything (removes all data)
npm run docker:clean
```

**Running the MCP Server:**

```bash
# Option 1: Run generated MCP server against local Windmill
npm run dev:mcp

# Option 2: Run against your own Windmill instance
cd src
WINDMILL_BASE_URL=https://your-instance.windmill.dev \
WINDMILL_API_TOKEN=your-token \
node build/index.js
```

**Testing:**

```bash
# Run all tests
npm test

# Run only E2E tests (requires running Windmill)
E2E_WINDMILL_URL=http://localhost:8000 \
E2E_WINDMILL_TOKEN=test-super-secret \
E2E_WORKSPACE=admins \
npm run test:e2e

# Run complete E2E cycle (starts/stops Windmill automatically)
npm run test:e2e:full
```

See [TESTING.md](TESTING.md) for comprehensive testing documentation.

#### Regenerating the MCP Server

```bash
# Fetch latest OpenAPI spec and regenerate
npm run generate

# The generated code goes to src/
# Build it to test locally
cd src
npm install
npm run build
```

## Usage

### Automated Releases

New Windmill versions are automatically published via GitHub Actions:

- **Manual Trigger**: Actions → "Generate Windmill MCP Server Version" → Run workflow
- **Scheduled**: Runs weekly on Mondays at midnight UTC (generates latest)
- **Results**: Creates GitHub Release with tested artifacts

**The workflow:**
1. Starts Windmill in Docker
2. Fetches OpenAPI specification
3. Generates MCP server code
4. Runs unit and E2E tests
5. If tests pass: Creates GitHub Release with artifact
6. Users automatically get the tested version on first run

**Release Tags:**
- `windmill-latest` - Always the newest Windmill version
- `windmill-v1.520.1-mcp-0.2.0` - Specific Windmill + package version

### Rebuilding All Versions

When the MCP package itself is updated, all supported Windmill versions can be rebuilt:

```bash
# Trigger via GitHub Actions
Actions → "Rebuild All Windmill Versions" → Run workflow → "all"
```

This regenerates and tests all existing versions with the new package version.

### Manual Generation

To manually generate or regenerate the MCP server from the latest Windmill OpenAPI spec:

```bash
npm run generate
```

This will:
1. Fetch the latest OpenAPI specification from Windmill
2. Run openapi-mcp-generator to create the MCP server
3. Apply any custom overrides from the `overrides/` directory

### Applying Custom Overrides

Custom modifications are stored in the `overrides/` directory and automatically applied after generation:

1. Place your custom files in `overrides/` matching the structure of `src/`
2. Run `npm run generate` to regenerate and apply overrides
3. Overrides are merged with generated code using the apply-overrides script

### Testing

Run tests against a live Windmill instance:

```bash
npm test
```

For integration tests with a specific Windmill instance:

```bash
npm run test:integration
```

### Development

Start the MCP server in development mode:

```bash
npm run dev
```

## Customization

### Adding Custom Overrides

1. Identify the generated file you want to customize in `src/`
2. Create a corresponding file in `overrides/` with the same relative path
3. Add your customizations
4. Run `npm run generate` to regenerate - your overrides will be preserved

### Modifying Generation Behavior

Edit the generator configuration in `generator/config.json` to customize:
- OpenAPI spec source URL
- Generation templates
- Output directory structure
- Post-generation hooks

## Testing with Live Windmill Instance

### Setup Test Environment

1. Configure test instance in `.env`:
```bash
WINDMILL_BASE_URL=https://your-windmill-instance.com
WINDMILL_API_TOKEN=your-api-token
```

2. Run test suite:
```bash
npm run test:live
```

### Test Coverage

Tests are organized by endpoint category:
- `tests/workflows/` - Workflow operations
- `tests/scripts/` - Script operations
- `tests/resources/` - Resource management
- `tests/schedules/` - Schedule operations

## Project Planning

Project planning, sprints, and agent configurations are maintained in `.github/agents/`. See:
- `.github/agents/PROJECT_PLAN.md` - Overall project roadmap
- `.github/agents/SPRINTS.md` - Sprint planning and tracking
- `.github/agents/AGENTS.md` - Agent configurations and responsibilities

## Contributing

1. Create a feature branch
2. Make your changes (preferably in `overrides/` for customizations)
3. Run tests: `npm test`
4. Submit a pull request

### CI/CD Checks

All pull requests run automated CI checks:
- ✅ **Unit Tests** (required) - Must pass to merge
- ✅ **Build Verification** (required) - Generated server must build
- ℹ️ **E2E Tests** (informational) - Tests with Windmill in Docker

PRs cannot be merged until required checks pass.

## Publishing

### Publishing to npm

For maintainers, to publish a new version:

1. Update version in `package.json`:
```bash
npm version patch  # or minor, or major
```

2. Build and test:
```bash
npm run generate
npm test
```

3. Publish to npm:
```bash
npm publish
```

4. Users can then run with:
```bash
npx windmill-mcp
```

### Publishing to GitHub Packages

Alternatively, publish to GitHub Packages for use with `npx rothnic/windmill-mcp`:

1. Authenticate with GitHub:
```bash
npm login --registry=https://npm.pkg.github.com
```

2. Update package.json with GitHub registry:
```json
{
  "name": "@rothnic/windmill-mcp",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

3. Publish:
```bash
npm publish
```

## License

MIT

## Resources

- [Windmill Documentation](https://docs.windmill.dev)
- [Windmill API Documentation](https://app.windmill.dev/openapi.html)
- [OpenAPI MCP Generator](https://github.com/harsha-iiiv/openapi-mcp-generator)
- [Model Context Protocol](https://modelcontextprotocol.io)
