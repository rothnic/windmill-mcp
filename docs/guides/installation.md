# Installation Guide

This guide covers how to install and set up the Windmill MCP Server.

## Prerequisites

- Node.js 18+ and npm
- Git
- A Windmill instance (local or hosted)

## Installation Steps

### 1. Clone and Build

> ⚠️ **Pre-Release Status**: This package is not yet published to npm. Follow these instructions to use it.

```bash
# Clone the repository
git clone https://github.com/rothnic/windmill-mcp.git
cd windmill-mcp

# Install dependencies
npm install

# Generate the MCP server
npm run generate
```

The `npm run generate` command performs:
1. Fetches OpenAPI spec from Windmill
2. Generates MCP server code in `build/`
3. Applies custom overrides from `src/overrides/`
4. Builds TypeScript code to JavaScript in `build/dist/`

### 2. Get Windmill Credentials

You'll need:
- **Base URL**: Your Windmill instance URL (e.g., `https://your-instance.windmill.dev`)
- **API Token**: Generate from your Windmill user settings

To create an API token:
1. Go to your Windmill instance
2. Navigate to user settings
3. Click "Generate API Token"
4. Copy the token (keep it secure)

## MCP Client Configuration

### Claude Desktop

Add to your configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

**Important**: Replace `/absolute/path/to/windmill-mcp` with the actual path to your cloned repository.

### OpenCode

Create or update `.opencode/opencode.jsonc` in your project:

```jsonc
{
  "mcp": {
    "windmill": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/windmill-mcp/src/runtime/index.js"
      ],
      "environment": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      },
      "enabled": true
    }
  }
}
```

## Verification

After configuration, restart your MCP client (Claude Desktop or OpenCode). The Windmill tools should now be available.

To verify:
1. In Claude Desktop: Look for Windmill tools in the tools panel
2. In OpenCode: Check MCP server status in settings

## Troubleshooting

### Server Not Starting

If the MCP server doesn't start:
1. Check the path to `src/runtime/index.js` is absolute and correct
2. Verify Node.js 18+ is installed: `node --version`
3. Ensure the build was successful: Check for `build/dist/index.js`

### Authentication Errors

If you get authentication errors:
1. Verify `WINDMILL_BASE_URL` matches your instance (including https://)
2. Check that `WINDMILL_API_TOKEN` is valid
3. Ensure your token has appropriate permissions

### Build Issues

If generation fails:
1. Check internet connectivity (needs to fetch OpenAPI spec)
2. Try cleaning and rebuilding:
   ```bash
   rm -rf build/ cache/
   npm run generate
   ```

## Next Steps

- [Quick Start Guide](quickstart.md) - Learn basic usage
- [Configuration Reference](../reference/configuration.md) - Detailed configuration options
- [Troubleshooting Guide](troubleshooting.md) - Common issues and solutions

## See Also

- [Development Setup](../development/setup.md) - For contributors
- [Testing Guide](../development/testing.md) - Running tests
