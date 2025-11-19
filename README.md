# Windmill MCP Server

[![CI Tests](https://github.com/rothnic/windmill-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/rothnic/windmill-mcp/actions/workflows/ci.yml)
[![Update MCP Server](https://github.com/rothnic/windmill-mcp/actions/workflows/update-mcp-server.yml/badge.svg)](https://github.com/rothnic/windmill-mcp/actions/workflows/update-mcp-server.yml)

Provides complete [Windmill](https://windmill.dev) API access through MCP (Model Context Protocol) tools by leveraging Windmill's OpenAPI specification.

> 📘 **New to this project?** Check out the [Quick Start Guide](docs/guides/quickstart.md) for a step-by-step introduction.

## Features

- **500+ API Tools**: Complete Windmill API coverage through MCP
- **Auto-Generated**: Stays in sync with latest Windmill releases
- **Custom Overrides**: Modifications persist across regenerations  
- **Version Management**: Automatic version matching with your Windmill instance
- **Comprehensive Testing**: Unit and E2E tests against live Windmill

## Quick Start

### Installation

```bash
# Clone and build
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp
npm install
npm run generate
```

See [Installation Guide](docs/guides/installation.md) for detailed setup instructions.

### Configuration

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

**OpenCode** (`.opencode/opencode.jsonc` in your project):

```jsonc
{
  "mcp": {
    "windmill": {
      "type": "local",
      "command": ["node", "/absolute/path/to/windmill-mcp/src/runtime/index.js"],
      "environment": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      },
      "enabled": true
    }
  }
}
```

See [Configuration Reference](docs/reference/configuration.md) for all options.

## Documentation

### User Guides
- [Quick Start Guide](docs/guides/quickstart.md) - Step-by-step introduction
- [Installation Guide](docs/guides/installation.md) - Detailed setup instructions
- [Usage Guide](docs/guides/usage.md) - How to use the MCP server
- [Troubleshooting Guide](docs/guides/troubleshooting.md) - Common issues and solutions

### Developer Documentation
- [Development Setup](docs/development/setup.md) - Contributing and development workflow
- [Generator System](docs/development/generator.md) - How code generation works
- [Testing Guide](docs/development/testing.md) - Running and writing tests
- [Architecture](docs/development/architecture-verification.md) - System architecture

### Reference
- [API Tools Reference](docs/reference/generated-tools.md) - Complete list of available tools
- [Configuration Reference](docs/reference/configuration.md) - All configuration options
- [JSON Schema Guide](docs/reference/json-schema-manual-guide.md) - Working with schemas

### Project Planning
- [Project Plan](docs/planning/project-plan.md) - Overall project roadmap
- [Sprint Planning](docs/planning/sprints.md) - Sprint tracking
- [Agent Team Plan](docs/planning/windmill-agent-team-plan.md) - AI agent workflows

## Project Structure

```
windmill-mcp/
├── src/
│   ├── generator/      # OpenAPI spec fetching and generation orchestration
│   ├── overrides/      # Custom modifications that persist across generations
│   └── runtime/        # Runtime loader with version management
├── build/              # Generated MCP server code (gitignored)
├── tests/              # Test suite (unit and E2E)
├── docs/
│   ├── guides/         # User-facing guides
│   ├── development/    # Developer documentation
│   ├── reference/      # Technical references
│   └── planning/       # Project planning documents
└── scripts/            # Utility scripts
```

## Development

### Quick Development Setup

```bash
# Install dependencies
npm install

# Start local Windmill instance
npm run docker:dev

# Generate MCP server
npm run generate

# Run tests
npm test
```

See [Development Setup](docs/development/setup.md) for comprehensive instructions.

### Common Commands

```bash
# Generation
npm run generate          # Complete generation workflow
npm run fetch-spec        # Fetch OpenAPI spec only

# Development
npm run dev              # Run the MCP server directly
npm run test:watch       # Run tests in watch mode

# Testing
npm test                 # Run all tests
npm run test:e2e        # E2E tests (requires Windmill)
npm run test:e2e:full   # Full E2E with automatic setup

# Docker
npm run docker:dev      # Start Windmill for development
npm run docker:logs     # View Windmill logs
npm run docker:clean    # Clean all data

# Quality
npm run lint            # Lint code
npm run validate        # Run all validations
```

## Automated Releases

New Windmill versions are automatically published via GitHub Actions:
- **Weekly Schedule**: Mondays at midnight UTC
- **Manual Trigger**: Run workflow in GitHub Actions
- **Auto-Testing**: E2E tests before release
- **Version Tagging**: `windmill-v{version}-mcp-{package}`

See [Usage Guide](docs/guides/usage.md#automated-releases) for details.

## Contributing

We welcome contributions! Please see:
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [Development Setup](docs/development/setup.md) - Dev environment setup
- [Testing Guide](docs/development/testing.md) - Writing tests

## License

MIT - see [LICENSE](LICENSE)

## Resources

- [Windmill Documentation](https://docs.windmill.dev) - Official Windmill docs
- [Windmill API](https://app.windmill.dev/openapi.html) - API documentation
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [OpenAPI MCP Generator](https://github.com/harsha-iiiv/openapi-mcp-generator) - Generator tool

## Status

**Current Version**: 0.1.0 (Pre-release)
- ✅ Complete API coverage (500+ tools)
- ✅ Automated version management
- ✅ Comprehensive testing
- ✅ CI/CD pipeline
- ⏳ NPM package publication (coming soon)

See [Project Status](PROJECT_STATUS.md) for detailed status.
