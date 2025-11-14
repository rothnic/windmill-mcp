# Quick Start Guide

This guide will help you get started with the Windmill MCP Server.

## For End Users

### Using with npx (Recommended)

The easiest way to use the Windmill MCP server is with npx:

```bash
npx rothnic/windmill-mcp
```

### Using with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### Configuration

The server requires two environment variables:

- `WINDMILL_BASE_URL`: Your Windmill instance URL
- `WINDMILL_API_TOKEN`: Your Windmill API token

You can get your API token from your Windmill instance:
1. Go to your Windmill instance
2. Navigate to your user settings
3. Generate a new API token
4. Copy the token

## For Developers

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

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

# Integration tests
npm run test:integration

# Test against live Windmill instance
npm run test:live
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

- Read the [full README](README.md) for comprehensive documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Review [PROJECT_PLAN.md](.github/agents/PROJECT_PLAN.md) for project roadmap
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
