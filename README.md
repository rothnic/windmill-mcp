# Windmill MCP Server

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
npx rothnic/windmill-mcp
```

Or add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "windmill": {
      "command": "npx",
      "args": ["rothnic/windmill-mcp"],
      "env": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Development Setup

For contributors or those who want to customize the server:

### Prerequisites

- Node.js 18+ and npm
- Access to a Windmill instance (for testing)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Windmill instance (for testing):
```bash
cp .env.example .env
# Edit .env with your Windmill instance details
```

## Usage

### Generating the MCP Server

To generate or regenerate the MCP server from the latest Windmill OpenAPI spec:

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
