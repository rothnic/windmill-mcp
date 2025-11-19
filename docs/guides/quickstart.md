# Quick Start Guide

This guide will help you get started with the Windmill MCP Server.

> ⚠️ **Pre-Release Status**: This package is not yet published to npm. Follow the development setup instructions below to use it.

## For End Users

### Prerequisites

- Node.js 18+ and npm
- Git
- A Windmill instance (local or hosted)

### Setup Steps

1. **Clone and generate the MCP server**:

```bash
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp
npm install

# Generate the MCP server from Windmill's OpenAPI spec
npm run generate
```

This command will:
- Fetch the latest OpenAPI spec from Windmill
- Generate MCP server code
- Apply any custom overrides
- Build the TypeScript code to JavaScript

2. **Get your Windmill credentials**:
   - Go to your Windmill instance
   - Navigate to user settings
   - Generate a new API token
   - Note your instance URL (e.g., `https://your-instance.windmill.dev`)

### Using with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "windmill": {
      "command": "node",
      "args": ["/absolute/path/to/windmill-mcp/src/runtime/index.js"],
      "env": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

Replace `/absolute/path/to/windmill-mcp` with the actual path to your cloned repository.

### Using with OpenCode

For local development, copy `opencode.jsonc.example` to `opencode.jsonc` and customize it with your paths and credentials.

Add to your project's `.opencode/opencode.jsonc`:

```jsonc
{
  "mcp": {
    "windmill": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/windmill-mcp/src/runtime/index.js",
      ],
      "environment": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token",
      },
      "enabled": true,
    },
  },
}
```

**Note**: `opencode.jsonc` is ignored by git to protect sensitive credentials. Always use `opencode.jsonc.example` as a reference.

## For Developers

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker and Docker Compose (optional, for local Windmill testing)

### Development Setup

1. **Clone the repository**:

```bash
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp
```

2. **Install dependencies**:

```bash
npm install
```

3. **Choose your setup path**:

#### Option A: With Local Windmill (Full Stack)

```bash
# Start local Windmill with Docker
npm run docker:dev

# Generate the MCP server (fetch → generate → override → build)
npm run generate

# In another terminal, run the MCP server
npm run dev
```

#### Option B: Without Docker (Use Your Own Windmill)

```bash
# Generate and build the MCP server
npm run generate

# Run it against your instance
WINDMILL_BASE_URL=https://your-instance.windmill.dev \
WINDMILL_API_TOKEN=your-token \
npm run dev
```

### Available Commands

From the root directory:

```bash
# Generation
npm run generate      # Complete generation workflow (fetch → generate → override → build)
npm run fetch-spec    # Fetch OpenAPI spec only
npm run build:generated  # Build generated code only

# Development
npm run dev          # Run MCP server

# Testing
npm test             # Run all tests
npm run test:unit    # Run unit tests
npm run test:e2e     # Run E2E tests (requires Docker)
npm run test:e2e:full  # Full E2E suite with setup

# Docker management
npm run docker:dev   # Start Windmill
npm run docker:stop  # Stop Windmill
npm run docker:clean # Remove all data
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Fetch OpenAPI spec and generate server**:

```bash
npm run generate
```

5. **Test the server**:

```bash
npm run dev
```

### Development Workflow

#### Regenerating the Server

When the Windmill API changes:

```bash
npm run fetch-spec  # Fetch latest OpenAPI spec
npm run generate    # Regenerate server
npm test            # Verify everything works
```

#### Adding Customizations

1. Identify what you want to customize in `src/`
2. Create the same file in `overrides/`
3. Make your changes
4. Regenerate to apply:

```bash
npm run generate
```

Your customizations will be preserved!

#### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests (requires Docker)
npm run test:e2e

# Full E2E suite with setup
npm run test:e2e:full

# Coverage report
npm run test:coverage
```

## Common Tasks

### Updating to Latest Windmill API

```bash
npm run fetch-spec
npm run generate
npm test
```

### Adding a Custom Override

```bash
# 1. Create override file
mkdir -p overrides/utils
touch overrides/utils/custom-handler.js

# 2. Add your code to the file

# 3. Validate
npm run validate-overrides

# 4. Apply
npm run generate
```

### Publishing Your Fork

If you've made changes and want to publish your own version:

```bash
# Update package.json name
# Update version
npm version patch

# Publish
npm publish
```

## Troubleshooting

### Server Won't Start

**Problem**: `Error: Cannot find module '@modelcontextprotocol/sdk'`

**Solution**: Install dependencies:

```bash
npm install
```

### Generation Fails

**Problem**: `OpenAPI specification not found`

**Solution**: Fetch the spec first:

```bash
npm run fetch-spec
```

### Override Not Applied

**Problem**: Changes in `overrides/` not appearing in `src/`

**Solution**:

1. Check file path matches exactly
2. Validate syntax: `npm run validate-overrides`
3. Regenerate: `npm run generate`

### Authentication Issues

**Problem**: `401 Unauthorized` when testing

**Solution**: Check your API token in `.env` or environment variables

## Next Steps

- Read the [full README](../README.md) for comprehensive documentation
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) if you want to contribute
- Review [project-plan.md](project-plan.md) for project roadmap
- Join discussions on GitHub for questions

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rothnic/windmill-mcp/discussions)
- **Documentation**: Check the `docs/` directory
- **Examples**: See `examples/` directory

## Resources

- [Windmill Documentation](https://docs.windmill.dev)
- [MCP Documentation](https://modelcontextprotocol.io)
- [OpenAPI Specification](https://swagger.io/specification/)
